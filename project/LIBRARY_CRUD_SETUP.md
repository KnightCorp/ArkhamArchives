# Library CRUD Operations Setup Guide

This guide explains how to set up and use the CRUD operations for videos in the Library component using Supabase and Cloudinary.

## Overview

The Library component now supports full CRUD operations:

- **Create**: Add new video/audio content with file uploads
- **Read**: Display content in organized sections (Featured, New Arrivals, Popular)
- **Update**: Edit existing content and replace media files
- **Delete**: Remove content from the library

## Features

✨ **File Upload**: Upload videos and thumbnails to Cloudinary
📊 **Database Integration**: Store metadata in Supabase
🔍 **Search & Filter**: Search by title, instructor, department, or tags
📱 **Responsive Design**: Works on all device sizes
🎨 **Dark Theme**: Consistent with the Arkham aesthetic
👥 **Admin Controls**: Edit and delete buttons on hover
📈 **View Tracking**: Automatic view count incrementing
⭐ **Ratings**: Display content ratings
🏷️ **Tags**: Categorize content with tags

## Prerequisites

1. **Supabase Project**: You need a Supabase project set up
2. **Cloudinary Account**: For media file storage
3. **Environment Variables**: Configured properly

## Setup Instructions

### 1. Database Setup

Run the migration SQL file to create the necessary table and functions:

```sql
-- Execute the content of supabase_library_content_migration.sql in your Supabase SQL editor
```

This creates:

- `library_content` table with all necessary columns
- Row Level Security policies for authenticated users
- `increment_views` function for tracking views
- Automatic `updated_at` trigger
- Sample data for testing

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
VITE_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

#### Getting Cloudinary Credentials:

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard to get Cloud Name, API Key, and API Secret
3. Create an Upload Preset:
   - Go to Settings > Upload
   - Click "Add upload preset"
   - Set it to "Unsigned" for frontend uploads
   - Configure folder and transformations as needed

#### Getting Supabase Credentials:

1. Go to your Supabase project settings
2. Copy the Project URL and anon/public key

### 3. File Structure

The updated Library component includes:

```
Library.tsx
├── Main Library Component
├── ContentCard Component (displays individual content)
├── ContentFormModal Component (add/edit form)
└── ContentViewModal Component (view content details)
```

## Usage

### Adding New Content

1. Click the "Add Content" button in the top-right corner
2. Fill in the required fields:
   - **Title**: Content title
   - **Type**: Video or Audio
   - **Duration**: Length (e.g., "1:45:30")
   - **Instructor**: Content creator/instructor name
   - **Department**: Subject department
   - **Description**: Detailed description
   - **Tags**: Comma-separated tags
   - **Video File**: Upload the actual video/audio file
   - **Thumbnail**: Upload a preview image
3. Click "Save" to upload and create the content

### Editing Content

1. Hover over any content card
2. Click the edit (pencil) icon that appears
3. Modify the fields as needed
4. Upload new files if you want to replace them
5. Click "Update" to save changes

### Deleting Content

1. Hover over any content card
2. Click the delete (trash) icon that appears
3. Confirm the deletion in the popup

### Viewing Content

1. Click on any content card to open the detailed view
2. If a video URL is available, it will show a video player
3. View metadata, tags, and statistics
4. Click the X or outside the modal to close

### Search and Filter

- Use the search bar to find content by title, instructor, department, or tags
- Click category buttons (All Content, Video Lectures, Audio Content) to filter by type

## Database Schema

### library_content Table

| Column      | Type      | Description             |
| ----------- | --------- | ----------------------- |
| id          | UUID      | Primary key             |
| title       | TEXT      | Content title           |
| type        | TEXT      | 'video' or 'audio'      |
| duration    | TEXT      | Duration string         |
| thumbnail   | TEXT      | Thumbnail image URL     |
| instructor  | TEXT      | Instructor/creator name |
| department  | TEXT      | Subject department      |
| views       | INTEGER   | View count              |
| rating      | NUMERIC   | Average rating          |
| description | TEXT      | Content description     |
| tags        | TEXT[]    | Array of tags           |
| preview     | TEXT      | Preview URL             |
| video_url   | TEXT      | Main content URL        |
| created_at  | TIMESTAMP | Creation time           |
| updated_at  | TIMESTAMP | Last update time        |

### Functions

- `increment_views(content_id UUID)`: Increments view count for content

## Security

- Row Level Security is enabled on the `library_content` table
- Only authenticated users can perform CRUD operations
- All uploads go through Cloudinary's secure API
- Environment variables keep credentials safe

## Troubleshooting

### Common Issues

1. **Upload Failing**: Check Cloudinary credentials and upload preset
2. **Database Errors**: Ensure migration was run successfully
3. **Authentication Issues**: Verify user is logged in to Supabase
4. **File Size Limits**: Cloudinary has upload limits based on your plan

### Error Messages

- "Failed to upload to Cloudinary": Check your Cloudinary configuration
- "Failed to fetch content": Check Supabase connection and RLS policies
- "User not authenticated": Ensure user is logged in

## Future Enhancements

Possible improvements to consider:

- 📊 Analytics dashboard for content performance
- 💬 Comments and reviews system
- 📚 Playlists and collections
- 🔄 Content versioning
- 📤 Bulk upload functionality
- 🎯 Recommendation engine
- 📊 Advanced filtering and sorting options

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure your Supabase policies allow the current user's actions
4. Check Cloudinary upload logs in their dashboard

## Code Examples

### Adding Custom Validation

```typescript
const validateForm = (): boolean => {
  if (!formData.title) {
    toast.error("Title is required");
    return false;
  }
  if (!formData.instructor) {
    toast.error("Instructor is required");
    return false;
  }
  return true;
};
```

### Custom File Processing

```typescript
const processVideoFile = async (file: File): Promise<string> => {
  // Add video processing logic here
  // e.g., compression, format conversion
  return await uploadToCloudinary(file, "video");
};
```

This setup provides a complete CRUD system for managing video content with a professional, scalable architecture.
