import React from "react";
import { StoreItem } from "./StoreItem";
import type { StoreItem as StoreItemType } from "../types/store";

interface StoreGridProps {
  items: StoreItemType[];
}

export const StoreGrid = ({ items }: StoreGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((item) => (
      <StoreItem key={item.id} item={item} />
    ))}
    {items.length === 0 && (
      <div className="col-span-full text-center py-12">
        <p className="text-silver/60 academia-text italic">
          No artifacts found matching your criteria
        </p>
      </div>
    )}
  </div>
);
