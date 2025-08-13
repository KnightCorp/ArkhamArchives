import React from 'react';
import { PreferenceSlider } from '../PreferenceSlider';

interface StylePreferences {
  minimalist: number;
  vintage: number;
  avantGarde: number;
  industrial: number;
  naturalistic: number;
  futuristic: number;
}

interface StylePreferencesPanelProps {
  preferences: StylePreferences;
  onChange: (key: keyof StylePreferences, value: number) => void;
}

export const StylePreferencesPanel = ({ preferences, onChange }: StylePreferencesPanelProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <PreferenceSlider
      label="Minimalist"
      value={preferences.minimalist}
      onChange={(value) => onChange('minimalist', value)}
    />
    <PreferenceSlider
      label="Vintage"
      value={preferences.vintage}
      onChange={(value) => onChange('vintage', value)}
    />
    <PreferenceSlider
      label="Avant-Garde"
      value={preferences.avantGarde}
      onChange={(value) => onChange('avantGarde', value)}
    />
    <PreferenceSlider
      label="Industrial"
      value={preferences.industrial}
      onChange={(value) => onChange('industrial', value)}
    />
    <PreferenceSlider
      label="Naturalistic"
      value={preferences.naturalistic}
      onChange={(value) => onChange('naturalistic', value)}
    />
    <PreferenceSlider
      label="Futuristic"
      value={preferences.futuristic}
      onChange={(value) => onChange('futuristic', value)}
    />
  </div>
);