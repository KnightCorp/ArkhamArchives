import { 
  GraduationCap, 
  Banknote, 
  Trophy, 
  Film, 
  Scale 
} from 'lucide-react';
import type { Addon } from './types';

export const addons: Addon[] = [
  {
    id: 'edtech',
    name: 'Education Hub',
    description: 'Online courses and learning tools',
    icon: GraduationCap,
    installed: false,
    category: 'edtech'
  },
  {
    id: 'fintech',
    name: 'Finance Portal',
    description: 'Banking and investment tools',
    icon: Banknote,
    installed: false,
    category: 'fintech'
  },
  {
    id: 'esports',
    name: 'Gaming Arena',
    description: 'Esports tournaments and streaming',
    icon: Trophy,
    installed: false,
    category: 'esports'
  },
  {
    id: 'media',
    name: 'Media Studio',
    description: 'Content creation and streaming',
    icon: Film,
    installed: true,
    category: 'media'
  },
  {
    id: 'legal',
    name: 'Legal Assistant',
    description: 'Legal documents and consultation',
    icon: Scale,
    installed: false,
    category: 'legal'
  }
];