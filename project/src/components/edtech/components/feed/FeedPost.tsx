import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import type { Post } from '../../types/post';

interface FeedPostProps {
  post: Post;
}

export const FeedPost = ({ post }: FeedPostProps) => (
  <div className="bg-black/40 backdrop-blur-xl rounded-lg overflow-hidden mb-8 border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
    <div className="p-4 border-b border-white/10">
      <div className="flex items-center">
        <img
          src={post.user.avatar}
          alt={post.user.name}
          className="w-10 h-10 rounded-full grayscale hover:grayscale-0 transition-all ring-2 ring-white/20"
        />
        <span className="ml-3 text-white/90">{post.user.name}</span>
      </div>
    </div>
    
    <img 
      src={post.image} 
      alt="" 
      className="w-full grayscale hover:grayscale-0 transition-all"
    />
    
    <div className="p-4 bg-black/20 backdrop-blur-sm">
      <div className="flex items-center space-x-4 mb-3">
        <button className="text-white/60 hover:text-white transition-colors">
          <Heart className="h-6 w-6" />
        </button>
        <button className="text-white/60 hover:text-white transition-colors">
          <MessageCircle className="h-6 w-6" />
        </button>
        <button className="text-white/60 hover:text-white transition-colors ml-auto">
          <Share2 className="h-6 w-6" />
        </button>
      </div>
      
      <div className="text-white/90">{post.likes} admirers</div>
      <p className="mt-2 text-white/70">
        <span className="text-white/90 font-medium">{post.user.name}</span> {post.caption}
      </p>
      <button className="text-white/50 text-sm mt-1 hover:text-white transition-colors">
        View all {post.comments} whispers
      </button>
    </div>
  </div>
);