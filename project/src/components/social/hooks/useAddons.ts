import { useState, useMemo } from 'react';
import { addons } from '../data/addons';

export const useAddons = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredAddons = useMemo(() => {
    if (selectedCategory === 'all') return addons;
    return addons.filter(addon => addon.category === selectedCategory);
  }, [selectedCategory]);

  return {
    selectedCategory,
    setSelectedCategory,
    filteredAddons
  };
};