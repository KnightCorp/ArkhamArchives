import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { SearchTabs } from './SearchTabs';
import { SearchContent } from './SearchContent';
import { DetectiveAI } from './DetectiveAI';

export const SearchLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('primary');

  return (
    <div className="min-h-screen bg-black text-white font-montserrat">
      {/* Search Header with Glass Effect */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596825205490-7263b87acf8b?auto=format&fit=crop&w=1920')] opacity-5 bg-cover bg-center mix-blend-overlay" />
        <div className="relative">
          <div className="max-w-4xl mx-auto px-6">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bat-red" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH ARCHIVES"
                className="w-full bg-black/40 backdrop-blur-xl border-2 border-bat-red/30 rounded-lg pl-12 pr-4 py-4 text-white placeholder-bat-red/50 focus:outline-none focus:border-bat-red/50 transition-colors font-bold tracking-wider uppercase"
              />
              <div className="absolute inset-0 shadow-[0_0_15px_rgba(220,38,38,0.2)] pointer-events-none rounded-lg animate-pulse-glow" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Glass Effect */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-white/5 p-6 mb-8">
          <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="relative mt-8">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596825205490-7263b87acf8b?auto=format&fit=crop&w=1920')] opacity-5 bg-cover bg-center mix-blend-overlay" />
            <div className="relative">
              <SearchContent activeTab={activeTab} />
            </div>
          </div>
        </div>
        <DetectiveAI />
      </div>
    </div>
  );
};