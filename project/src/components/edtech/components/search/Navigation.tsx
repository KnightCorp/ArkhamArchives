import React, { useState } from 'react';
import { Map, Compass, MapPin, Search as SearchIcon } from 'lucide-react';

const locations = [
  {
    id: 1,
    name: 'Crime Scene Alpha',
    type: 'Primary Location',
    coordinates: '40.7128° N, 74.0060° W',
    lastVisited: '2024-03-15 15:30',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Witness Meeting Point',
    type: 'Secondary Location',
    coordinates: '40.7589° N, 73.9851° W',
    lastVisited: '2024-03-14 11:20',
    status: 'Pending'
  },
  {
    id: 3,
    name: 'Evidence Storage Facility',
    type: 'Secure Location',
    coordinates: '40.7549° N, 73.9840° W',
    lastVisited: '2024-03-13 09:45',
    status: 'Restricted'
  }
];

export const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Map View */}
      <div className="col-span-2 bg-zinc-900/50 border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Map className="w-5 h-5 text-white/70" />
            <h3 className="text-lg text-white font-mono tracking-wide">MAP VIEW</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
              <Compass className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="aspect-video bg-black/30 rounded-lg flex items-center justify-center">
          <p className="text-white/50 font-mono">Map visualization loading...</p>
        </div>
      </div>

      {/* Locations List */}
      <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
        <div className="mb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locations..."
              className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          {locations.map((location) => (
            <div key={location.id} className="p-4 bg-black/30 border border-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-mono">{location.name}</h4>
                <span className={`px-2 py-1 rounded text-xs font-mono ${
                  location.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                  location.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {location.status}
                </span>
              </div>
              <p className="text-white/60 text-sm mb-2">{location.type}</p>
              <div className="text-white/40 text-xs space-y-1">
                <p>{location.coordinates}</p>
                <p>Last visited: {location.lastVisited}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};