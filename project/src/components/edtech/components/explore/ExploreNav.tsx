import React from 'react';
import { 
  Users, Palette, Compass, Calendar, Star,
  Globe, MapPin, Map, Box, Sparkles
} from 'lucide-react';

interface ExploreNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'people', label: 'People', icon: Users },
  { id: 'creators', label: 'Creators', icon: Star },
  { id: 'style', label: 'Style & Vibes', icon: Palette },
  { id: 'interests', label: 'Interests', icon: Compass },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'worlds', label: 'Worlds', icon: Globe },
  { id: 'locations', label: 'City Locations', icon: MapPin },
  { id: 'maps', label: 'Maps', icon: Map },
  { id: 'spaces', label: 'Spaces', icon: Box },
  { id: 'experiences', label: 'Experiences', icon: Sparkles }
];

export const ExploreNav = ({ activeTab, onTabChange }: ExploreNavProps) => (
  <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
    {tabs.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        onClick={() => onTabChange(id)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
          activeTab === id
            ? 'metallic-shine text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
        }`}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </button>
    ))}
  </div>
);