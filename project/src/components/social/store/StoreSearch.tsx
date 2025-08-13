import React from 'react';
import { Search } from 'lucide-react';

interface StoreSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const StoreSearch = ({ searchQuery, onSearchChange }: StoreSearchProps) => (
  <div className="relative mb-6">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search className="h-5 w-5 text-silver/60" />
    </div>
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search through the archives..."
      className="w-full pl-10 pr-4 py-3 bg-[#1a0f0f] border border-[#8B0000]/30 rounded-lg text-silver placeholder-silver/40 focus:outline-none focus:border-[#8B0000]/60 transition-colors academia-text"
    />
  </div>
);