import React from "react";
import { ProfileCard } from "../ProfileCard";
import { mockProfiles } from "../../data/mockProfiles";

export const PeopleSection = () => {
  return (
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
  );
};
