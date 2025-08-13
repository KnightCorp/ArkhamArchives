import React, { useState } from 'react';
import { TechClubTabs } from '../components/techclub/TechClubTabs';
import { TechClubContent } from '../components/techclub/TechClubContent';

const TechClub = () => {
  const [activeTab, setActiveTab] = useState('learning');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-matrix-dark/20 to-cyber-purple/10" />
        
        <div className="relative p-12">
          <div className="max-w-3xl">
            <div className="inline-block">
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-matrix to-cyber-gold mb-2 riddler-text">
                ? Tech Club ?
              </h1>
              <div className="h-1 bg-gradient-to-r from-matrix to-transparent matrix-glow" />
            </div>
            
            <p className="text-matrix/80 text-xl mt-6 font-code">
              Where code meets mystery. Join our exclusive community of digital detectives and puzzle solvers.
            </p>

            <div className="mt-8 flex space-x-4">
              <button className="px-6 py-3 bg-black/50 backdrop-blur-sm text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all cyber-border font-code">
                Join the Network
              </button>
              <button className="px-6 py-3 bg-black/30 backdrop-blur-sm text-matrix/70 border border-matrix/20 rounded-lg hover:text-matrix transition-all font-code">
                Learn More ?
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-32 h-32">
          <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-matrix/20 rounded-bl-3xl" />
          <div className="absolute top-4 right-4 w-4 h-4 bg-matrix/20 rounded-full matrix-glow" />
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        <TechClubTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <TechClubContent activeTab={activeTab} />
      </div>
    </div>
  );
};

export default TechClub;