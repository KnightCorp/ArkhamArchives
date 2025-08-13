import { useState } from 'react';
import { ExplorePreferences, AlgorithmType } from '../types/explore';

const initialPreferences: ExplorePreferences = {
  algorithm: 'chronological',
  people: {
    coreValues: 70,
    lifestyle: 60,
    interests: 80,
    communication: 75,
    personality: 65,
    financial: 50,
    lifeVision: 70,
    seductiveArchetype: 60,
    genderTropes: 55
  },
  creators: {
    photography: 60,
    filmmaking: 70,
    music: 80,
    visualArts: 75,
    writing: 65,
    performance: 55
  },
  style: {
    minimalist: 70,
    vintage: 60,
    avantGarde: 80,
    industrial: 75,
    naturalistic: 65,
    futuristic: 55
  },
  interests: {
    movies: 70,
    tvShows: 60,
    music: 80,
    books: 75,
    sports: 65,
    gaming: 55,
    technology: 70,
    travel: 65
  },
  events: {
    distance: 50,
    music: 70,
    art: 60,
    food: 80,
    sports: 75,
    networking: 65,
    workshops: 55
  }
};

export const useExplorePreferences = () => {
  const [preferences, setPreferences] = useState<ExplorePreferences>(initialPreferences);

  const updatePreference = (section: keyof Omit<ExplorePreferences, 'algorithm'>) => 
    (key: string, value: number) => {
      setPreferences(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      }));
    };

  const updateAlgorithm = (algorithm: AlgorithmType) => {
    setPreferences(prev => ({
      ...prev,
      algorithm
    }));
  };

  return { preferences, updatePreference, updateAlgorithm };
};