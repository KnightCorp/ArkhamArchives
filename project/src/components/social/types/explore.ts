// Add new types for the additional sections
export interface World {
  id: string;
  name: string;
  description: string;
  image: string;
  population: number;
  rating: number;
  creator: {
    name: string;
    avatar: string;
  };
}

export interface CityLocation {
  id: string;
  name: string;
  type: 'venue' | 'cafe' | 'gallery' | 'studio' | 'club';
  image: string;
  rating: number;
  distance: number;
  address: string;
  openHours: string;
}

export interface Space {
  id: string;
  name: string;
  type: 'virtual' | 'physical' | 'hybrid';
  image: string;
  capacity: number;
  currentOccupancy: number;
  ambiance: string[];
  features: string[];
}

export interface Experience {
  id: string;
  title: string;
  type: 'immersive' | 'interactive' | 'performance';
  image: string;
  duration: string;
  price: number;
  rating: number;
  nextAvailable: string;
}

export type AlgorithmType = 
  | 'chronological'
  | 'engagement'
  | 'interest'
  | 'network'
  | 'discovery'
  | 'mood'
  | 'timeInvestment'
  | 'contrarian'
  | 'timeCapsule'
  | 'creatorJourney'
  | 'localProximity'
  | 'expertiseDevelopment'
  | 'creativeRemix';

export interface Algorithm {
  id: AlgorithmType;
  name: string;
  description: string;
  icon: string;
}

export interface ExplorePreferences {
  algorithm: AlgorithmType;
  people: Record<string, number>;
  creators: Record<string, number>;
  style: Record<string, number>;
  interests: Record<string, number>;
  events: Record<string, number>;
}