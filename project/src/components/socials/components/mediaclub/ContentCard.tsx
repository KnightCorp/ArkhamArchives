import React from 'react';
import { Feather } from 'lucide-react';

interface ContentCardProps {
  title: string;
  message: string;
}

export const ContentCard = ({ title, message }: ContentCardProps) => (
  <div className="bg-[#1a0f0f]/90 academia-border rounded-lg p-8 text-center backdrop-blur-sm blood-scroll">
    <div className="flex justify-center mb-4">
      <div className="w-16 h-16 rounded-full bg-[#0a0505] flex items-center justify-center border border-[#8B0000]/30 shadow-[0_0_15px_rgba(139,0,0,0.2)]">
        <Feather className="w-8 h-8 text-[#B8864D]" />
      </div>
    </div>
    <h2 className="text-2xl academia-text academia-gold mb-2">{title}</h2>
    <p className="text-[#B8864D]/80 academia-text italic">
      {message}
    </p>
  </div>
);