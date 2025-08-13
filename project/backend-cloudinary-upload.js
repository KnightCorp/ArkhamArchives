// Backend API route for handling Cloudinary uploads
// This should be created as an API endpoint in your backend

const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept videos and images
    if (
      file.mimetype.startsWith("video/") ||
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only video and image files are allowed"), false);
    }
  },
});

// Upload endpoint
const uploadToCloudinary = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { resourceType } = req.body;
    const file = req.file;

    // Determine if it's a video or image
    const isVideo = file.mimetype.startsWith("video/");
    const actualResourceType = isVideo ? "video" : "image";

    // Upload options
    const uploadOptions = {
      resource_type: actualResourceType,
      folder: "arkham_library", // Organize uploads in folders
      quality: "auto:good",
    };

    // Add video-specific options
    if (isVideo) {
      uploadOptions.video_codec = "h264";
      uploadOptions.format = "mp4";
      uploadOptions.flags = "progressive";
      uploadOptions.transformation = [
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ];
    }

    // Use upload_large for large files
    const uploadMethod =
      file.size > 20 * 1024 * 1024
        ? cloudinary.uploader.upload_large
        : cloudinary.uploader.upload;

    const result = await new Promise((resolve, reject) => {
      uploadMethod(file.buffer || file.path, uploadOptions, (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      duration: result.duration, // For videos
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: error.message || "Upload failed",
      details: error.toString(),
    });
  }
};

// Delete endpoint
const deleteFromCloudinary = async (req, res) => {
  try {
    const { publicId, resourceType } = req.body;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || "auto",
    });

    res.json({
      success: true,
      result: result,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      error: error.message || "Delete failed",
    });
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
};

// Example Express.js route setup:
/*
const express = require('express');
const router = express.Router();
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('./cloudinary-upload');

// Upload route
router.post('/upload', upload.single('file'), uploadToCloudinary);

// Delete route
router.delete('/delete', deleteFromCloudinary);

module.exports = router;
*/
