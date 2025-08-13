import React from "react";
import { CompatibilityProfile } from "../types/compatibility";
import { Heart } from "lucide-react";

interface CompatibilityCardProps {
  profile: CompatibilityProfile;
  matchPercentage: number;
}

export const CompatibilityCard = ({
  profile,
  matchPercentage,
}: CompatibilityCardProps) => {
  return (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="text-zinc-200 font-typewriter">
          <h3 className="text-xl">{profile.personalityProfile.traits[0]}</h3>
          <p className="text-sm text-zinc-400">
            {profile.seductiveArchetype.primaryArchetype}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-crimson-500 glow-effect">
            {matchPercentage}%
          </div>
          <p className="text-sm text-zinc-400">compatibility</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Heart className="w-4 h-4 text-zinc-400" />
          <span className="text-zinc-300">
            {profile.coreValues.attachmentStyle} attachment
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-zinc-400">
            <div className="mb-1">Communication</div>
            <div className="h-2 bg-zinc-800 rounded-full">
              <div
                className="h-full bg-crimson-500 rounded-full shine-effect"
                style={{
                  width: `${
                    profile.communicationStyle.emotionalExpression * 10
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="text-zinc-400">
            <div className="mb-1">Emotional IQ</div>
            <div className="h-2 bg-zinc-800 rounded-full">
              <div
                className="h-full bg-crimson-500 rounded-full shine-effect"
                style={{
                  width: `${profile.coreValues.emotionalIntelligence * 10}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.interests.hobbies.slice(0, 3).map((hobby, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300"
            >
              {hobby}
            </span>
          ))}
        </div>
      </div>

      <button className="w-full mt-4 py-2 px-4 rounded-lg bg-crimson-500/10 text-crimson-300 hover:bg-crimson-500/20 transition-colors glow-effect">
        View Full Profile
      </button>
    </div>
  );
};
