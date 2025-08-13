import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

export const PostActions = () => (
  <div className="flex items-center space-x-4 mb-3">
    <button className="text-zinc-400 hover:text-zinc-200 transition-colors glow-effect p-2 rounded-full">
      <Heart className="h-6 w-6" />
    </button>
    <button className="text-zinc-400 hover:text-zinc-200 transition-colors glow-effect p-2 rounded-full">
      <MessageCircle className="h-6 w-6" />
    </button>
    <button className="text-zinc-400 hover:text-zinc-200 transition-colors glow-effect p-2 rounded-full ml-auto">
      <Share2 className="h-6 w-6" />
    </button>
  </div>
);