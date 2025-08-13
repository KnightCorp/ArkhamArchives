import React from 'react';
import { BookOpen } from 'lucide-react';

interface MediaClubHeaderProps {
  mode: 'detective' | 'gossip';
}

export const MediaClubHeader = ({ mode }: MediaClubHeaderProps) => (
  <div className={`border-b ${
    mode === 'detective' 
      ? 'border-[#00ff00]/20' 
      : 'border-[#8B0000]/20'
  } pb-8 mb-8`}>
    <div className="flex items-center space-x-3 mb-4">
      <BookOpen className={`w-8 h-8 ${
        mode === 'detective' ? 'text-[#00ff00]' : 'text-[#8B0000]'
      }`} />
      <h1 className={`text-3xl ${
        mode === 'detective'
          ? 'glitch-text'
          : 'blood-drip'
      }`}>
        {mode === 'detective' ? 'MEDIA_CLUB.exe' : 'The Archives Media Club'}
      </h1>
    </div>
    <p className={`${
      mode === 'detective'
        ? 'text-[#00ff00]/60'
        : 'text-[#8B0000]/80 italic'
    }`}>
      {mode === 'detective'
        ? '> Accessing classified media archives...'
        : '"Where stories transcend time and secrets unfold"'}
    </p>
  </div>
);