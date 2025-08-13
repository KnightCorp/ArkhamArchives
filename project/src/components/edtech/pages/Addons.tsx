import React from 'react';
import { AddonHeader } from '../components/addons/AddonHeader';
import { AddonCategories } from '../components/addons/AddonCategories';
import { AddonGrid } from '../components/addons/AddonGrid';
import { useAddons } from '../hooks/useAddons';

const Addons = () => {
  const { selectedCategory, setSelectedCategory, filteredAddons } = useAddons();

  return (
    <div className="max-w-7xl mx-auto">
      <AddonHeader />
      <AddonCategories 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory} 
      />
      <AddonGrid addons={filteredAddons} />
    </div>
  );
};

export default Addons;