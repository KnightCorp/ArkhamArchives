import React from 'react';
import { PreferenceSlider } from '../PreferenceSlider';

interface InterestPreferences {
  movies: number;
  tvShows: number;
  music: number;
  books: number;
  sports: number;
  gaming: number;
  technology: number;
  travel: number;
}

interface InterestPreferencesPanelProps {
  preferences: InterestPreferences;
  onChange: (key: keyof InterestPreferences, value: number) => void;
}

export const InterestPreferencesPanel = ({ preferences, onChange }: InterestPreferencesPanelProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <PreferenceSlider
      label="Movies"
      value={preferences.movies}
      onChange={(value) => onChange('movies', value)}
    />
    <PreferenceSlider
      label="TV Shows"
      value={preferences.tvShows}
      onChange={(value) => onChange('tvShows', value)}
    />
    <PreferenceSlider
      label="Music"
      value={preferences.music}
      onChange={(value) => onChange('music', value)}
    />
    <PreferenceSlider
      label="Books"
      value={preferences.books}
      onChange={(value) => onChange('books', value)}
    />
    <PreferenceSlider
      label="Sports"
      value={preferences.sports}
      onChange={(value) => onChange('sports', value)}
    />
    <PreferenceSlider
      label="Gaming"
      value={preferences.gaming}
      onChange={(value) => onChange('gaming', value)}
    />
    <PreferenceSlider
      label="Technology"
      value={preferences.technology}
      onChange={(value) => onChange('technology', value)}
    />
    <PreferenceSlider
      label="Travel"
      value={preferences.travel}
      onChange={(value) => onChange('travel', value)}
    />
  </div>
);