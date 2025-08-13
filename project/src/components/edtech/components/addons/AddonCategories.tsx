import React from 'react';
import { categories } from '../../data/addons';

interface AddonCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const AddonCategories = ({ selectedCategory, onCategoryChange }: AddonCategoriesProps) => (
  <div className="flex flex-wrap gap-2 mb-8">
    <button
      onClick={() => onCategoryChange('all')}
      className={`px-4 py-2 rounded-lg transition-colors ${
        selectedCategory === 'all'
          ? 'bg-zinc-800 text-white'
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
      }`}
    >
      All Modules
    </button>
    {categories.map((category) => (
      <button
        key={category.id}
        onClick={() => onCategoryChange(category.id)}
        className={`px-4 py-2 rounded-lg transition-colors ${
          selectedCategory === category.id
            ? 'bg-zinc-800 text-white'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
        }`}
      >
        {category.name}
      </button>
    ))}
  </div>
);