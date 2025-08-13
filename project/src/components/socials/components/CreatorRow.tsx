import React from 'react';
import { Plus } from 'lucide-react';

interface Creator {
  id: number;
  name: string;
  avatar: string;
  profession: string;
}

const CreatorRow = () => {
  const creators: Creator[] = [
    {
      id: 1,
      name: "Vincent Gray",
      avatar: "https://images.unsplash.com/photo-1492288991661-058aa541ff43?w=150&h=150&fit=crop",
      profession: "Street Photographer"
    },
    {
      id: 2,
      name: "Nina Blake",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
      profession: "Jazz Musician"
    },
    {
      id: 3,
      name: "Marcus Stone",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      profession: "Film Director"
    },
    {
      id: 4,
      name: "Clara Night",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      profession: "Artist"
    }
  ];

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex space-x-4 p-2">
        {creators.map((creator) => (
          <div key={creator.id} className="flex-none">
            <div className="w-48 bg-zinc-900 rounded-lg p-4 hover:bg-zinc-800 transition-colors border border-purple-900/30 shadow-[0_0_15px_rgba(147,51,234,0.1)]">
              <div className="relative mb-3">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-20 h-20 rounded-full mx-auto grayscale hover:grayscale-0 transition-all ring-2 ring-purple-500/50"
                />
                <button className="absolute bottom-0 right-12 bg-purple-500 rounded-full p-1 hover:bg-purple-600 transition-colors shadow-[0_0_10px_rgba(147,51,234,0.5)]">
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="text-center">
                <h3 className="text-purple-100 font-medium">{creator.name}</h3>
                <p className="text-purple-300/60 text-sm">{creator.profession}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};