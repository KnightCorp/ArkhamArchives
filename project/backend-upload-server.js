// Backend server for secure Cloudinary uploads
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import { config } from "dotenv";

// Load environment variables from the correct path
config({ path: "./project/.env" });

// Also try loading from current directory if the above fails
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  config(); // Load from current directory
}

console.log("Environment check:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME
    ? "✅ Found"
    : "❌ Missing",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY
    ? "✅ Found"
    : "❌ Missing",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    ? "✅ Found"
    : "❌ Missing",
  PORT: process.env.PORT || "3001 (default)",
});

const app = express();
const port = process.env.PORT || 3001;

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

console.log("Cloudinary config values:", {
  cloud_name: cloudinaryConfig.cloud_name ? "✅ Present" : "❌ Missing",
  api_key: cloudinaryConfig.api_key ? "✅ Present" : "❌ Missing",
  api_secret: cloudinaryConfig.api_secret ? "✅ Present" : "❌ Missing",
});

cloudinary.config(cloudinaryConfig);

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow video, audio, and image files
    const allowedTypes = [
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/webm",
      "audio/mp3",
      "audio/wav",
      "audio/aac",
      "audio/ogg",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

// Upload endpoint
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("📁 Upload request received");
    console.log("🔧 Cloudinary config check:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✅" : "❌",
      api_key: process.env.CLOUDINARY_API_KEY ? "✅" : "❌",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "✅" : "❌",
    });

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📄 File details:", {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Check if file size is suspiciously small
    if (req.file.size < 10000) {
      // Less than 10KB
      console.warn("⚠️ File size is very small, might be corrupted");
      return res.status(400).json({
        error: "File appears to be corrupted or too small",
        details: `File size: ${req.file.size} bytes. Expected at least 10KB for video files.`,
      });
    }

    const { resourceType = "auto" } = req.body;

    // Determine resource type based on file type
    let cloudinaryResourceType = "auto";
    if (req.file.mimetype.startsWith("video/")) {
      cloudinaryResourceType = "video";
    } else if (req.file.mimetype.startsWith("audio/")) {
      cloudinaryResourceType = "video"; // Cloudinary treats audio as video
    } else if (req.file.mimetype.startsWith("image/")) {
      cloudinaryResourceType = "image";
    }

    console.log("☁️ Using Cloudinary resource type:", cloudinaryResourceType);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: cloudinaryResourceType,
          folder: "arkham_library",
          use_filename: true,
          unique_filename: false,
          overwrite: false,
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("✅ Cloudinary upload successful:", result.secure_url);
            resolve(result);
          }
        }
      );

      uploadStream.end(req.file.buffer);
    });

    res.json({
      success: true,
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      resource_type: uploadResult.resource_type,
      format: uploadResult.format,
      duration: uploadResult.duration,
      bytes: uploadResult.bytes,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: error.message || "Upload failed",
      details: error.http_code
        ? `Cloudinary error: ${error.http_code}`
        : "Server error",
    });
  }
});

// Large file upload endpoint
app.post("/api/upload-large", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // For large files, use upload_large method
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(
        req.file.buffer,
        {
          resource_type: "video",
          folder: "arkham_library",
          use_filename: true,
          unique_filename: false,
          overwrite: false,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary large upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    res.json({
      success: true,
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      resource_type: uploadResult.resource_type,
      format: uploadResult.format,
      duration: uploadResult.duration,
      bytes: uploadResult.bytes,
    });
  } catch (error) {
    console.error("Large upload error:", error);
    res.status(500).json({
      error: error.message || "Large upload failed",
      details: error.http_code
        ? `Cloudinary error: ${error.http_code}`
        : "Server error",
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    port: port,
    cloudinary: {
      configured: !!(
        process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY
      ),
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    },
  });
});

// Test endpoint for CORS
app.get("/test", (req, res) => {
  res.json({
    message: "CORS test successful",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });
});

// Handle preflight requests
app.options("/api/upload", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

app.options("/health", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Upload server running on port ${port}`);
  console.log(`📁 Upload endpoint: http://localhost:${port}/api/upload`);
  console.log(
    `📁 Large upload endpoint: http://localhost:${port}/api/upload-large`
  );
  console.log(`🔍 Health check: http://localhost:${port}/health`);
});

export default app;
