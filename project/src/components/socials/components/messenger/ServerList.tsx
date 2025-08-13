import React from 'react';
import { Hash, Users, Crown } from 'lucide-react';

interface Server {
  id: string;
  name: string;
  icon: string;
  type: 'public' | 'private' | 'premium';
}

const servers: Server[] = [
  {
    id: 'general',
    name: 'General',
    icon: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=150&h=150&fit=crop',
    type: 'public'
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: 'https://images.unsplash.com/photo-1614107707379-283a65774553?w=150&h=150&fit=crop',
    type: 'premium'
  }
];

export const ServerList = () => {
  return (
    <div className="space-y-4">
      {servers.map((server) => (
        <button
          key={server.id}
          className="relative w-12 h-12 mx-auto flex items-center justify-center group"
        >
          <img
            src={server.icon}
            alt={server.name}
            className="w-full h-full rounded-full object-cover transition-all group-hover:rounded-2xl grayscale hover:grayscale-0 border border-[#8B0000]/30"
          />
          {server.type === 'premium' && (
            <Crown className="absolute -top-1 -right-1 w-4 h-4 text-[#B8864D]" />
          )}
        </button>
      ))}
    </div>
  );
};