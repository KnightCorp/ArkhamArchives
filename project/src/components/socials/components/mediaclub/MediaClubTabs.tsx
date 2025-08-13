import React from 'react';
import { BookOpen, Trophy, Edit, Vote, Film, Users, Star, Newspaper } from 'lucide-react';

interface MediaClubTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mode: 'detective' | 'gossip';
}

const tabs = [
  { id: 'learning', label: 'Learning Modules', icon: BookOpen },
  { id: 'writing', label: 'Writing Studio', icon: Edit },
  { id: 'films', label: 'Film Workshop', icon: Film },
  { id: 'news', label: 'News Room', icon: Newspaper },
  { id: 'competitions', label: 'Competitions', icon: Trophy },
  { id: 'collaborations', label: 'Collaborations', icon: Users },
  { id: 'featured', label: 'Featured Works', icon: Star },
  { id: 'submissions', label: 'Submissions', icon: Vote }
];

export const MediaClubTabs = ({ activeTab, onTabChange, mode }: MediaClubTabsProps) => (
  <div className="flex flex-wrap gap-2 mb-8">
    {tabs.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        onClick={() => onTabChange(id)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
          mode === 'detective'
            ? activeTab === id
              ? 'bg-black/80 text-[#00ff00] border border-[#00ff00]/30'
              : 'text-[#00ff00]/40 hover:text-[#00ff00]/60 hover:bg-black/40'
            : activeTab === id
              ? 'bg-[#1a0f0f] text-[#8B0000] border-b-2 border-[#8B0000]'
              : 'text-[#8B0000]/60 hover:text-[#8B0000] hover:bg-[#1a0f0f]/50'
        }`}
      >
        <Icon className="w-4 h-4" />
        <span>{mode === 'detective' ? label.toUpperCase() : label}</span>
      </button>
    ))}
  </div>
);