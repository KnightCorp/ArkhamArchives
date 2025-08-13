import { LucideIcon } from 'lucide-react';

export interface Addon {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  installed: boolean;
  category: 'edtech' | 'fintech' | 'esports' | 'media' | 'legal';
}