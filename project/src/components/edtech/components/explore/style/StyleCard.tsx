import React from 'react';

interface Style {
  id: string;
  title: string;
  curator: string;
  avatar: string;
  aesthetics: Record<string, number>;
  moodboard: Array<{ url: string }>;
}

interface StyleCardProps {
  style: Style;
}

export const StyleCard = ({ style }: StyleCardProps) => (
  <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all">
    <div className="grid grid-cols-3 gap-1">
      {style.moodboard.map((item, index) => (
        <div key={index} className="aspect-square">
          <img
            src={item.url}
            alt=""
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
          />
        </div>
      ))}
    </div>
    <div className="p-4">
      <h3 className="text-zinc-200 font-medium mb-1">{style.title}</h3>
      <div className="flex items-center">
        <img
          src={style.avatar}
          alt={style.curator}
          className="w-6 h-6 rounded-full mr-2"
        />
        <span className="text-zinc-400 text-sm">{style.curator}</span>
      </div>
    </div>
  </div>
);