import React from 'react';
import { Heart, Skull } from 'lucide-react';
import { ProfileMedia } from './ProfileMedia';
import { CompatibilityProfile } from '../../types/compatibility';

interface ProfileCardProps {
  profile: CompatibilityProfile;
  matchPercentage: number;
  media: Array<{ type: 'image' | 'video'; url: string; thumbnail?: string; }>;
}

export const ProfileCard = ({ profile, matchPercentage, media }: ProfileCardProps) => (
  <div className="gothic-card gothic-border rounded-lg p-6 transition-all duration-500 hover:transform hover:scale-[1.02]">
    <ProfileMedia media={media} />
    
    <div className="flex justify-between items-center mb-4">
      <div className="text-zinc-200 font-typewriter">
        <h3 className="text-xl tracking-wider">{profile.personalityProfile.traits[0]}</h3>
        <p className="text-sm text-zinc-400">{profile.seductiveArchetype.primaryArchetype}</p>
      </div>
      <div className="text-right flex items-center gap-2">
        <Skull className="w-5 h-5 text-crimson-500" />
        <div>
          <div className="text-2xl font-bold text-crimson-500 gothic-text">
            {matchPercentage}%
          </div>
          <p className="text-sm text-zinc-400">affinity</p>
        </div>
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Heart className="w-4 h-4 text-crimson-400" />
        <span className="text-zinc-300 tracking-wide">{profile.coreValues.attachmentStyle} soul</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-zinc-400">
          <div className="mb-1 tracking-wider">Dark Energy</div>
          <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-crimson-800 to-crimson-500 rounded-full shine-effect"
              style={{ width: `${profile.communicationStyle.emotionalExpression * 10}%` }}
            />
          </div>
        </div>
        
        <div className="text-zinc-400">
          <div className="mb-1 tracking-wider">Spirit Force</div>
          <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-crimson-800 to-crimson-500 rounded-full shine-effect"
              style={{ width: `${profile.coreValues.emotionalIntelligence * 10}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {profile.interests.hobbies.slice(0, 3).map((hobby, index) => (
          <span 
            key={index}
            className="px-3 py-1 text-xs rounded-full bg-zinc-800/50 text-zinc-300 border border-zinc-700/50"
          >
            {hobby}
          </span>
        ))}
      </div>
    </div>
    
    <button className="gothic-button w-full mt-4 py-2 px-4 rounded-lg bg-gradient-to-r from-crimson-900/50 to-crimson-800/50 text-crimson-300 hover:from-crimson-800/50 hover:to-crimson-700/50 transition-all duration-300">
      Reveal Dark Secrets
    </button>
  </div>
);