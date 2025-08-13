import { cloudinaryConfig, uploadOptions } from "../lib/cloudinaryConfig";

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  bytes: number;
  duration?: number;
  width?: number;
  height?: number;
  eager?: Array<{
    secure_url: string;
    url: string;
    transformation: string;
  }>;
  thumbnail_url?: string;
  optimized_url?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class CloudinaryUploadService {
  private cloudName: string;
  private uploadPreset: string;

  constructor() {
    this.cloudName = cloudinaryConfig.cloudName;
    this.uploadPreset = cloudinaryConfig.uploadPreset;
  }

  /**
   * Upload a file to Cloudinary with progress tracking
   */
  async uploadFile(
    file: File,
    type: "video" | "audio" | "image",
    onProgress?: (progress: UploadProgress) => void
  ): Promise<CloudinaryUploadResult> {
    // Basic file validation
    if (file.size === 0) {
      throw new Error("File is empty. Please select a valid file.");
    }

    if (type === "video" && file.size < 100000) {
      throw new Error(`Video file seems too small (${file.size} bytes). Please try a different file.`);
    }

    return new Promise((resolve, reject) => {
      const formData = new FormData();

      // Add file and upload parameters
      formData.append("file", file);
      formData.append("upload_preset", this.uploadPreset);
      
      // Add resource type
      if (type === "video") {
        formData.append("resource_type", "video");
      } else if (type === "audio") {
        formData.append("resource_type", "video");
      } else {
        formData.append("resource_type", "image");
      }

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          };
          onProgress(progress);
        }
      });

      // Handle successful upload
      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const result = JSON.parse(xhr.responseText);

            // Process the result to extract useful URLs
            const processedResult: CloudinaryUploadResult = {
              ...result,
              // Extract thumbnail URL from eager transformations
              thumbnail_url: this.extractThumbnailUrl(result),
              // Create optimized streaming URL
              optimized_url: this.createOptimizedUrl(result.public_id, type),
            };

            resolve(processedResult);
          } catch (error) {
            console.error("Failed to parse Cloudinary response:", error);
            reject(new Error("Failed to parse Cloudinary response"));
          }
        } else {
          let errorMessage = `Upload failed with status: ${xhr.status}`;
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            errorMessage = `Upload failed: ${
              errorResponse.error?.message ||
              errorResponse.message ||
              xhr.statusText
            }`;
          } catch (e) {
            errorMessage = `Upload failed with status: ${xhr.status} - ${xhr.statusText}`;
          }
          reject(new Error(errorMessage));
        }
      });

      // Handle upload errors
      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      // Handle upload timeout
      xhr.addEventListener("timeout", () => {
        reject(new Error("Upload timeout"));
      });

      // Configure and send request
      xhr.timeout = 300000; // 5 minutes timeout
      
      // Use appropriate endpoint based on resource type
      let endpoint = "upload";
      if (type === "video" || type === "audio") {
        endpoint = "video/upload";
      } else {
        endpoint = "image/upload";
      }
      
      const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/${endpoint}`;
      xhr.open("POST", uploadUrl);
      xhr.send(formData);
    });
  }

  /**
   * Extract thumbnail URL from eager transformations
   */
  private extractThumbnailUrl(result: any): string | undefined {
    if (result.eager && result.eager.length > 0) {
      // Find the thumbnail transformation (usually the image format one)
      const thumbnail = result.eager.find(
        (eager: any) => eager.format === "jpg" || eager.format === "png"
      );
      return thumbnail?.secure_url;
    }
    return undefined;
  }

  /**
   * Create optimized streaming URL for videos
   */
  private createOptimizedUrl(
    publicId: string,
    type: "video" | "audio" | "image"
  ): string {
    const baseUrl = `https://res.cloudinary.com/${this.cloudName}`;

    switch (type) {
      case "video":
        return `${baseUrl}/video/upload/q_auto:good,f_auto,fl_progressive/${publicId}`;
      case "audio":
        return `${baseUrl}/video/upload/q_auto:good,f_auto/${publicId}`;
      case "image":
        return `${baseUrl}/image/upload/q_auto:good,f_auto/${publicId}`;
      default:
        return `${baseUrl}/auto/upload/${publicId}`;
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(
    file: File,
    type: "video" | "audio" | "image"
  ): { valid: boolean; error?: string } {
    const options = uploadOptions[type];

    // Check file size limits
    const maxSizes = {
      video: 100 * 1024 * 1024, // 100MB for free tier
      audio: 50 * 1024 * 1024, // 50MB
      image: 10 * 1024 * 1024, // 10MB
    };

    if (file.size > maxSizes[type]) {
      return {
        valid: false,
        error: `File too large. Maximum size for ${type} is ${Math.round(
          maxSizes[type] / (1024 * 1024)
        )}MB`,
      };
    }

    // Check file format
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !options.allowed_formats.includes(fileExtension)) {
      return {
        valid: false,
        error: `Unsupported format. Allowed formats: ${options.allowed_formats.join(
          ", "
        )}`,
      };
    }

    return { valid: true };
  }

  /**
   * Generate thumbnail URL for a video
   */
  generateThumbnailUrl(
    publicId: string,
    options?: { width?: number; height?: number }
  ): string {
    const width = options?.width || 640;
    const height = options?.height || 360;

    return `https://res.cloudinary.com/${this.cloudName}/video/upload/so_10,w_${width},h_${height},c_fill,q_auto,f_jpg/${publicId}.jpg`;
  }

  /**
   * Generate multiple quality versions for adaptive streaming
   */
  generateStreamingUrls(publicId: string): { quality: string; url: string }[] {
    return [
      {
        quality: "720p",
        url: `https://res.cloudinary.com/${this.cloudName}/video/upload/w_1280,h_720,c_limit,q_auto:good,f_mp4/${publicId}`,
      },
      {
        quality: "480p",
        url: `https://res.cloudinary.com/${this.cloudName}/video/upload/w_854,h_480,c_limit,q_auto:good,f_mp4/${publicId}`,
      },
      {
        quality: "360p",
        url: `https://res.cloudinary.com/${this.cloudName}/video/upload/w_640,h_360,c_limit,q_auto:low,f_mp4/${publicId}`,
      },
    ];
  }
}

// Export singleton instance
export const cloudinaryUploader = new CloudinaryUploadService();
