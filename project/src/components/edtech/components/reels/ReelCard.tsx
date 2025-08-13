import React from 'react';
import { Play, Heart, Eye } from 'lucide-react';
import type { Reel } from '../../types/reel';

interface ReelCardProps {
  reel: Reel;
}

export const ReelCard = ({ reel }: ReelCardProps) => (
  <div className="group relative aspect-[9/16] rounded-lg overflow-hidden bg-zinc-900">
    <img
      src={reel.thumbnail}
      alt={reel.title}
      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
    />
    
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Play className="w-6 h-6 text-white" />
        </button>
      </div>
      
      {/* Creator info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center mb-2">
          <img
            src={reel.creator.avatar}
            alt={reel.creator.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <h3 className="text-white text-sm font-medium">{reel.creator.name}</h3>
            <p className="text-white/70 text-xs">{reel.creator.username}</p>
          </div>
        </div>
        
        <h4 className="text-white text-sm mb-2">{reel.title}</h4>
        
        <div className="flex items-center text-xs text-white/70 space-x-4">
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {reel.views.toLocaleString()}
          </div>
          <div className="flex items-center">
            <Heart className="w-4 h-4 mr-1" />
            {reel.likes.toLocaleString()}
          </div>
          <div className="ml-auto">{reel.duration}</div>
        </div>
      </div>
    </div>
  </div>
);