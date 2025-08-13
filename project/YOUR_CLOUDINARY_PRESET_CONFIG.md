# Your Cloudinary Preset Configuration Guide

## 📋 **Current Preset Status: arkham_uploads**

Based on your current configuration, here's what you need to check and potentially fix:

### ✅ **What's Already Correct:**

- Signing mode: Unsigned ✓
- Overwrite: false ✓
- Use filename: false ✓
- Unique filename: false ✓
- Use filename as display name: true ✓
- Use asset folder as public id prefix: false ✓
- Asset folder: arkham ✓
- Media metadata: true ✓
- Auto chaptering: true ✓
- Type: upload ✓
- Auto transcription: {} ✓

### ❓ **What You Need to Check:**

1. **Allowed Formats** - This is likely the culprit!

   - Go to your preset settings
   - Look for "Allowed formats" or "Format restrictions"
   - **Make sure this field is EMPTY** (no restrictions)
   - If it has any values like "mp4,avi,mov" - remove them all

2. **Resource Type**

   - Make sure it's set to "Auto" (not just "Video" or "Image")
   - This allows the preset to handle both video and audio files

3. **Transformation Parameters**
   - Check if there are any transformation settings
   - Remove any format-related transformations
   - Remove any quality/codec restrictions

## 🔧 **Step-by-Step Fix:**

### 1. Access Your Preset

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Navigate to **Settings** → **Upload**
3. Find **arkham_uploads** preset
4. Click **Edit**

### 2. Check These Critical Settings

```
Resource Type: Auto (not Video or Image)
Allowed formats: [EMPTY - remove all restrictions]
Transformations: [EMPTY - no format transformations]
```

### 3. Verify Upload Types

Make sure your preset allows:

- ✅ API image
- ✅ API video
- ✅ API raw (this is important for audio files)

### 4. Save and Test

1. Click **Save**
2. Wait 2-3 minutes for changes to propagate
3. Try uploading again

## 🧪 **Test Your Configuration:**

After making changes, test with these file types:

- ✅ MP4 video (should work)
- ✅ MP3 audio (should work)
- ✅ JPG image (should work)

## 🚨 **Still Getting Errors?**

If you're still getting "Format parameter is not allowed":

### Quick Debug Steps:

1. **Check the actual error response** in browser DevTools → Network tab
2. **Look for the exact parameter** that's causing issues
3. **Compare your preset settings** with the error message

### Create a Test Preset:

1. Create a new preset named `arkham_test`
2. Set only these minimal settings:
   - Signing mode: Unsigned
   - Resource type: Auto
   - Leave everything else as default
3. Update your `.env`:
   ```
   VITE_CLOUDINARY_UPLOAD_PRESET=arkham_test
   ```
4. Test the upload

### Contact Support Checklist:

If nothing works, provide these details:

- ✅ Your cloud name
- ✅ Preset name
- ✅ Exact error message
- ✅ File type you're trying to upload
- ✅ Screenshot of your preset settings

## 📝 **Your Environment:**

```
Cloud Name: dfveezcnp
Preset Name: arkham_uploads
Asset Folder: arkham
```

The most likely issue is that your preset has format restrictions that aren't visible in the summary you shared. Check the detailed preset configuration for any format limitations!
