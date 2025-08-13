import { LucideIcon } from 'lucide-react';

export interface AddonMedia {
  images: string[];
  video?: string;
}

export interface Addon {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: LucideIcon;
  category: string;
  version: string;
  size: string;
  installed: boolean;
  features: string[];
  dependencies: string[];
  media: AddonMedia;
}