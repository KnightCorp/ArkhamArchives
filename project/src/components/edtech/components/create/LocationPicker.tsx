import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface LocationPickerProps {
  onClose: () => void;
  onSelect: (location: string) => void;
}

export const LocationPicker = ({ onClose, onSelect }: LocationPickerProps) => {
  const [search, setSearch] = useState('');
  
  const mockLocations = [
    'The Dark Room, New York',
    'Noir Cafe, Brooklyn',
    'Shadow Gallery, Manhattan',
    'Midnight Lounge, Queens'
  ];
  
  const filteredLocations = mockLocations.filter(loc =>
    loc.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none text-white placeholder-zinc-500 focus:ring-0"
          />
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredLocations.map((location) => (
            <button
              key={location}
              onClick={() => onSelect(location)}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <MapPin className="w-5 h-5 text-zinc-400" />
              <span className="text-white">{location}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};