# Cloudinary Upload Error Fix Guide

## 🚨 **Common Errors and Solutions**

### Error 1: "Format parameter is not allowed when using unsigned upload"

👉 **See detailed fix:** [CLOUDINARY_FORMAT_ERROR_FIX.md](./CLOUDINARY_FORMAT_ERROR_FIX.md)

**Quick Fix:**

1. Go to Cloudinary Console → Settings → Upload
2. Edit `arkham_uploads` preset
3. Set Signing Mode: **Unsigned**
4. Set Resource Type: **Auto**
5. Remove all format restrictions (leave "Allowed formats" empty)

### Error 2: "Raw file format mp4 not allowed"

This error occurs because your Cloudinary upload preset `arkham_uploads` is configured to restrict raw file uploads.

## 🔧 **Quick Fix - Update Cloudinary Upload Preset**

### Step 1: Go to Cloudinary Dashboard

1. Log in to [Cloudinary Console](https://console.cloudinary.com/)
2. Navigate to **Settings** → **Upload**
3. Find your upload preset `arkham_uploads`

### Step 2: Configure Upload Preset

Click **Edit** on your `arkham_uploads` preset and set:

```
✅ Resource Type: Auto (or Video)
✅ Allowed formats: Leave empty (allows all) OR add: mp4,avi,mov,webm,mp3,wav
✅ Mode: Unsigned (for frontend uploads)
✅ Folder: arkham_library (optional, for organization)
✅ Transformation:
   - Quality: auto:good
   - Format: auto
   - Video Codec: h264 (for videos)
```

### Step 3: Save Changes

Click **Save** to apply the new settings.

## 🚀 **Alternative Solutions**

### Solution A: Backend Upload API (Recommended for large files)

I've created `backend-cloudinary-upload.js` which provides:

- More reliable uploads for large files
- Better error handling
- Server-side processing
- Support for upload_large method

**To implement:**

1. Add the backend upload endpoint to your Express server
2. Install dependencies: `npm install cloudinary multer`
3. The frontend will automatically try backend upload first

### Solution B: Update Frontend Upload Logic

The updated `uploadToCloudinary` function now:

- ✅ Tries backend API first (if available)
- ✅ Falls back to direct Cloudinary upload
- ✅ Better error messages with specific fixes
- ✅ Handles different file sizes appropriately
- ✅ Provides clear troubleshooting steps

## 🔍 **Error Diagnosis & Solutions**

### Error: "Raw file format mp4 not allowed"

**Cause:** Upload preset restricts raw formats
**Fix:** Update preset settings as described above

### Error: "File size too large"

**Cause:** File exceeds Cloudinary limits
**Solutions:**

1. Compress video before upload
2. Use backend API for large files
3. Upgrade Cloudinary plan

### Error: "Invalid upload preset"

**Cause:** Preset `arkham_uploads` doesn't exist
**Fix:** Create the preset in Cloudinary settings

### Error: "Invalid API key"

**Cause:** Wrong Cloudinary credentials
**Fix:** Check your `.env` file:

```env
VITE_CLOUDINARY_CLOUD_NAME=dfveezcnp
VITE_CLOUDINARY_UPLOAD_PRESET=arkham_uploads
VITE_CLOUDINARY_API_KEY=123649581193543
```

## 📊 **File Size & Format Recommendations**

### Supported Video Formats:

- ✅ MP4 (recommended)
- ✅ AVI
- ✅ MOV
- ✅ WebM
- ✅ FLV

### Supported Audio Formats:

- ✅ MP3 (recommended)
- ✅ WAV
- ✅ AAC
- ✅ OGG

### Size Limits:

- **Free Plan:** 10MB per file
- **Basic Plan:** 20MB per file
- **Plus Plan:** 100MB per file
- **Advanced Plan:** 500MB per file

## 🛠️ **Testing Your Fix**

After updating the upload preset:

1. **Test Small Video (< 10MB):**

   - Should work with direct upload
   - Check console for success messages

2. **Test Large Video (> 10MB):**

   - May require backend API
   - Will show specific error if not supported

3. **Test Different Formats:**
   - MP4, AVI, MOV should all work
   - Unsupported formats will show clear error

## 🔄 **Backup Plan - YouTube/Vimeo Integration**

If Cloudinary continues to have issues, consider:

```javascript
// Alternative: Store video URLs instead of uploading
const videoSources = {
  youtube: "https://youtube.com/watch?v=...",
  vimeo: "https://vimeo.com/...",
  direct: "https://your-server.com/videos/...",
};
```

## 📞 **Support Contacts**

- **Cloudinary Support:** https://support.cloudinary.com/
- **Documentation:** https://cloudinary.com/documentation/video_upload_api_reference
- **Community:** https://community.cloudinary.com/

## ✅ **Verification Checklist**

- [ ] Upload preset `arkham_uploads` exists
- [ ] Resource type set to "Auto" or "Video"
- [ ] Allowed formats configured (empty = all allowed)
- [ ] API credentials correct in `.env`
- [ ] File size within plan limits
- [ ] Video format is supported (MP4 recommended)
- [ ] Backend API implemented (for large files)

Follow these steps and your uploads should work perfectly! 🎉
