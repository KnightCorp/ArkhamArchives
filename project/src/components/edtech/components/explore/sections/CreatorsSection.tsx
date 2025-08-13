import React from "react";
import { CreatorPreferencesPanel } from "../creators/CreatorPreferences";
import { CreatorList } from "../creators/CreatorList";
import { newCreators, topCreators } from "../../../data/creators";
import type { CreatorPreferences } from "../creators/CreatorPreferences";

interface CreatorsSectionProps {
  preferences: CreatorPreferences;
  onPreferenceChange: (key: string, value: number) => void;
}

export const CreatorsSection = ({
  preferences,
  onPreferenceChange,
}: CreatorsSectionProps) => (
  <div className="space-y-8">
    <CreatorPreferencesPanel
      preferences={preferences}
      onChange={onPreferenceChange}
    />

    <div className="space-y-12">
      <section>
        <h2 className="text-xl font-typewriter text-zinc-200 mb-6">
          Top Creators
        </h2>
        <CreatorList creators={topCreators} />
      </section>

      <section>
        <h2 className="text-xl font-typewriter text-zinc-200 mb-6">
          New Creators
        </h2>
        <CreatorList creators={newCreators} />
      </section>
    </div>
  </div>
);
