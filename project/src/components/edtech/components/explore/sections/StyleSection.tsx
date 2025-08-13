import React from 'react';
import { StylePreferencesPanel } from '../style/StylePreferences';
import { StyleCard } from '../style/StyleCard';
import { styles } from '../../../data/styles';
import { StylePreferences } from '../../../types/explore';

interface StyleSectionProps {
  preferences: StylePreferences;
  onPreferenceChange: (key: string, value: number) => void;
}

export const StyleSection = ({ preferences, onPreferenceChange }: StyleSectionProps) => (
  <div className="space-y-8">
    <StylePreferencesPanel 
      preferences={preferences}
      onChange={onPreferenceChange}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {styles.map((style) => (
        <StyleCard key={style.id} style={style} />
      ))}
    </div>
  </div>
);