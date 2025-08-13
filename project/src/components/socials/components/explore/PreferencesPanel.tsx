import React from 'react';
import { PreferenceSlider } from './PreferenceSlider';
import { SlidersHorizontal } from 'lucide-react';

interface Preferences {
  coreValues: number;
  lifestyle: number;
  interests: number;
  communication: number;
  personality: number;
  financial: number;
  lifeVision: number;
  seductiveArchetype: number;
  genderTropes: number;
}

interface PreferencesPanelProps {
  preferences: Preferences;
  onPreferenceChange: (key: keyof Preferences, value: number) => void;
}

export const PreferencesPanel = ({ preferences, onPreferenceChange }: PreferencesPanelProps) => (
  <div className="bg-zinc-900/95 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6 mb-8">
    <div className="flex items-center gap-2 mb-6">
      <SlidersHorizontal className="w-5 h-5 text-zinc-400" />
      <h2 className="text-xl text-zinc-200">Preferences</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PreferenceSlider
        label="Core Values"
        value={preferences.coreValues}
        onChange={(value) => onPreferenceChange('coreValues', value)}
      />
      <PreferenceSlider
        label="Lifestyle"
        value={preferences.lifestyle}
        onChange={(value) => onPreferenceChange('lifestyle', value)}
      />
      <PreferenceSlider
        label="Interests"
        value={preferences.interests}
        onChange={(value) => onPreferenceChange('interests', value)}
      />
      <PreferenceSlider
        label="Communication"
        value={preferences.communication}
        onChange={(value) => onPreferenceChange('communication', value)}
      />
      <PreferenceSlider
        label="Personality"
        value={preferences.personality}
        onChange={(value) => onPreferenceChange('personality', value)}
      />
      <PreferenceSlider
        label="Financial"
        value={preferences.financial}
        onChange={(value) => onPreferenceChange('financial', value)}
      />
      <PreferenceSlider
        label="Life Vision"
        value={preferences.lifeVision}
        onChange={(value) => onPreferenceChange('lifeVision', value)}
      />
      <PreferenceSlider
        label="Seductive Archetype"
        value={preferences.seductiveArchetype}
        onChange={(value) => onPreferenceChange('seductiveArchetype', value)}
      />
      <PreferenceSlider
        label="Gender Expression"
        value={preferences.genderTropes}
        onChange={(value) => onPreferenceChange('genderTropes', value)}
      />
    </div>
  </div>
);