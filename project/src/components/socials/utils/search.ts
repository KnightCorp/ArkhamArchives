import type { StoreItem } from '../types/store';

export const searchItems = (items: readonly StoreItem[], query: string): StoreItem[] => {
  if (!query.trim()) return [...items];
  
  const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
  
  return items.filter(item => {
    const searchableText = [
      item.title,
      item.description,
      item.seller.name,
      ...item.tags
    ].join(' ').toLowerCase();
    
    return searchTerms.every(term => searchableText.includes(term));
  });
};