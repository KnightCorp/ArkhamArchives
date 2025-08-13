import React from 'react';
import { PostHeader } from './PostHeader';
import { PostActions } from './PostActions';
import type { Post as PostType } from './types';

interface PostProps extends PostType {}

export const Post = ({ user, image, likes, caption, comments }: PostProps) => {
  return (
    <div className="bg-zinc-900 rounded-lg shadow-xl mb-6 border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
      <PostHeader user={user} />
      <img 
        src={image} 
        alt="" 
        className="w-full grayscale hover:grayscale-0 transition-all"
      />
      <div className="p-4">
        <PostActions />
        <div className="font-medium text-zinc-200">{likes} likes</div>
        <p className="mt-2 text-zinc-400">
          <span className="font-medium text-zinc-200">{user.name}</span> {caption}
        </p>
        <button className="text-zinc-500 text-sm mt-1 hover:text-zinc-300 transition-colors">
          View all {comments} comments
        </button>
      </div>
    </div>
  );
};