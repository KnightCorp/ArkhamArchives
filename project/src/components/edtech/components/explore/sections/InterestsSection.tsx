import React from "react";
import { InterestPreferencesPanel } from "../interests/InterestPreferences";
import { InterestCard } from "../interests/InterestCard";
import { interests } from "../../../data/interests";
import { InterestPreferences } from "../interests/InterestPreferences";

interface InterestsSectionProps {
  preferences: InterestPreferences;
  onPreferenceChange: (key: string, value: number) => void;
}

export const InterestsSection = ({
  preferences,
  onPreferenceChange,
}: InterestsSectionProps) => (
  <div className="space-y-8">
    <InterestPreferencesPanel
      preferences={preferences}
      onChange={onPreferenceChange}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {interests.map((interest) => (
        <InterestCard key={interest.id} interest={interest} />
      ))}
    </div>
  </div>
);
