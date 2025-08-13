import React, { useState } from 'react';
import { Search, Filter, Star, Users, DollarSign, Calendar, Tag } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchEngineProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  availableTags: string[];
}

const SearchEngine: React.FC<SearchEngineProps> = ({ onSearch, availableTags }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    tags: [],
    priceRange: [0, 1000],
    difficulty: [],
    rating: 0,
    availability: 'all'
  });

  const handleSearch = () => {
    onSearch(query, filters);
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const toggleDifficulty = (difficulty: string) => {
    setFilters(prev => ({
      ...prev,
      difficulty: prev.difficulty.includes(difficulty)
        ? prev.difficulty.filter(d => d !== difficulty)
        : [...prev.difficulty, difficulty]
    }));
  };

  return (
    <div className="black-glass white-glow p-6 mb-6">
      {/* Search Bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-black/50 border border-white/20 text-white pl-10 pr-4 py-3 focus:border-green-400 focus:outline-none"
            placeholder="Search teachers, subjects, or topics..."
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 border transition-colors flex items-center gap-2 ${
            showFilters
              ? 'bg-green-400/20 text-green-400 border-green-400/30'
              : 'bg-white/10 text-white border-white/20 hover:border-green-400/50'
          }`}
        >
          <Filter className="w-4 h-4" />
          FILTERS
        </button>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-green-400/20 text-green-400 border border-green-400/30 hover:bg-green-400/30 transition-colors"
        >
          [SEARCH]
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="border-t border-white/10 pt-4 space-y-4">
          {/* Tags */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              <span className="text-green-400">TAGS</span>:
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2 py-1 text-xs border transition-colors ${
                    filters.tags.includes(tag)
                      ? 'bg-green-400/20 text-green-400 border-green-400/30'
                      : 'bg-white/10 text-white/80 border-white/20 hover:border-green-400/50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                <span className="text-green-400">PRICE_RANGE</span>:
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [Number(e.target.value), prev.priceRange[1]]
                  }))}
                  className="w-full bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
                  placeholder="Min"
                  min="0"
                />
                <span className="text-white/60 self-center">-</span>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], Number(e.target.value)]
                  }))}
                  className="w-full bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
                  placeholder="Max"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">
                <Star className="w-4 h-4 inline mr-1" />
                <span className="text-green-400">MIN_RATING</span>:
              </label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
                className="w-full bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
              >
                <option value={0}>Any Rating</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>
          </div>

          {/* Difficulty & Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">
                <span className="text-green-400">DIFFICULTY</span>:
              </label>
              <div className="flex gap-2">
                {['beginner', 'intermediate', 'advanced'].map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => toggleDifficulty(difficulty)}
                    className={`px-3 py-1 text-xs border transition-colors capitalize ${
                      filters.difficulty.includes(difficulty)
                        ? 'bg-green-400/20 text-green-400 border-green-400/30'
                        : 'bg-white/10 text-white/80 border-white/20 hover:border-green-400/50'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                <span className="text-green-400">AVAILABILITY</span>:
              </label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value as any }))}
                className="w-full bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
              >
                <option value="all">All Classes</option>
                <option value="upcoming">Upcoming Only</option>
                <option value="ongoing">Ongoing Only</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end">
            <button
              onClick={() => setFilters({
                tags: [],
                priceRange: [0, 1000],
                difficulty: [],
                rating: 0,
                availability: 'all'
              })}
              className="text-white/60 hover:text-white text-sm"
            >
              [CLEAR_FILTERS]
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchEngine;