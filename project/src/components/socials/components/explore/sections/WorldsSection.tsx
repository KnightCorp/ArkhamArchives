import React from 'react';
import { worlds } from '../../../data/worlds';

export const WorldsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {worlds.map((world) => (
      <div key={world.id} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
        <img src={world.image} alt={world.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl text-zinc-200">{world.name}</h3>
            <span className="text-zinc-400">⭐ {world.rating}</span>
          </div>
          <p className="text-zinc-400 mb-4">{world.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={world.creator.avatar} alt={world.creator.name} className="w-6 h-6 rounded-full mr-2" />
              <span className="text-zinc-500 text-sm">{world.creator.name}</span>
            </div>
            <span className="text-zinc-500 text-sm">{world.population.toLocaleString()} citizens</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);