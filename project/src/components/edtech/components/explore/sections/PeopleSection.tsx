import React from "react";
import { PreferencesPanel } from "../PreferencesPanel";
import { ProfileCard } from "../ProfileCard";
import { mockProfiles } from "../../../data/mockProfiles";
import { Preferences } from "../PreferencesPanel";

interface PeopleSectionProps {
  preferences: Preferences;
  onPreferenceChange: (key: string, value: number) => void;
}

export const PeopleSection = ({
  preferences,
  onPreferenceChange,
}: PeopleSectionProps) => (
  <>
    <PreferencesPanel
      preferences={preferences}
      onPreferenceChange={onPreferenceChange}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockProfiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          matchPercentage={85}
          media={profile.media}
        />
      ))}
    </div>
  </>
);
