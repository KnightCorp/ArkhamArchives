import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface KeywordSearchProps {
  onSelect: (keyword: string) => void;
  suggestions: string[];
  placeholder?: string;
}

export const KeywordSearch = ({ onSelect, suggestions, placeholder }: KeywordSearchProps) => {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="relative">
      <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder || "Search keywords..."}
          className="bg-transparent border-none text-white placeholder-zinc-500 focus:ring-0 w-full px-2"
        />
        {search && (
          <button onClick={() => setSearch('')}>
            <X className="w-4 h-4 text-zinc-400 hover:text-white" />
          </button>
        )}
      </div>

      {showSuggestions && search && (
        <div className="absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                onSelect(suggestion);
                setSearch('');
                setShowSuggestions(false);
              }}
              className="w-full px-4 py-2 text-left text-zinc-300 hover:bg-zinc-800 first:rounded-t-lg last:rounded-b-lg"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};