import React from 'react';
import { ReelCard } from '../components/reels/ReelCard';
import { reels } from '../data/reels';

const Reels = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-typewriter text-zinc-200 mb-8">
        Reels
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </div>
  );
};

export default Reels;