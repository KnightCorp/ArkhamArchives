import React from 'react';
import { Play } from 'lucide-react';

interface ProfileMediaProps {
  media: Array<{
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }>;
}

export const ProfileMedia = ({ media }: ProfileMediaProps) => (
  <div className="grid grid-cols-3 gap-2 mb-4">
    {media.map((item, index) => (
      <div key={index} className="relative aspect-square overflow-hidden rounded-lg group">
        <img
          src={item.type === 'video' ? item.thumbnail : item.url}
          alt=""
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
        />
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-8 h-8 text-white" />
          </div>
        )}
      </div>
    ))}
  </div>
);