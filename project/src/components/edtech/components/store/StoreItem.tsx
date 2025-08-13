import React from 'react';
import { Clock, Tag, Star } from 'lucide-react';
import type { StoreItem as StoreItemType } from '../../types/store';

interface StoreItemProps {
  item: StoreItemType;
}

export const StoreItem = ({ item }: StoreItemProps) => (
  <div className="bg-[#1a0f0f]/90 rounded-lg overflow-hidden border border-[#8B0000]/30 academia-border blood-scroll">
    <img src={item.image} alt={item.title} className="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all" />
    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl text-silver academia-text">{item.title}</h3>
        <span className="text-xl font-bold text-silver academia-text">${item.price}</span>
      </div>
      
      <p className="text-silver/80 text-sm mb-4 academia-text">{item.description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img src={item.seller.avatar} alt={item.seller.name} className="w-6 h-6 rounded-full grayscale hover:grayscale-0 transition-all" />
          <span className="text-silver/60 text-sm ml-2 academia-text">{item.seller.name}</span>
        </div>
        <div className="flex items-center text-silver/60">
          <Star className="w-4 h-4 mr-1 text-[#8B0000]" />
          <span className="text-sm academia-text">{item.seller.rating}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {item.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 bg-[#0a0505] rounded-full text-xs text-silver/60 academia-text">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm text-silver/60 mb-4">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span className="academia-text">{new Date(item.listed).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <Tag className="w-4 h-4 mr-1" />
          <span className="academia-text">{item.condition}</span>
        </div>
      </div>
      
      <button className="w-full py-2 bg-[#8B0000]/20 text-silver border border-[#8B0000]/30 rounded-lg hover:bg-[#8B0000]/30 transition-colors academia-text">
        Contact Curator
      </button>
    </div>
  </div>
);