# Library Component - Supabase Integration

## Overview

The Library component has been updated to connect to Supabase for managing video/audio tutorial content with full CRUD operations, similar to how ExamLeaderboard.tsx is integrated.

## Features Added

### 🎯 Core Functionality

- **Content Management**: Full CRUD operations for video/audio tutorials
- **User Authentication**: Integration with Supabase Auth
- **Search & Filter**: Real-time search and category filtering
- **User Favorites**: Add/remove content from personal favorites
- **View Tracking**: Automatic view counting when content is accessed
- **Content Categories**: Featured, Popular, and New Arrivals sections

### 🔧 CRUD Operations

1. **Create**: Add new video/audio content (authenticated users only)
2. **Read**: View all content with filtering and search
3. **Update**: Edit content (only by content creators)
4. **Delete**: Remove content (only by content creators)

### 📊 Database Schema

- `content_items`: Main content table
- `user_favorites`: User favorite content tracking
- `content_views`: View tracking for analytics
- `content_ratings`: User ratings and reviews

## Setup Instructions

### 1. Run SQL Schema

Execute the provided SQL script in your Supabase SQL editor:

```sql
-- Run the queries from supabase_library_schema.sql
```

### 2. Enable RLS (Row Level Security)

The schema includes proper RLS policies for:

- Public content viewing
- User-specific favorites and views
- Content creator permissions

### 3. Sample Data

The schema includes sample content to get started:

- Gothic/Dark Arts themed content
- Various instructors and departments
- Different content types (video/audio)

## Component Features

### 🎨 UI Components

- **Header with Add Button**: Authenticated users can add content
- **Search Bar**: Real-time content search
- **Category Filters**: All Content, Video Lectures, Audio Content
- **Content Cards**: Responsive grid layout with hover effects
- **Content Modal**: Detailed view with play functionality
- **Add/Edit Form**: Comprehensive form for content management

### 🔐 Permission System

- **Public**: View all content, search, and filter
- **Authenticated**: All public features + favorites, view tracking
- **Content Creators**: All features + edit/delete their own content

### 📱 Responsive Design

- Mobile-friendly layout
- Adaptive grid system
- Touch-friendly interactions
- Dark theme consistent with Arkham Academy

## API Integration

### Supabase Functions Used

- `content_items` table operations
- `user_favorites` for personal collections
- `content_views` for analytics
- `content_ratings` for user feedback

### Real-time Features

- Live search results
- Instant favorites updates
- Real-time view counting
- Dynamic content categorization

## Usage Examples

### Adding New Content

1. User must be authenticated
2. Click "Add Content" button
3. Fill out the comprehensive form
4. Submit to create new content

### Editing Content

1. Only content creators can edit their content
2. Click edit icon on content cards
3. Modify details in the form
4. Save changes

### User Favorites

1. Click heart icon on any content
2. Add/remove from personal favorites
3. Favorites are stored per user in Supabase

## File Structure

```
src/components/edtech/pages/Library.tsx - Main component
supabase_library_schema.sql - Database schema and sample data
```

## Dependencies

- React with TypeScript
- Supabase client
- React Hot Toast for notifications
- Lucide React for icons
- Tailwind CSS for styling

## Future Enhancements

- Video player integration
- Content rating system
- Advanced search filters
- Content recommendations
- Analytics dashboard
- Batch content operations
- Content moderation system
