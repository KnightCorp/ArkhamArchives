import React from 'react';
import { Package, Shield, Palette, Sparkles } from 'lucide-react';

export const ProfileInventory = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="metallic-shine rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <category.icon className="w-5 h-5 text-zinc-400" />
              <h3 className="text-lg text-white">{category.name}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {category.items.map((item) => (
                <InventoryItem key={item.id} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InventoryItem = ({ name, rarity, image }) => (
  <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
    <img
      src={image}
      alt={name}
      className="w-full aspect-square object-cover rounded-lg mb-2"
    />
    <div className="text-sm text-zinc-300">{name}</div>
    <div className={`text-xs ${getRarityColor(rarity)}`}>{rarity}</div>
  </div>
);

const getRarityColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case 'legendary': return 'text-amber-400';
    case 'epic': return 'text-purple-400';
    case 'rare': return 'text-blue-400';
    default: return 'text-zinc-400';
  }
};

const categories = [
  {
    id: 'collectibles',
    name: 'Collectibles',
    icon: Package,
    items: [
      { id: 1, name: 'Dark Crystal', rarity: 'Legendary', image: 'https://images.unsplash.com/photo-1518435485909-c96c945a73c2?w=200&h=200&fit=crop' },
      { id: 2, name: 'Shadow Essence', rarity: 'Epic', image: 'https://images.unsplash.com/photo-1534294668821-28a3054f4256?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: 'badges',
    name: 'Badges',
    icon: Shield,
    items: [
      { id: 3, name: 'Elite Creator', rarity: 'Epic', image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=200&h=200&fit=crop' },
      { id: 4, name: 'Pioneer', rarity: 'Rare', image: 'https://images.unsplash.com/photo-1614107707379-283a65774553?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: 'themes',
    name: 'Themes',
    icon: Palette,
    items: [
      { id: 5, name: 'Neon Dreams', rarity: 'Epic', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop' },
      { id: 6, name: 'Dark Matter', rarity: 'Legendary', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: 'effects',
    name: 'Effects',
    icon: Sparkles,
    items: [
      { id: 7, name: 'Void Trail', rarity: 'Epic', image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=200&h=200&fit=crop' },
      { id: 8, name: 'Star Dust', rarity: 'Rare', image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&h=200&fit=crop' }
    ]
  }
];