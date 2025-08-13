import { LucideIcon } from "lucide-react";

export interface Addon {
  id: string;
  name: string;
  description: string;
  shortDescription: string; // Added
  icon: LucideIcon;
  installed: boolean;
  category: "edtech" | "fintech" | "esports" | "media" | "legal";
  version: string; // Added
  size: string; // Added
  features: string[]; // Added
  author: string; // Added (guessing this is one of the missing properties)
  rating?: number; // Added (guessing this is another missing property)
}
