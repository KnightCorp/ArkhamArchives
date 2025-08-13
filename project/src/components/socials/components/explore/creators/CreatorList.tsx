import React from 'react';
import { CreatorCard } from './CreatorCard';
import type { Creator } from './types';

interface CreatorListProps {
  creators: Creator[];
}

export const CreatorList = ({ creators }: CreatorListProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {creators.map((creator) => (
      <CreatorCard key={creator.id} creator={creator} />
    ))}
  </div>
);