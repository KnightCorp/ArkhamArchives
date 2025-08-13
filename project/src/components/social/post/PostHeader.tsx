import React from 'react';
import { PostUser } from './types';

interface PostHeaderProps {
  user: PostUser;
}

export const PostHeader = ({ user }: PostHeaderProps) => (
  <div className="p-4 flex items-center">
    <img
      src={user.avatar}
      alt={user.name}
      className="w-10 h-10 rounded-full grayscale hover:grayscale-0 transition-all ring-2 ring-zinc-700"
    />
    <span className="ml-3 font-medium text-zinc-200">{user.name}</span>
  </div>
);