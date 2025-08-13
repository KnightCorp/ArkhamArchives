import React from 'react';
import { Lock } from 'lucide-react';

interface MediaClubSectionProps {
  title: string;
  description: string;
  image: string;
  status: 'available' | 'coming-soon' | 'locked';
}

export const MediaClubSection = ({ title, description, image, status }: MediaClubSectionProps) => (
  <div className="bg-[#1a0f0f]/90 academia-border rounded-lg overflow-hidden">
    <div className="relative aspect-video">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
      />
      {status !== 'available' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="text-center">
            <Lock className="w-8 h-8 text-[#B8864D] mx-auto mb-2" />
            <span className="text-[#B8864D] academia-text">
              {status === 'coming-soon' ? 'Coming Soon' : 'Premium Content'}
            </span>
          </div>
        </div>
      )}
    </div>
    <div className="p-6">
      <h3 className="text-xl text-[#B8864D] academia-text mb-2">{title}</h3>
      <p className="text-[#B8864D]/80 academia-text">{description}</p>
    </div>
  </div>
);