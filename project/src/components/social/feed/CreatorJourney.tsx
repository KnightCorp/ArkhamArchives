import React from 'react';
import { Trophy, Star, Award, Target, Zap } from 'lucide-react';

const milestones = [
  {
    id: 1,
    title: 'First Post',
    description: 'Started your journey',
    karma: 10,
    icon: Star,
    achieved: true
  },
  {
    id: 2,
    title: 'Rising Star',
    description: 'Reached 100 followers',
    karma: 50,
    icon: Trophy,
    achieved: true
  },
  {
    id: 3,
    title: 'Content Creator',
    description: 'Published 10 posts',
    karma: 100,
    icon: Award,
    achieved: false
  },
  {
    id: 4,
    title: 'Influencer',
    description: 'Reached 1000 followers',
    karma: 500,
    icon: Target,
    achieved: false
  }
];

export const CreatorJourney = () => {
  const totalKarma = 60; // This would come from user data
  const level = Math.floor(totalKarma / 100) + 1;
  const progress = (totalKarma % 100) / 100 * 100;

  return (
    <div className="space-y-8">
      {/* Karma Overview */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white text-xl">Level {level}</h3>
              <p className="text-white/60">Creator Journey</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl text-white">{totalKarma} Karma</div>
            <p className="text-white/60">{100 - (totalKarma % 100)} until next level</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        {milestones.map((milestone) => (
          <div 
            key={milestone.id}
            className={`bg-black/40 backdrop-blur-xl rounded-lg p-6 border transition-all ${
              milestone.achieved 
                ? 'border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                : 'border-white/5'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                milestone.achieved 
                  ? 'bg-white/10 text-white' 
                  : 'bg-white/5 text-white/40'
              }`}>
                <milestone.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className={`text-lg ${milestone.achieved ? 'text-white' : 'text-white/40'}`}>
                  {milestone.title}
                </h4>
                <p className={milestone.achieved ? 'text-white/60' : 'text-white/30'}>
                  {milestone.description}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-lg ${milestone.achieved ? 'text-white' : 'text-white/40'}`}>
                  {milestone.karma} Karma
                </div>
                <div className={`text-sm ${milestone.achieved ? 'text-emerald-400' : 'text-white/30'}`}>
                  {milestone.achieved ? 'Achieved' : 'Locked'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};