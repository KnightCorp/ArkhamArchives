// Cloudinary configuration for video uploads
// Add these environment variables to your .env file:
// VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
// VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your-cloud-name",
  uploadPreset:
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your-upload-preset",
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || "your-api-key",
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || "your-api-secret",
};

// Cloudinary video transformation options for optimal web delivery
export const videoTransformations = {
  // Optimized for web streaming
  webOptimized: {
    quality: "auto:good",
    format: "auto",
    flags: "progressive",
    video_codec: "auto",
  },

  // Thumbnail generation
  thumbnail: {
    width: 640,
    height: 360,
    crop: "fill",
    quality: "auto",
    format: "jpg",
    resource_type: "video",
  },

  // Mobile optimized
  mobile: {
    width: 720,
    quality: "auto:low",
    format: "mp4",
    video_codec: "h264",
  },

  // Desktop optimized
  desktop: {
    width: 1280,
    quality: "auto:good",
    format: "mp4",
    video_codec: "h264",
  },
};

// Upload options for different file types
export const uploadOptions = {
  video: {
    resource_type: "video",
    folder: "arkham/videos",
    allowed_formats: ["mp4", "mov", "avi", "mkv", "webm"],
    transformation: [
      { quality: "auto:good" },
      { format: "auto" },
      { flags: "progressive" },
    ],
    eager: [
      // Generate web-optimized version
      {
        width: 1280,
        height: 720,
        crop: "limit",
        quality: "auto:good",
        format: "mp4",
        video_codec: "h264",
      },
      // Generate thumbnail
      {
        width: 640,
        height: 360,
        crop: "fill",
        quality: "auto",
        format: "jpg",
        resource_type: "video",
        start_offset: "10%",
      },
    ],
    eager_async: true,
  },

  audio: {
    resource_type: "video", // Cloudinary uses 'video' for audio files too
    folder: "arkham/audio",
    allowed_formats: ["mp3", "wav", "aac", "m4a", "ogg"],
    transformation: [{ quality: "auto:good" }, { format: "auto" }],
  },

  image: {
    resource_type: "image",
    folder: "arkham/images",
    allowed_formats: ["jpg", "png", "gif", "webp"],
    transformation: [
      { quality: "auto:good" },
      { format: "auto" },
      { fetch_format: "auto" },
    ],
  },
};
