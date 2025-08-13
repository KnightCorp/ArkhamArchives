# Library File Upload & Optional Fields Documentation

## 🎯 Overview

The Library component now supports both **URL input** and **local file uploads** for content management. This provides flexibility for users to either link to existing online content or upload their own files directly to Supabase Storage.

## 📋 Form Fields Reference

### ✅ **Required Fields**

These fields **MUST** be filled out:

1. **Title** - The name of the content
2. **Type** - Video or Audio (dropdown selection)
3. **Duration Range** - Content length category: <5 min, 5-20 min, or >20 min (dropdown selection)
4. **Instructor** - Name of the instructor/creator
5. **Department** - Academic department or category

### 🔘 **Optional Fields**

These fields can be left empty and have sensible defaults:

#### Content URLs/Files (Choose URL OR File Upload):

- **Thumbnail** - Image preview (URL input OR file upload)
- **Main Content** - Video/Audio file (URL input OR file upload)
- **Preview** - Short preview clip (URL input OR file upload)

#### Metadata:

- **Description** - Detailed content description (defaults to empty)
- **Tags** - Comma-separated keywords (defaults to empty array)

#### Content Flags (All default to `false`):

- **Featured** - Show in featured section
- **Popular** - Show in popular section
- **New Arrival** - Show in new arrivals section

## 📁 File Upload System

### 🔧 **How It Works**

1. **Storage**: Files are uploaded to Supabase Storage bucket `content-uploads`
2. **Organization**: Files are organized by user ID and file type:
   ```
   content-uploads/
   ├── {user_id}/
   │   ├── thumbnails/
   │   ├── content/
   │   └── previews/
   ```
3. **Public URLs**: All uploaded files get public URLs for viewing

### 📊 **File Specifications**

#### **Thumbnail Images**

- **Accepted Formats**: JPEG, PNG, WebP, GIF
- **Recommended Size**: 800x400px (2:1 aspect ratio)
- **Max File Size**: 500MB (configurable)
- **Purpose**: Card preview image

#### **Video Content**

- **Accepted Formats**: MP4, WebM, OGG, AVI, MOV
- **Recommended Format**: MP4 (best compatibility)
- **Max File Size**: 500MB (configurable)
- **Purpose**: Main video content

#### **Audio Content**

- **Accepted Formats**: MP3, WAV, OGG, AAC, FLAC
- **Recommended Format**: MP3 (best compatibility)
- **Max File Size**: 500MB (configurable)
- **Purpose**: Main audio content

#### **Preview Files**

- **Video Previews**: Same formats as main video
- **Audio Previews**: Same formats as main audio
- **Recommended Length**: 30-60 seconds
- **Purpose**: Short teaser/preview

### 🔐 **Security & Permissions**

#### **Upload Permissions**

- ✅ **Authenticated users** can upload files
- ✅ **Public** can view uploaded files
- ✅ **File owners** can update/delete their files
- ❌ **Anonymous users** cannot upload

#### **Storage Policies**

```sql
-- Users can upload to their own folder
CREATE POLICY "Authenticated users can upload content" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'content-uploads' AND
  auth.role() = 'authenticated'
);

-- Public read access for viewing
CREATE POLICY "Public can view uploaded content" ON storage.objects
FOR SELECT USING (bucket_id = 'content-uploads');
```

## 🎨 **UI Features**

### **Dual Input Options**

Each file field offers two options:

1. **URL Input**: Enter direct link to existing online content
2. **File Upload**: Click to browse and upload local files

### **Upload Feedback**

- ✅ **File Selected**: Shows filename when file is chosen
- 🔄 **Upload Progress**: Toast notifications during upload
- ✅ **Success**: Green confirmation when upload completes
- ❌ **Error Handling**: Clear error messages for failed uploads

### **Form Validation**

- **Required fields** are clearly marked
- **Optional fields** are labeled with "(Optional)"
- **File type restrictions** are enforced by browser
- **Real-time validation** prevents invalid submissions

## 💾 **Database Schema**

### **Updated Fields**

