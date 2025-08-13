# Video Upload Troubleshooting Guide

## Common Video Upload Issues and Solutions

### 1. Video Format Problems

**Problem**: Video fails to upload or play after upload
**Solutions**:

- Use MP4 format with H.264 video codec for best compatibility
- Avoid proprietary formats like .mov, .avi, .wmv
- Convert videos using online converters or tools like FFmpeg

**Recommended settings**:

```
Format: MP4
Video Codec: H.264
Audio Codec: AAC
Resolution: 1920x1080 or lower
Frame Rate: 30fps or lower
Bitrate: 2-5 Mbps for web streaming
```

### 2. File Size Issues

**Problem**: Upload fails due to file size
**Solutions**:

- Maximum file size: 500MB for videos
- Compress videos using video compression tools
- Lower resolution (720p instead of 4K)
- Reduce bitrate in video encoder

### 3. Supabase Storage Issues

**Problem**: Video uploads but won't play in browser
**Diagnostic steps**:

1. Check if file exists in Supabase Storage dashboard
2. Test direct URL access in browser
3. Verify MIME type is correct
4. Check browser console for CORS errors

**Solutions**:

```sql
-- Update storage bucket settings
UPDATE storage.buckets
SET public = true,
    file_size_limit = 524288000,
    allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/ogg']
WHERE id = 'content-uploads';
```

### 4. Browser Compatibility

**Problem**: Video plays in some browsers but not others
**Solutions**:

- Use MP4 with H.264 codec (universal support)
- Avoid WebM or OGG unless fallbacks provided
- Test in multiple browsers

### 5. Network Issues

**Problem**: Upload starts but fails or times out
**Solutions**:

- Check internet connection stability
- Try uploading smaller files first
- Use wired connection instead of WiFi
- Upload during off-peak hours

### 6. CORS and Security Issues

**Problem**: Video uploads but shows security errors
**Solutions**:

- Ensure Supabase RLS policies allow public read
- Check storage bucket is marked as public
- Verify CORS settings in Supabase

### 7. Video Corruption

**Problem**: Video file appears corrupted after upload
**Diagnostic**:

- Test video plays locally before upload
- Check file integrity
- Try re-encoding the video

**Solutions**:

- Re-export video from original source
- Use different video encoder
- Try uploading a test video

## Best Practices

### Before Upload:

1. **Test locally**: Ensure video plays in browser locally
2. **Check format**: Use MP4 with H.264/AAC
3. **Optimize size**: Compress if over 100MB
4. **Verify duration**: Ensure reasonable length

### During Upload:

1. **Monitor progress**: Watch for errors in browser console
2. **Wait for completion**: Don't navigate away during upload
3. **Check status**: Verify upload success message

### After Upload:

1. **Test playback**: Try playing video immediately
2. **Check URL**: Verify video URL is accessible
3. **Test devices**: Try on different devices/browsers

## Advanced Debugging

### Browser Console Commands:

```javascript
// Test video URL accessibility
fetch("YOUR_VIDEO_URL", { method: "HEAD" }).then((r) =>
  console.log("Status:", r.status)
);

// Get video metadata
const video = document.createElement("video");
video.src = "YOUR_VIDEO_URL";
video.onloadedmetadata = () =>
  console.log(
    "Duration:",
    video.duration,
    "Size:",
    video.videoWidth + "x" + video.videoHeight
  );
```

### Supabase SQL Queries:

```sql
-- Check uploaded files
SELECT * FROM storage.objects WHERE bucket_id = 'content-uploads' ORDER BY created_at DESC LIMIT 10;

-- Check content items
SELECT id, title, video_url, file_path, file_type, file_size FROM content_items ORDER BY created_at DESC LIMIT 10;
```

## Getting Help

If videos still won't upload or play:

1. **Check browser console** for error messages
2. **Test with sample video**: Try uploading a known-good MP4 file
3. **Verify Supabase setup**: Check storage bucket configuration
4. **Contact support**: Provide error messages and video details

## Sample Test Video

For testing purposes, try uploading a small sample video:

- Format: MP4
- Duration: 10-30 seconds
- Size: Under 10MB
- Resolution: 720p or lower

This will help isolate whether the issue is with your specific video file or the upload system.
