# Upload Without Cloudinary Presets - Complete Guide

## 🎯 **Problem Solved**

You're getting "Format parameter is not allowed" and "Unsupported video format" errors with unsigned uploads. This guide shows you how to upload directly using signed uploads without presets.

## 🔧 **Solution 1: Frontend-Only Signed Uploads (Quick Fix)**

### Step 1: Update Your .env File

Add your Cloudinary API credentials:

```env
# Required for signed uploads
VITE_CLOUDINARY_CLOUD_NAME=dfveezcnp
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret

# Optional for unsigned uploads (can be removed if problematic)
VITE_CLOUDINARY_UPLOAD_PRESET=arkham_uploads
```

### Step 2: Get Your Cloudinary Credentials

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. In your dashboard, you'll see:
   - **Cloud name:** dfveezcnp ✓ (you already have this)
   - **API Key:** Copy this to your .env
   - **API Secret:** Copy this to your .env

### Step 3: Test the Updated Upload

The Library.tsx has been updated to try multiple upload methods:

1. **Signed upload** (tries first if you have API key/secret)
2. **Unsigned preset** (fallback)
3. **Backend API** (if available)

## 🚀 **Solution 2: Backend Server (Recommended for Production)**

### Step 1: Install Backend Dependencies

```bash
# In your project directory
npm install express multer cloudinary cors dotenv
npm install --save-dev nodemon
```

### Step 2: Create Backend Environment File

Create `backend.env`:

```env
CLOUDINARY_CLOUD_NAME=dfveezcnp
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3001
```

### Step 3: Start the Upload Server

```bash
# Option 1: Using the provided server file
node backend-upload-server.js

# Option 2: Using package.json
npm install
npm start

# Option 3: Development mode
npm run dev
```

### Step 4: Test Backend Upload

```bash
# Test with curl
curl -X POST http://localhost:3001/api/upload \
  -F "file=@/path/to/your/video.mp4" \
  -F "resourceType=video"
```

## 📋 **Direct Node.js Upload Examples**

### Simple Video Upload

```javascript
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadVideo() {
  try {
    const result = await cloudinary.uploader.upload("./your-video.mp4", {
      resource_type: "video",
      folder: "arkham_library",
      use_filename: true,
      unique_filename: false,
    });

    console.log("✅ Upload successful:", result.secure_url);
    return result;
  } catch (error) {
    console.error("❌ Upload failed:", error);
  }
}

uploadVideo();
```

### Large File Upload

```javascript
async function uploadLargeFile() {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(
        "./large-video.mp4",
        {
          resource_type: "video",
          folder: "arkham_library",
          chunk_size: 20000000, // 20MB chunks
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    console.log("✅ Large upload successful:", result.secure_url);
    return result;
  } catch (error) {
    console.error("❌ Large upload failed:", error);
  }
}

uploadLargeFile();
```

## 🔍 **Updated Upload Flow**

The Library.tsx now uses this priority order:

1. **Signed Upload** (if API credentials are available)

   - ✅ No preset required
   - ✅ Supports all file formats
   - ✅ More reliable
   - ✅ Better error handling

2. **Unsigned Preset** (fallback)

   - ⚠️ Requires properly configured preset
   - ⚠️ Limited by preset restrictions
   - ⚠️ May fail with "format not allowed" errors

3. **Backend API** (if server is running)
   - ✅ Most secure
   - ✅ Better for large files
   - ✅ Server-side processing
   - ✅ Detailed error handling

## 🛠️ **Environment Variables Explained**

```env
# REQUIRED for signed uploads
VITE_CLOUDINARY_CLOUD_NAME=dfveezcnp
VITE_CLOUDINARY_API_KEY=123456789012345        # Get from Cloudinary dashboard
VITE_CLOUDINARY_API_SECRET=abcdefghijklmnop    # Get from Cloudinary dashboard

# OPTIONAL for unsigned uploads (can cause issues)
VITE_CLOUDINARY_UPLOAD_PRESET=arkham_uploads   # Only if preset is properly configured
```

## 🧪 **Testing Your Setup**

### Test 1: Check Environment Variables

```javascript
console.log("Cloud Name:", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
console.log(
  "API Key:",
  import.meta.env.VITE_CLOUDINARY_API_KEY ? "Present" : "Missing"
);
console.log(
  "API Secret:",
  import.meta.env.VITE_CLOUDINARY_API_SECRET ? "Present" : "Missing"
);
```

### Test 2: Try Different File Types

- ✅ MP4 video
- ✅ MOV video
- ✅ AVI video
- ✅ MP3 audio
- ✅ WAV audio
- ✅ JPG image

### Test 3: Check Upload Methods

1. Upload with API credentials → Should work
2. Upload with preset only → May fail
3. Upload with backend server → Should work best

## 📊 **Comparison: Preset vs No Preset**

| Method          | Preset Required | Security | File Support | Reliability |
| --------------- | --------------- | -------- | ------------ | ----------- |
| Unsigned Upload | ✅ Yes          | Lower    | Limited      | Poor        |
| Signed Upload   | ❌ No           | Higher   | All formats  | Good        |
| Backend Upload  | ❌ No           | Highest  | All formats  | Best        |

## 🔧 **Common Issues and Solutions**

### Issue: "Format parameter is not allowed"

**Solution:** Use signed uploads with API credentials

### Issue: "Unsupported video format"

**Solution:** Use signed uploads or fix preset configuration

### Issue: "Invalid API key"

**Solution:** Double-check your API credentials in .env

### Issue: Large file upload timeout

**Solution:** Use the backend server or upload_large method

## 🎉 **Next Steps**

1. **Add API credentials** to your .env file
2. **Test the updated upload** - it should work now!
3. **Optional:** Set up the backend server for production
4. **Optional:** Remove the problematic upload preset

Your uploads should now work without preset restrictions! 🚀
