export interface StoreItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: 'art' | 'collectibles' | 'digital' | 'physical' | 'experiences';
  condition?: 'new' | 'like-new' | 'used' | 'vintage';
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  tags: string[];
  listed: string; // ISO date string
}

export interface StoreFilters {
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  condition: string | null;
  sortBy: 'recent' | 'price-low' | 'price-high' | 'popular';
}