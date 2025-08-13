import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SourceSectionProps {
  title: string;
  icon: LucideIcon;
  items: string[];
}

export const SourceSection = ({ title, icon: Icon, items }: SourceSectionProps) => (
  <div className="bg-black/40 backdrop-blur-xl border-2 border-bat-red/30 rounded-lg p-6 hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all">
    <div className="flex items-center space-x-3 mb-4">
      <Icon className="w-5 h-5 text-bat-red/70" />
      <h3 className="text-lg text-white font-bold tracking-wider uppercase">{title}</h3>
    </div>
    <ul className="space-y-2">
      {items.map((item) => (
        <li 
          key={item} 
          className="text-white/60 font-montserrat hover:text-white cursor-pointer transition-colors pl-4 border-l-2 border-bat-red/20 hover:border-bat-red/50"
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
);