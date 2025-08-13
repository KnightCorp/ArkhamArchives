import React from 'react';

interface Interest {
  id: string;
  name: string;
  curator: string;
  avatar: string;
  preferences: Record<string, number>;
  featured: Array<{
    type: string;
    title: string;
    image: string;
  }>;
}

interface InterestCardProps {
  interest: Interest;
}

export const InterestCard = ({ interest }: InterestCardProps) => (
  <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all">
    <div className="grid grid-cols-3 gap-1">
      {interest.featured.map((item, index) => (
        <div key={index} className="aspect-square relative group">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-center">
              <div className="text-zinc-200 text-sm font-medium">{item.title}</div>
              <div className="text-zinc-400 text-xs">{item.type}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="p-4">
      <h3 className="text-zinc-200 font-medium mb-1">{interest.name}</h3>
      <div className="flex items-center">
        <img
          src={interest.avatar}
          alt={interest.curator}
          className="w-6 h-6 rounded-full mr-2"
        />
        <span className="text-zinc-400 text-sm">{interest.curator}</span>
      </div>
    </div>
  </div>
);