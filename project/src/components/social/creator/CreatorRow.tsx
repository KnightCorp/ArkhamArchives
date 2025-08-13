import React from 'react';
import { CreatorCard } from './CreatorCard';
import { creators } from './data';

export const CreatorRow = () => {
  return (
    <div className="relative mb-8 overflow-x-auto">
      {/* Marble Background Effect */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517329782449-810562a4ec2f?w=1920&h=400&fit=crop')] bg-cover bg-center opacity-5 mix-blend-overlay" />
      
      {/* Content */}
      <div className="relative">
        <div className="flex space-x-4 p-4">
          {creators.map((creator) => (
            <div key={creator.id} className="flex-none">
              <CreatorCard creator={creator} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};