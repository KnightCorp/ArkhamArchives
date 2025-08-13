import React from "react";
import type { StoreFilters as StoreFiltersType } from "../types/store";

interface StoreFiltersProps {
  filters: StoreFiltersType;
  onFilterChange: (filters: StoreFiltersType) => void;
}

export const StoreFilters = ({
  filters,
  onFilterChange,
}: StoreFiltersProps) => (
  <div className="bg-[#1a0f0f]/90 p-6 rounded-lg border border-[#8B0000]/30 mb-8 academia-border">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <select
        value={filters.category || ""}
        onChange={(e) =>
          onFilterChange({ ...filters, category: e.target.value || null })
        }
        className="bg-[#0a0505] text-silver rounded-lg px-4 py-2 border border-[#8B0000]/30 academia-text"
      >
        <option value="">All Categories</option>
        <option value="art">Art</option>
        <option value="collectibles">Collectibles</option>
        <option value="digital">Digital</option>
        <option value="physical">Physical</option>
        <option value="experiences">Experiences</option>
      </select>

      <select
        value={filters.condition || ""}
        onChange={(e) =>
          onFilterChange({ ...filters, condition: e.target.value || null })
        }
        className="bg-[#0a0505] text-silver rounded-lg px-4 py-2 border border-[#8B0000]/30 academia-text"
      >
        <option value="">Any Condition</option>
        <option value="new">New</option>
        <option value="like-new">Like New</option>
        <option value="used">Used</option>
        <option value="vintage">Vintage</option>
      </select>

      <div className="flex space-x-2">
        <input
          type="number"
          placeholder="Min $"
          value={filters.minPrice || ""}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              minPrice: e.target.value ? Number(e.target.value) : null,
            })
          }
          className="bg-[#0a0505] text-silver rounded-lg px-4 py-2 border border-[#8B0000]/30 w-full academia-text"
        />
        <input
          type="number"
          placeholder="Max $"
          value={filters.maxPrice || ""}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              maxPrice: e.target.value ? Number(e.target.value) : null,
            })
          }
          className="bg-[#0a0505] text-silver rounded-lg px-4 py-2 border border-[#8B0000]/30 w-full academia-text"
        />
      </div>

      <select
        value={filters.sortBy}
        onChange={(e) =>
          onFilterChange({
            ...filters,
            sortBy: e.target.value as StoreFiltersType["sortBy"],
          })
        }
        className="bg-[#0a0505] text-silver rounded-lg px-4 py-2 border border-[#8B0000]/30 academia-text"
      >
        <option value="recent">Most Recent</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="popular">Most Popular</option>
      </select>
    </div>
  </div>
);
