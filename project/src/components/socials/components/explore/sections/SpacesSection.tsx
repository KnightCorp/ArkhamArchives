import React from 'react';
import { spaces } from '../../../data/spaces';
import { Users } from 'lucide-react';

export const SpacesSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {spaces.map((space) => (
      <div key={space.id} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
        <img src={space.image} alt={space.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl text-zinc-200">{space.name}</h3>
            <span className="text-zinc-400 uppercase text-sm">{space.type}</span>
          </div>
          <div className="flex items-center mb-4">
            <Users className="w-4 h-4 mr-2 text-zinc-400" />
            <span className="text-zinc-400">{space.currentOccupancy}/{space.capacity}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {space.ambiance.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400">
                {tag}
              </span>
            ))}
          </div>
          <div className="text-sm text-zinc-500">
            {space.features.join(' • ')}
          </div>
        </div>
      </div>
    ))}
  </div>
);