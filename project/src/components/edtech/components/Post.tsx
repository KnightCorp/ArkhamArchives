import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface PostUser {
  name: string;
  avatar: string;
}

interface PostProps {
  id: number;
  user: PostUser;
  image: string;
  likes: number;
  caption: string;
  comments: number;
}

const Post = ({ user, image, likes, caption, comments }: PostProps) => {
  return (
    <div className="bg-zinc-900 rounded-lg shadow-xl mb-6 border border-purple-900/30 shadow-[0_0_20px_rgba(147,51,234,0.1)]">
      <div className="p-4 flex items-center">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full grayscale hover:grayscale-0 transition-all ring-2 ring-purple-500/50"
        />
        <span className="ml-3 font-medium text-purple-100">{user.name}</span>
      </div>
      <img 
        src={image} 
        alt="" 
        className="w-full grayscale hover:grayscale-0 transition-all"
      />
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-3">
          <button className="text-purple-400 hover:text-red-500 transition-colors">
            <Heart className="h-6 w-6" />
          </button>
          <button className="text-purple-400 hover:text-purple-500 transition-colors">
            <MessageCircle className="h-6 w-6" />
          </button>
          <button className="text-purple-400 hover:text-purple-500 transition-colors ml-auto">
            <Share2 className="h-6 w-6" />
          </button>
        </div>
        <div className="font-medium text-purple-100">{likes} likes</div>
        <p className="mt-2 text-purple-300/80">
          <span className="font-medium text-purple-100">{user.name}</span> {caption}
        </p>
        <button className="text-purple-500 text-sm mt-1 hover:text-purple-400 transition-colors">
          View all {comments} comments
        </button>
      </div>
    </div>
  );
};