import React from 'react';
import { AddonCard } from './AddonCard';
import { addons } from './data';

export const AddonsList = () => {
  const handleInstall = (id: string) => {
    // Handle installation logic here
    console.log(`Installing addon ${id}`);
  };

  return (
    <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
      {addons.map((addon) => (
        <AddonCard
          key={addon.id}
          addon={addon}
          onInstall={handleInstall}
        />
      ))}
    </div>
  );
};