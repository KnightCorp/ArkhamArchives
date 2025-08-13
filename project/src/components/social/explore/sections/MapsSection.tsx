import React, { useState } from 'react';
import { Search, MapPin, Users, Calendar } from 'lucide-react';

export const MapsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const locations = [
    {
      id: 1,
      name: 'The Dark Room',
      type: 'Venue',
      coordinates: '40.7128° N, 74.0060° W',
      occupancy: '45/100',
      events: 3
    },
    {
      id: 2,
      name: 'Noir Cafe',
      type: 'Social Space',
      coordinates: '40.7589° N, 73.9851° W',
      occupancy: '28/50',
      events: 2
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Map View */}
      <div className="col-span-2 bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <div className="aspect-[16/10] bg-zinc-800 rounded-lg relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&h=900&fit=crop" 
            alt="Map"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/50" />
          
          {/* Location Markers */}
          {locations.map((location, index) => (
            <div
              key={location.id}
              className="absolute w-3 h-3 bg-purple-500 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform"
              style={{
                left: `${30 + (index * 20)}%`,
                top: `${40 + (index * 15)}%`
              }}
            >
              <div className="absolute -top-2 -right-2 w-2 h-2 bg-purple-500 rounded-full animate-ping" />
            </div>
          ))}
        </div>
      </div>

      {/* Locations List */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-zinc-200"
          />
        </div>

        <div className="space-y-4">
          {locations.map((location) => (
            <div key={location.id} className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-zinc-200">{location.name}</h3>
                <span className="text-zinc-400 text-sm">{location.type}</span>
              </div>
              
              <div className="space-y-2 text-sm text-zinc-400">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{location.coordinates}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{location.occupancy}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{location.events} upcoming events</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};