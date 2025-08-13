# Cloudinary Setup Guide for Arkham Library

## Why Cloudinary?

Cloudinary provides superior video handling compared to raw storage solutions:

✅ **Automatic Video Optimization**: Converts videos to web-optimized formats
✅ **Reliable Streaming**: Global CDN with adaptive streaming
✅ **Thumbnail Generation**: Auto-generates video thumbnails
✅ **Format Support**: Handles all major video/audio formats
✅ **Progress Tracking**: Real-time upload progress
✅ **Size Limits**: Up to 100MB on free tier (vs 1MB file issues with Supabase)

## Quick Setup (5 minutes)

### 1. Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Note your **Cloud Name** from the dashboard

### 2. Create Upload Preset

1. In Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `arkham_uploads` (or any name)
   - **Signing mode**: `Unsigned` (important!)
   - **Folder**: `arkham` (optional, for organization)
   - **Allowed formats**: `mp4,mov,avi,mkv,webm,mp3,wav,aac,m4a,jpg,png,gif,webp`
   - **Auto tagging**: Enable if desired
   - **Quality**: `Auto` (recommended)
5. Click **Save**

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your values:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
   VITE_CLOUDINARY_UPLOAD_PRESET=arkham_uploads
   ```

### 4. Test the Setup

1. Start your development server
2. Try uploading a video through the Library interface
3. Check Cloudinary dashboard for uploaded files

## Advanced Configuration

### Upload Preset Settings

For optimal performance, configure your upload preset with:

```json
{
  "folder": "arkham",
  "resource_type": "auto",
  "allowed_formats": [
    "mp4",
    "mov",
    "avi",
    "mkv",
    "webm",
    "mp3",
    "wav",
    "aac",
    "jpg",
    "png",
    "gif",
    "webp"
  ],
  "transformation": [
    { "quality": "auto:good" },
    { "format": "auto" },
    { "flags": "progressive" }
  ],
  "eager": [
    {
      "width": 1280,
      "height": 720,
      "crop": "limit",
      "quality": "auto:good",
      "format": "mp4"
    },
    {
      "width": 640,
      "height": 360,
      "crop": "fill",
      "quality": "auto",
      "format": "jpg",
      "start_offset": "10%"
    }
  ],
  "eager_async": true
}
```

### File Size Limits

| Plan     | Video Limit | Total Storage |
| -------- | ----------- | ------------- |
| Free     | 100MB       | 25GB          |
| Plus     | 500MB       | 75GB          |
| Advanced | 1GB         | 200GB         |

### Supported Formats

**Videos**: MP4, MOV, AVI, MKV, WebM, FLV, 3GP
**Audio**: MP3, WAV, AAC, M4A, OGG, FLAC
**Images**: JPG, PNG, GIF, WebP, TIFF, BMP

## Features Enabled

### 1. Automatic Video Optimization

- Converts all videos to web-optimized MP4
- Adjusts bitrate for streaming
- Progressive loading for better UX

### 2. Thumbnail Generation

- Auto-generates thumbnails from 10% mark of video
- 640x360 resolution for consistency
- JPG format for fast loading

### 3. Upload Progress Tracking

- Real-time progress bars
- File validation before upload
- Error handling with user-friendly messages

### 4. Multiple Quality Options

Videos are processed into multiple qualities:

- **720p**: 1280x720 for desktop viewing
- **480p**: 854x480 for standard viewing
- **360p**: 640x360 for mobile/slow connections

### 5. Smart Transformations

- **Quality**: Auto-optimized based on content
- **Format**: Auto-selects best format for browser
- **Compression**: Optimized for web delivery

## Migration from Supabase Storage

The new implementation:

1. **Replaces** Supabase Storage uploads with Cloudinary
2. **Maintains** Supabase database for metadata
3. **Improves** video playback reliability
4. **Adds** automatic thumbnail generation
5. **Provides** upload progress tracking

### Database Changes

No database migration needed! The system still stores:

- `video_url`: Now points to Cloudinary URLs
- `thumbnail`: Auto-generated from videos
- `file_path`: Cloudinary public_id for advanced operations
- `file_size`: Actual file size from Cloudinary
- `file_type`: Optimized format from Cloudinary

## Troubleshooting

### Common Issues

**1. Upload fails with "Invalid upload preset"**

- Check upload preset name in `.env`
- Ensure preset is set to "Unsigned"

**2. Videos don't play**

- Cloudinary auto-converts to web formats
- Check browser console for errors
- Verify video was processed (check Cloudinary dashboard)

**3. Slow uploads**

- Cloudinary free tier has rate limits
- Large files take time to process
- Check your internet connection

**4. Missing thumbnails**

- Thumbnails generate after video processing
- May take 1-2 minutes for large videos
- Check Cloudinary dashboard for processing status

### Debug Mode

Enable debug logging by adding to your `.env`:

```env
VITE_DEBUG_UPLOADS=true
```

This will log detailed upload information to the browser console.

## Best Practices

### File Preparation

1. **Use MP4** for fastest processing
2. **Keep under 50MB** for best UX
3. **720p resolution** is usually sufficient
4. **Test locally** before uploading

### Upload Guidelines

1. **One file at a time** to avoid timeouts
2. **Wait for processing** before navigating away
3. **Check thumbnails** are generated correctly
4. **Test playback** immediately after upload

### Performance Tips

1. Videos auto-optimize for web delivery
2. Thumbnails load faster than video previews
3. Cloudinary CDN provides global fast delivery
4. Progressive loading improves perceived speed

## Cost Optimization

### Free Tier Usage

- 25GB storage
- 25GB monthly bandwidth
- 1000 transformations/month
- Perfect for small to medium libraries

### Monitoring Usage

1. Check Cloudinary dashboard monthly
2. Monitor transformation credits
3. Consider compression settings
4. Delete unused files regularly

## Support

If you encounter issues:

1. Check Cloudinary dashboard for processing status
2. Review browser console for errors
3. Verify environment variables
4. Test with small sample files first

For Cloudinary-specific issues, refer to [Cloudinary Documentation](https://cloudinary.com/documentation).

## Next Steps

With Cloudinary integrated, you can now:

1. ✅ Upload videos up to 100MB reliably
2. ✅ Get automatic thumbnails from videos
3. ✅ Stream videos with global CDN performance
4. ✅ Support all major video/audio formats
5. ✅ Track upload progress in real-time

The Library is now production-ready for video content!
