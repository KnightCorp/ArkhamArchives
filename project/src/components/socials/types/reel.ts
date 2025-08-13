export interface Reel {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration: number; // Duration in seconds
  file_size?: number;
  video_format?: string;
  likes_count: number;
  views_count: number;
  comments_count: number;
  shares_count: number;
  is_published: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  // Joined data from profiles
  creator_name?: string;
  creator_username?: string;
  creator_avatar?: string;
  creator_karma?: number;
  // User interaction status
  is_liked_by_user?: boolean;
}
