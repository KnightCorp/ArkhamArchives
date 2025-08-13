export interface PostUser {
  name: string;
  avatar: string;
}

export interface Post {
  id: number;
  user: PostUser;
  image: string;
  likes: number;
  caption: string;
  comments: number;
}