```sql
CREATE TABLE content_items (
  -- Required fields
  title VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL,
  duration VARCHAR(20) NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,

  -- Optional fields with NULL defaults
  thumbnail TEXT,                    -- Can be URL or uploaded file path
  description TEXT,                  -- Optional description
  tags TEXT[] DEFAULT '{}',          -- Optional tags array
  preview_url TEXT,                  -- Optional preview URL/path
  video_url TEXT,                    -- Optional main content URL/path
  file_path TEXT,                    -- Path to uploaded file
  file_size BIGINT,                  -- Size in bytes
  file_type VARCHAR(100),            -- MIME type

  -- Optional boolean flags (default false)
  is_featured BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,

  -- Auto-generated fields
  views INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 **Usage Examples**

### **URL-Based Content**

```typescript
const contentData = {
  title: "Gothic Architecture Basics",
  type: "video",
  duration: ">20 min", // Duration range
  instructor: "Prof. Dark",
  department: "Architecture",
  thumbnail: "https://example.com/thumb.jpg", // URL
  video_url: "https://youtube.com/watch?v=123", // URL
  description: "Introduction to gothic styles", // Optional
  tags: "architecture, gothic, history", // Optional
  is_featured: true, // Optional flag
};
```

### **File Upload Content**

```typescript
const contentData = {
  title: "Ancient Mysteries",
  type: "audio",
  duration: "5-20 min", // Duration range
  instructor: "Dr. Raven",
  department: "Occult Studies",
  content_file: audioFile, // File object
  thumbnail_file: imageFile, // File object
  // All other fields optional
};
```

## 🔄 **Migration from URL-Only**

### **Backward Compatibility**

- ✅ Existing URL-based content continues to work
- ✅ New file upload fields are optional
- ✅ Users can mix URLs and uploads (e.g., URL video + uploaded thumbnail)
- ✅ Database handles both storage methods seamlessly

### **Upgrading Existing Content**

Users can edit existing content to:

1. Replace URLs with uploaded files
2. Add missing optional fields
3. Upload thumbnails for content that lacks them

## 📈 **Performance Considerations**

### **File Size Limits**

- **Current Limit**: 500MB per file
- **Configurable**: Can be adjusted in Supabase Storage settings
- **Recommendation**: Compress large video files before upload

### **CDN & Caching**

- ✅ Supabase Storage provides CDN delivery
- ✅ Files are cached globally for fast access
- ✅ Public URLs are optimized for streaming

### **Upload Optimization**

- 🔄 **Chunked Uploads**: Large files are uploaded in chunks
- ⏸️ **Resume Support**: Failed uploads can be resumed
- 🗜️ **Compression**: Consider client-side compression for very large files

## 🛠️ Troubleshooting

### **Video Won't Play**

If your video isn't playing after creation:

1. **Check Video URL**: Ensure you provided either:

   - A valid video URL (e.g., `https://example.com/video.mp4`)
   - OR uploaded a video file using the upload button

2. **Video Format**: Supported formats include:

   - **Video**: MP4, WebM, OGV, MOV
   - **Audio**: MP3, WAV, OGG, M4A

3. **File Size**:

   - Individual files must be under **50MB**
   - For larger files, use external hosting and provide URL

4. **Console Debugging**:
   - Open browser developer tools (F12)
   - Check console for error messages
   - Look for network errors when loading video

#### **Supabase Storage Videos Not Playing**

If you see video controls but a black screen (like in your screenshot):

1. **Check Console Logs**:

   - Open browser DevTools (F12) → Console tab
   - Click the play button and look for error messages
   - Check for CORS, network, or loading errors

2. **Verify URL Format**:

   ```
   ✅ Correct: https://[project].supabase.co/storage/v1/object/public/content-uploads/[path]
   ❌ Avoid: Direct blob URLs or malformed paths
   ```

3. **Test URL Directly**:

   - Copy the video URL from console logs
   - Paste it directly in browser address bar
   - If it downloads/plays, URL is valid; if 404/403, check permissions

4. **Common Supabase Storage Issues**:

   - **CORS**: Supabase storage should allow cross-origin by default for public buckets
   - **File Format**: Use MP4 with H.264 codec for best browser compatibility
   - **File Size**: Large files (>100MB) may timeout during upload
   - **Bucket Policy**: Ensure 'Public can view uploaded content' policy exists

5. **Alternative Solutions**:
   ```javascript
   // Try signed URL if public doesn't work
   const { data } = await supabase.storage
     .from("content-uploads")
     .createSignedUrl("path/to/video.mp4", 3600); // 1 hour expiry
   ```

## 🚀 **Quick Fix for Your Video Issue**

Based on your screenshot showing the Supabase Storage URL, try this immediate solution:

### **Step 1: Test the URL Directly**

