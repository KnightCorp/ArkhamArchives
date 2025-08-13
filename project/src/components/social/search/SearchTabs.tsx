import React from 'react';
import { File, Database, BarChart2, Share2, Globe, FileText, Compass, Clock, Settings } from 'lucide-react';

interface SearchTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'primary', label: 'PRIMARY SOURCES', icon: File },
  { id: 'secondary', label: 'SECONDARY SOURCES', icon: Database },
  { id: 'analysis', label: 'ANALYSIS', icon: BarChart2 },
  { id: 'prep', label: 'PREP TIME', icon: Clock },
  { id: 'reports', label: 'REPORTS', icon: FileText },
  { id: 'navigation', label: 'NAVIGATION', icon: Compass },
  { id: 'p2p', label: 'P2P SEARCH', icon: Share2 },
  { id: 'browser', label: 'WEB BROWSER', icon: Globe },
  { id: 'customization', label: 'CUSTOMIZATION', icon: Settings }
];

export const SearchTabs = ({ activeTab, onTabChange }: SearchTabsProps) => (
  <div className="flex flex-wrap gap-2 mb-8 border-b border-bat-red/20">
    {tabs.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        onClick={() => onTabChange(id)}
        className={`flex items-center space-x-2 px-6 py-4 transition-all font-bold tracking-wider uppercase ${
          activeTab === id
            ? 'bg-black text-bat-red border-b-2 border-bat-red shadow-[0_4px_12px_rgba(220,38,38,0.2)]'
            : 'text-bat-red/60 hover:bg-black/50 hover:text-bat-red'
        }`}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </button>
    ))}
  </div>
);