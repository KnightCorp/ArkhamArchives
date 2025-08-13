export interface Reel {
  id: string;
  creator: {
    name: string;
    avatar: string;
    username: string;
  };
  thumbnail: string;
  views: number;
  likes: number;
  duration: string;
  title: string;
}