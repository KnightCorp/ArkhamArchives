import React, { useState } from "react";
import { Search, Filter, X, DollarSign, Star, Clock } from "lucide-react";
import { SearchFilters } from "../../../types";

interface SearchEngineProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  availableTags: string[];
}

const SearchEngine: React.FC<SearchEngineProps> = ({
  onSearch,
  availableTags,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    tags: [],
    priceRange: [0, 1000],
    difficulty: [],
    rating: 0,
    availability: "both",
  });

  const handleSearch = () => {
    onSearch(searchQuery, filters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...(prev.tags || []), tag],
    }));
  };

  const toggleDifficulty = (difficulty: string) => {
    setFilters((prev) => ({
      ...prev,
      difficulty: prev.difficulty?.includes(difficulty)
        ? prev.difficulty.filter((d) => d !== difficulty)
        : [...(prev.difficulty || []), difficulty],
    }));
  };

  const clearFilters = () => {
    setFilters({
      tags: [],
      priceRange: [0, 1000],
      difficulty: [],
      rating: 0,
      availability: "both",
    });
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.tags && filters.tags.length > 0) count++;
    if (filters.difficulty && filters.difficulty.length > 0) count++;
    if (filters.rating && filters.rating > 0) count++;
    if (filters.availability !== "both") count++;
    if (
      filters.priceRange &&
      (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000)
    )
      count++;
    return count;
  };

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="w-full bg-black/50 border border-white/20 text-white pl-10 pr-4 py-3 focus:border-white focus:outline-none"
            placeholder="Search teachers, classes, topics..."
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 border transition-colors relative ${
            showFilters
              ? "bg-white/20 text-white border-white/30"
              : "text-white border-white/20 hover:border-white/50"
          }`}
        >
          <Filter className="w-5 h-5 inline mr-2" />
          FILTERS
          {activeFiltersCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount()}
            </span>
          )}
        </button>

        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-colors"
        >
          SEARCH
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-black/80 border border-white/20 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold">ADVANCED_FILTERS</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearFilters}
                className="text-white/60 hover:text-white text-sm"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tags Filter */}
            <div>
              <label className="block text-white/80 text-sm mb-3">
                Subject Tags
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-1 text-xs border transition-colors ${
                      filters.tags?.includes(tag)
                        ? "bg-white/20 text-white border-white/30"
                        : "text-white/80 border-white/20 hover:border-white/50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-white/80 text-sm mb-3">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Price Range
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-white/60 text-xs">Min:</span>
                  <input
                    type="number"
                    value={filters.priceRange?.[0] || 0}
                    onChange={(e) =>
                      handleFilterChange("priceRange", [
                        parseInt(e.target.value) || 0,
                        filters.priceRange?.[1] || 1000,
                      ])
                    }
                    className="flex-1 bg-black/50 border border-white/20 text-white px-2 py-1 text-sm focus:border-white focus:outline-none"
                    min="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white/60 text-xs">Max:</span>
                  <input
                    type="number"
                    value={filters.priceRange?.[1] || 1000}
                    onChange={(e) =>
                      handleFilterChange("priceRange", [
                        filters.priceRange?.[0] || 0,
                        parseInt(e.target.value) || 1000,
                      ])
                    }
                    className="flex-1 bg-black/50 border border-white/20 text-white px-2 py-1 text-sm focus:border-white focus:outline-none"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-white/80 text-sm mb-3">
                Difficulty Level
              </label>
              <div className="space-y-2">
                {["beginner", "intermediate", "advanced"].map((level) => (
                  <button
                    key={level}
                    onClick={() => toggleDifficulty(level)}
                    className={`w-full px-3 py-1 text-xs border transition-colors text-left ${
                      filters.difficulty?.includes(level)
                        ? "bg-white/20 text-white border-white/30"
                        : "text-white/80 border-white/20 hover:border-white/50"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-white/80 text-sm mb-3">
                <Star className="w-4 h-4 inline mr-1" />
                Minimum Rating
              </label>
              <select
                value={filters.rating || 0}
                onChange={(e) =>
                  handleFilterChange("rating", parseFloat(e.target.value))
                }
                className="w-full bg-black/50 border border-white/20 text-white px-2 py-1 text-sm focus:border-white focus:outline-none"
              >
                <option value={0}>Any Rating</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-white/80 text-sm mb-3">
                <Clock className="w-4 h-4 inline mr-1" />
                Class Type
              </label>
              <select
                value={filters.availability || "both"}
                onChange={(e) =>
                  handleFilterChange("availability", e.target.value)
                }
                className="w-full bg-black/50 border border-white/20 text-white px-2 py-1 text-sm focus:border-white focus:outline-none"
              >
                <option value="both">Live & Recorded</option>
                <option value="live">Live Only</option>
                <option value="recorded">Recorded Only</option>
              </select>
            </div>
          </div>

          {/* Active Filters Summary */}
          {activeFiltersCount() > 0 && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                <span className="text-white/60 text-sm">Active filters:</span>
                {filters.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white/20 text-white text-xs border border-white/30"
                  >
                    {tag}
                  </span>
                ))}
                {filters.difficulty?.map((diff) => (
                  <span
                    key={diff}
                    className="px-2 py-1 bg-white/20 text-white text-xs border border-white/30"
                  >
                    {diff}
                  </span>
                ))}
                {filters.rating && filters.rating > 0 && (
                  <span className="px-2 py-1 bg-white/20 text-white text-xs border border-white/30">
                    {filters.rating}+ stars
                  </span>
                )}
                {filters.availability !== "both" && (
                  <span className="px-2 py-1 bg-white/20 text-white text-xs border border-white/30">
                    {filters.availability}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchEngine;
