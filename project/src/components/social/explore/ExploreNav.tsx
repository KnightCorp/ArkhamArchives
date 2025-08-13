import React from 'react';
import { 
  Users, Palette, Compass, Calendar, Star,
  MapPin, Map
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
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'maps', label: 'Maps', icon: Map }
];

export const ExploreNav = ({ activeTab, onTabChange }: ExploreNavProps) => (
  <div className="flex flex-col space-y-2 w-16 fixed left-0 top-0 bottom-0 bg-zinc-900/95 border-r border-zinc-800/50 p-2">
    {tabs.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        onClick={() => onTabChange(id)}
        className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all group ${
          activeTab === id
            ? 'bg-zinc-800 text-white'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
        }`}
        title={label}
      >
        <Icon className="w-5 h-5" />
        <span className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{label}</span>
      </button>
    ))}
  </div>
);

export default ExploreNav;