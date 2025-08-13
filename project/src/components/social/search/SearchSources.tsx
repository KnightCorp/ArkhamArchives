import React from 'react';
import { Newspaper, Globe, Users } from 'lucide-react';

const sources = {
  investigation: [
    {
      title: 'NEWS ARCHIVES',
      items: [
        'Daily Chronicle - Latest Edition',
        'Metro Times Investigation',
        'City Herald Reports',
        'Evening Standard Coverage',
        'Morning Post Analysis',
        'Weekly Tribune Special'
      ]
    },
    {
      title: 'WEB RECORDS',
      items: [
        'Police Database Entries',
        'Government Records',
        'Public Archives',
        'Digital Library Access',
        'Historical Records',
        'Case File Database'
      ]
    },
    {
      title: 'SOCIAL CHANNELS',
      items: [
        'Witness Network Updates',
        'Community Forums',
        'Local Groups Discussion',
        'Public Testimonies',
        'Anonymous Tips',
        'Neighborhood Watch'
      ]
    }
  ]
};

interface SearchSourcesProps {
  activeTab: string;
}

export const SearchSources = ({ activeTab }: SearchSourcesProps) => {
  const sourceIcons = {
    'NEWS ARCHIVES': Newspaper,
    'WEB RECORDS': Globe,
    'SOCIAL CHANNELS': Users
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sources[activeTab as keyof typeof sources]?.map(({ title, items }) => {
        const Icon = sourceIcons[title as keyof typeof sourceIcons];
        return (
          <div key={title} className="bg-[#1a0f0f]/90 rounded-lg p-6 academia-border blood-scroll">
            <div className="flex items-center space-x-3 mb-4">
              {Icon && <Icon className="w-5 h-5 text-silver" />}
              <h3 className="text-lg text-silver academia-text">{title}</h3>
            </div>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item} className="text-silver/80 academia-text hover:text-silver cursor-pointer transition-colors">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};