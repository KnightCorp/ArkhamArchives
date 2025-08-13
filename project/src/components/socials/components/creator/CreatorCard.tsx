import React from 'react';
import { Plus } from 'lucide-react';

interface Creator {
  id: number;
  name: string;
  avatar: string;
  profession: string;
}

interface CreatorCardProps {
  creator: Creator;
}

export const CreatorCard = ({ creator }: CreatorCardProps) => (
  <div className="w-48 bg-gradient-to-b from-[#f5f5f5]/10 to-[#e0e0e0]/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] marble-texture">
    <div className="relative mb-3">
      <img
        src={creator.avatar}
        alt={creator.name}
        className="w-20 h-20 rounded-full mx-auto grayscale hover:grayscale-0 transition-all ring-2 ring-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
      />
      <button className="absolute bottom-0 right-12 bg-white/10 backdrop-blur-sm rounded-full p-1.5 hover:bg-white/20 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.1)]">
        <Plus className="w-4 h-4 text-white" />
      </button>
    </div>
    <div className="text-center">
      <h3 className="text-white/90 font-cormorant text-lg tracking-wide">{creator.name}</h3>
      <p className="text-white/60 font-cormorant text-sm italic">{creator.profession}</p>
    </div>
  </div>
);