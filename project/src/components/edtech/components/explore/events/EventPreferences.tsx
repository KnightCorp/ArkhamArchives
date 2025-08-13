import React from "react";
import { PreferenceSlider } from "../PreferenceSlider";

export interface EventPreferences {
  distance: number;
  music: number;
  art: number;
  food: number;
  sports: number;
  networking: number;
  workshops: number;
}

interface EventPreferencesPanelProps {
  preferences: EventPreferences;
  onChange: (key: keyof EventPreferences, value: number) => void;
}

export const EventPreferencesPanel = ({
  preferences,
  onChange,
}: EventPreferencesPanelProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <PreferenceSlider
      label="Distance (km)"
      value={preferences.distance}
      onChange={(value) => onChange("distance", value)}
    />
    <PreferenceSlider
      label="Music Events"
      value={preferences.music}
      onChange={(value) => onChange("music", value)}
    />
    <PreferenceSlider
      label="Art Events"
      value={preferences.art}
      onChange={(value) => onChange("art", value)}
    />
    <PreferenceSlider
      label="Food & Dining"
      value={preferences.food}
      onChange={(value) => onChange("food", value)}
    />
    <PreferenceSlider
      label="Sports Events"
      value={preferences.sports}
      onChange={(value) => onChange("sports", value)}
    />
    <PreferenceSlider
      label="Networking"
      value={preferences.networking}
      onChange={(value) => onChange("networking", value)}
    />
    <PreferenceSlider
      label="Workshops"
      value={preferences.workshops}
      onChange={(value) => onChange("workshops", value)}
    />
  </div>
);
