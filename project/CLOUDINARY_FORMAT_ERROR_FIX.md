# Cloudinary "Format parameter is not allowed" Fix

## Problem

You're getting the error: **"Format parameter is not allowed when using unsigned upload"**

This happens when your Cloudinary upload preset has restrictions that conflict with unsigned uploads.

## Root Cause

The error occurs because:

1. Your upload preset might have format restrictions
2. The preset might be configured for signed uploads only
3. There could be conflicting parameters in the preset configuration

## Step-by-Step Solution

### 1. Access Cloudinary Dashboard

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Log in to your account
3. Navigate to **Settings** → **Upload**

### 2. Create or Edit Upload Preset

#### Option A: Edit Existing Preset

1. Find your `arkham_uploads` preset in the list
2. Click **Edit** next to it

#### Option B: Create New Preset

1. Click **Add upload preset**
2. Name it `arkham_uploads`

### 3. Configure Preset Settings

Based on your current setup, update these settings:

```
Basic Settings:
✓ Preset name: arkham_uploads
✓ Signing mode: Unsigned
✓ Resource type: Auto

Upload Parameters:
✓ Allowed formats: (leave empty - this allows all formats)
✓ Max file size: 100000000 (100MB)
✓ Overwrite: false ✓ (your current setting is fine)
✓ Use filename: false ✓ (your current setting is fine)
✓ Unique filename: false ✓ (your current setting is fine)
✓ Use filename as display name: true ✓ (your current setting is fine)
✓ Use asset folder as public id prefix: false ✓ (your current setting is fine)
✓ Asset folder: arkham ✓ (your current setting is fine)

Advanced Settings:
✓ Media metadata: true ✓ (your current setting is fine)
✓ Auto chaptering: true ✓ (your current setting is fine)
✓ Type: upload ✓ (your current setting is fine)
✓ Auto transcription: {} ✓ (your current setting is fine)

Critical Settings to Check:
❌ Make sure "Allowed formats" is EMPTY (no restrictions)
❌ Make sure there are no transformation parameters set
❌ Make sure "Use filename as public ID" is FALSE (you have this correct)
```

### 4. Critical Settings to Avoid

❌ Don't set specific allowed formats
❌ Don't enable "Use filename as public ID"
❌ Don't add any transformation parameters
❌ Don't set signing mode to "Signed"

### 5. Save and Test

1. Click **Save**
2. Wait a few minutes for changes to propagate
3. Try uploading again in your app

## Alternative: Create Minimal Preset

If you're still having issues, create a completely new preset with minimal settings:

1. **Add upload preset**
2. **Name**: `arkham_minimal`
3. **Signing mode**: Unsigned
4. **Resource type**: Auto
5. Leave everything else as default
6. **Save**

Then update your `.env` file:

```env
VITE_CLOUDINARY_UPLOAD_PRESET=arkham_minimal
```

## Verification Steps

After making changes, verify in Cloudinary console:

1. Go to **Settings** → **Upload**
2. Find your preset
3. Check that it shows:
   - ✅ Signing mode: Unsigned
   - ✅ Resource type: Auto
   - ✅ No format restrictions

## Still Having Issues?

If you're still getting errors, try these debugging steps:

### 1. Check Environment Variables

Make sure your `.env` file has:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=arkham_uploads
```

### 2. Test with curl

Test your preset directly:

```bash
curl -X POST \
  https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/video/upload \
  -F "file=@/path/to/test-video.mp4" \
  -F "upload_preset=arkham_uploads"
```

### 3. Check Browser Network Tab

1. Open DevTools → Network
2. Try uploading
3. Look at the failed request
4. Check the response for exact error details

## Common Error Messages and Solutions

| Error                             | Solution                               |
| --------------------------------- | -------------------------------------- |
| "Format parameter is not allowed" | Remove format restrictions from preset |
| "Invalid upload preset"           | Create the preset or check the name    |
| "Must use signed uploads"         | Change signing mode to "Unsigned"      |
| "Resource type not allowed"       | Set resource type to "Auto"            |

## Contact Support

If none of these solutions work:

1. Take screenshots of your preset configuration
2. Share the exact error message
3. Provide your cloud name (not API keys!)

The issue is almost always in the upload preset configuration, and these steps should resolve it.
