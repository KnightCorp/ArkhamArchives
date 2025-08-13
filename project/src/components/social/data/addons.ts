import { 
  BookOpen, // Education
  Wallet, // Finance
  Film, // Media
  Trophy, // Esports
  Heart, // Health
  Globe, // Social
  Newspaper, // News
  Lightbulb, // Research
  Compass, // Experience
  Brain, // AI & ML
  ShoppingBag, // Commerce
  MessageCircle // Communication
} from 'lucide-react';
import type { Addon } from '../types/addon';

export const categories = [
  { id: 'education', name: 'Education' },
  { id: 'finance', name: 'Finance' },
  { id: 'media', name: 'Media' },
  { id: 'esports', name: 'Esports' },
  { id: 'health', name: 'Health & Fitness' },
  { id: 'social', name: 'Social' },
  { id: 'news', name: 'News' },
  { id: 'research', name: 'Research' },
  { id: 'experience', name: 'Experience' },
  { id: 'ai', name: 'AI & ML' },
  { id: 'commerce', name: 'Commerce' },
  { id: 'communication', name: 'Communication' }
];

export const addons: Addon[] = [
  // Education
  {
    id: 'learning-hub',
    name: 'Learning Hub',
    shortDescription: 'Interactive learning platform',
    description: 'Comprehensive learning management system with courses, quizzes, and progress tracking.',
    icon: BookOpen,
    category: 'education',
    version: '2.1.0',
    size: '120MB',
    installed: false,
    features: [
      'Interactive courses',
      'Progress tracking',
      'Quiz system',
      'Certificate generation'
    ],
    dependencies: ['Core LMS'],
    media: {
      images: [
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop'
      ],
      video: 'https://example.com/videos/learning-hub-demo.mp4'
    }
  },

  // Finance
  {
    id: 'finance-tracker',
    name: 'Finance Tracker',
    shortDescription: 'Personal finance management',
    description: 'Track expenses, investments, and financial goals with advanced analytics.',
    icon: Wallet,
    category: 'finance',
    version: '3.0.0',
    size: '85MB',
    installed: false,
    features: [
      'Expense tracking',
      'Investment portfolio',
      'Budget planning',
      'Financial reports'
    ],
    dependencies: ['Analytics Engine'],
    media: {
      images: [
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800&h=400&fit=crop'
      ],
      video: 'https://example.com/videos/finance-demo.mp4'
    }
  },

  // Media
  {
    id: 'media-studio',
    name: 'Media Studio',
    shortDescription: 'Content creation suite',
    description: 'Professional-grade tools for video editing, image processing, and audio production.',
    icon: Film,
    category: 'media',
    version: '2.5.0',
    size: '250MB',
    installed: true,
    features: [
      'Video editing',
      'Image processing',
      'Audio production',
      'Asset management'
    ],
    dependencies: ['Media Core'],
    media: {
      images: [
        'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&h=400&fit=crop'
      ],
      video: 'https://example.com/videos/studio-demo.mp4'
    }
  },

  // Esports
  {
    id: 'esports-arena',
    name: 'Esports Arena',
    shortDescription: 'Gaming and tournament platform',
    description: 'Complete esports platform for tournaments, team management, and analytics.',
    icon: Trophy,
    category: 'esports',
    version: '1.8.0',
    size: '180MB',
    installed: false,
    features: [
      'Tournament system',
      'Team management',
      'Match analytics',
      'Live streaming'
    ],
    dependencies: ['Gaming Core'],
    media: {
      images: [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop'
      ],
      video: 'https://example.com/videos/esports-demo.mp4'
    }
  },

  // Health & Fitness
  {
    id: 'health-tracker',
    name: 'Health Tracker',
    shortDescription: 'Fitness and wellness tracking',
    description: 'Comprehensive health monitoring and fitness tracking system.',
    icon: Heart,
    category: 'health',
    version: '2.2.0',
    size: '95MB',
    installed: false,
    features: [
      'Workout tracking',
      'Nutrition planning',
      'Health metrics',
      'Progress reports'
    ],
    dependencies: ['Health Core'],
    media: {
      images: [
        'https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop'
      ],
      video: 'https://example.com/videos/health-demo.mp4'
    }
  }
];