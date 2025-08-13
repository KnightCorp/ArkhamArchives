import React from "react";
import { AddonCard } from "./AddonCard";
import type { Addon } from "../types/addon";

interface AddonGridProps {
  addons: Addon[];
}

export const AddonGrid = ({ addons }: AddonGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {addons.map((addon) => (
      <AddonCard key={addon.id} addon={addon} />
    ))}
  </div>
);
