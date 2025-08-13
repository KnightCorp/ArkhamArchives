import React from "react";
import { PreferenceSlider } from "../PreferenceSlider";

export interface CreatorPreferences {
  photography: number;
  filmmaking: number;
  music: number;
  visualArts: number;
  writing: number;
  performance: number;
}

interface CreatorPreferencesPanelProps {
  preferences: CreatorPreferences;
  onChange: (key: keyof CreatorPreferences, value: number) => void;
}

export const CreatorPreferencesPanel = ({
  preferences,
  onChange,
}: CreatorPreferencesPanelProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <PreferenceSlider
      label="Photography"
      value={preferences.photography}
      onChange={(value) => onChange("photography", value)}
    />
    <PreferenceSlider
      label="Filmmaking"
      value={preferences.filmmaking}
      onChange={(value) => onChange("filmmaking", value)}
    />
    <PreferenceSlider
      label="Music"
      value={preferences.music}
      onChange={(value) => onChange("music", value)}
    />
    <PreferenceSlider
      label="Visual Arts"
      value={preferences.visualArts}
      onChange={(value) => onChange("visualArts", value)}
    />
    <PreferenceSlider
      label="Writing"
      value={preferences.writing}
      onChange={(value) => onChange("writing", value)}
    />
    <PreferenceSlider
      label="Performance"
      value={preferences.performance}
      onChange={(value) => onChange("performance", value)}
    />
  </div>
);
