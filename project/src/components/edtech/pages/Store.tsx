import React, { useState } from 'react';
import { StoreHeader } from '../components/store/StoreHeader';
import { StoreSearch } from '../components/store/StoreSearch';
import { StoreFilters } from '../components/store/StoreFilters';
import { StoreGrid } from '../components/store/StoreGrid';
import { storeItems } from '../data/store';
import { searchItems } from '../utils/search';
import type { StoreFilters as StoreFiltersType } from '../types/store';
import '../styles/themes/darkAcademia.css';

const Store = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<StoreFiltersType>({
    category: null,
    minPrice: null,
    maxPrice: null,
    condition: null,
    sortBy: 'recent'
  });

  const filteredItems = searchItems(storeItems, searchQuery)
    .filter(item => !filters.category || item.category === filters.category)
    .filter(item => !filters.condition || item.condition === filters.condition)
    .filter(item => !filters.minPrice || item.price >= filters.minPrice)
    .filter(item => !filters.maxPrice || item.price <= filters.maxPrice)
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
          return b.seller.rating - a.seller.rating;
        default:
          return new Date(b.listed).getTime() - new Date(a.listed).getTime();
      }
    });

  return (
    <div className="max-w-7xl mx-auto dark-academia-gradient min-h-screen p-8 rounded-lg">
      <StoreHeader />
      <StoreSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <StoreFilters filters={filters} onFilterChange={setFilters} />
      <StoreGrid items={filteredItems} />
    </div>
  );
};

export default Store;