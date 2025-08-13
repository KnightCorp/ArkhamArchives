import React, { useState } from 'react';
import { PreferenceSection } from './PreferenceSection';
import { preferenceCategories } from '../../data/preferences';

export const PreferencesManager = () => {
  const [preferences, setPreferences] = useState({
    interests: [] as string[],
    values: [] as string[],
    aesthetics: [] as string[],
    genres: [] as string[]
  });

  const handlePreferenceChange = (category: keyof typeof preferences) => (keywords: string[]) => {
    setPreferences(prev => ({
      ...prev,
      [category]: keywords
    }));
  };

  return (
    <div className="space-y-6">
      {Object.entries(preferenceCategories).map(([key, category]) => (
        <PreferenceSection
          key={key}
          title={category.title}
          description={category.description}
          suggestions={category.suggestions}
          selectedKeywords={preferences[key as keyof typeof preferences]}
          onKeywordsChange={handlePreferenceChange(key as keyof typeof preferences)}
        />
      ))}

      <button className="w-full px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-colors font-medium">
        Save Preferences
      </button>
    </div>
  );
};