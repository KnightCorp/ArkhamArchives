import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs = ({ tabs, activeTab, onChange }: TabsProps) => (
  <div className="flex space-x-2 border-b border-zinc-800">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`px-4 py-2 -mb-px transition-all ${
          activeTab === tab.id
            ? 'text-white border-b-2 border-white metallic-shine rounded-t-lg'
            : 'text-zinc-400 hover:text-white'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);