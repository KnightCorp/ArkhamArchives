export interface PostUser {
  name: string;
  avatar: string;
  karma?: number;
}

export interface Post {
  id: number;
  user: PostUser;
  image: string;
  likes: number;
  caption: string;
  comments: number;
  impressions?: number;
}