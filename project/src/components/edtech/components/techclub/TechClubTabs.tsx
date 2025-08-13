import React from 'react';
import { Brain, Code, Puzzle, Swords, FolderGit2, Trophy, Users, Award } from 'lucide-react';

interface TechClubTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'learning', label: 'Learning Paths', icon: Brain },
  { id: 'playground', label: 'Code Playground', icon: Code },
  { id: 'riddles', label: 'Riddles & Challenges', icon: Puzzle },
  { id: 'arena', label: 'PvP Arena', icon: Swords },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'leaderboards', label: 'Leaderboards', icon: Trophy },
  { id: 'groups', label: 'Group Projects', icon: Users },
  { id: 'masters', label: 'Code Masters', icon: Award }
];

export const TechClubTabs = ({ activeTab, onTabChange }: TechClubTabsProps) => {
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-xl p-2 border border-white/5">
      <div className="flex flex-wrap gap-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-code backdrop-blur-sm ${
              activeTab === id
                ? 'bg-black/50 text-emerald-400 border border-emerald-500/30 matrix-glow'
                : 'text-emerald-400/40 hover:text-emerald-400/60 hover:bg-black/30'
            }`}
          >
            <Icon className={`w-5 h-5 ${activeTab === id ? 'animate-pulse-slow' : ''}`} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};