Copy this URL and paste it in a new browser tab:

```
https://tnybszihaxdzvcdvlfkc.supabase.co/storage/v1/object/public/content-uploads/7672bc12-a78c-4e2a-8768-7727bae8694c/content/1751912965830.mp4
```

**Expected Results:**

- ✅ **If it downloads/plays**: URL is valid, issue is in video player
- ❌ **If it shows 403/404**: Permission or file issue
- ❌ **If it loads but won't play**: Video format issue

### **Step 2: Check Video Format**

Open terminal and check video details:

```bash
# If you have ffmpeg installed
ffmpeg -i your-video-file.mp4

# Look for:
# - Codec: Should be H.264 for best compatibility
# - Container: MP4 recommended
# - Audio: AAC recommended
```

### **Step 3: Force Re-upload**

If the video format seems wrong:

1. Convert to web-compatible format
2. Re-upload using the Library form
3. Test playback again

### **Step 4: Browser Console Check**

1. Open DevTools (F12) → Console
2. Click play button on your video
3. Look for detailed error messages
4. Share any red error messages for further help

## 🚨 **Your Specific Issue Diagnosis**

Based on your error, the video file `1751912965830.mp4` in your Supabase Storage isn't loading. Here's what to check:

### **Immediate Diagnosis Steps:**

1. **Check File Existence in Supabase Dashboard**:

   - Go to your Supabase project dashboard
   - Navigate to Storage → content-uploads
   - Look for: `7672bc12-a78c-4e2a-8768-7727bae8694c/content/1751912965830.mp4`
   - **If missing**: File upload failed or was deleted
   - **If present**: Check file size and download it to test locally

2. **Test File Properties**:

   ```bash
   # If you can download the file, check its properties:
   file 1751912965830.mp4
   # Should show: MP4 video file

   # Check if it plays locally:
   # Try opening in VLC, QuickTime, or browser
   ```

3. **Common Causes & Solutions**:

   **📁 File Upload Failed**:

   - File was too large (>500MB limit)
   - Upload interrupted/timed out
   - **Solution**: Re-upload with smaller file

   **🎬 Video Format Issues**:

   - Video codec not web-compatible
   - Corrupted during upload
   - **Solution**: Convert to MP4 with H.264 codec

   **🔒 Permission Issues**:

   - Bucket policy incorrect
   - File not actually public
   - **Solution**: Check storage policies in Supabase

### **Quick Fix Actions:**

**Option 1: Re-upload the Video**

1. Go to Library → Edit this content item
2. Remove current video URL
3. Upload the video file again using the upload button
4. Save and test

**Option 2: Convert Video Format**

```bash
# Use ffmpeg to convert to web-compatible format:
ffmpeg -i input.mp4 -c:v libx264 -c:a aac -movflags +faststart output.mp4
```

**Option 3: Check Supabase Storage Directly**

1. Download the file from Supabase Storage dashboard
2. Test if it plays locally
3. If corrupted, re-upload original file

### **Best Practices**

- ✅ Test video URLs before submitting
- ✅ Use MP4 format for best browser compatibility
- ✅ Compress large videos to reduce file size
- ✅ Add both thumbnail and video for better user experience

## 🎯 **FIXED: Video Works in Browser But Not on Website**

### **Problem Resolved:**

You confirmed the video format is correct and the URL works in browser, but not in the embedded video player. This is a classic **video element embedding issue**.

### **Applied Fixes:**

#### **1. Improved Video Element Structure**

```javascript
// NEW: Multiple source fallbacks + better error handling
<video key={url} controls preload="none" playsInline>
  <source src={url} type="video/mp4" />
  <source src={url} type="video/webm" />
  Your browser does not support the video tag.
</video>
```

#### **2. Skip Signed URL Generation**

- **Before**: Generated signed URLs that caused compatibility issues
- **Now**: Uses original public URL directly since it works in browser
- **Result**: Eliminates signed URL compatibility problems

#### **3. Enhanced Video Loading**

- **Key attribute**: Forces video element re-render on URL change
- **preload="none"**: Prevents aggressive preloading that can cause issues
- **Multiple sources**: Provides fallback formats for better compatibility
- **Auto-reload**: Attempts to reload video element on format errors

#### **4. Cache-Busting Only**

- Uses original URL with timestamp parameter
- No complex URL transformations
- Direct path to working video

### **What You Should See Now:**

```

```
