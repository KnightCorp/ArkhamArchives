import React from 'react';
import { Watch, Clock, Timer, Hourglass, Award, Crown, TrendingUp, Medal, Shield, Star } from 'lucide-react';

export const ExamLeaderboard = () => {
  const mockLeaderboard = [
    { rank: 1, name: 'CyberScholar', score: 2500, wins: 45, streak: 8, accuracy: 98, timeBonus: 150 },
    { rank: 2, name: 'QuantumMind', score: 2350, wins: 42, streak: 5, accuracy: 95, timeBonus: 120 },
    { rank: 3, name: 'ByteMaster', score: 2200, wins: 38, streak: 3, accuracy: 92, timeBonus: 100 },
    { rank: 4, name: 'TimeKeeper', score: 2100, wins: 35, streak: 2, accuracy: 90, timeBonus: 80 },
    { rank: 5, name: 'WatchMaster', score: 2000, wins: 32, streak: 1, accuracy: 88, timeBonus: 60 }
  ];

  const getWatchIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="relative">
            <Watch className="w-12 h-12 text-silver animate-spin-slow" />
            <Crown className="w-6 h-6 text-silver absolute -top-2 -right-2 animate-bounce-slow" />
          </div>
        );
      case 2:
        return (
          <div className="relative">
            <Clock className="w-12 h-12 text-silver/80 animate-spin-reverse-slow" />
            <Medal className="w-6 h-6 text-silver/80 absolute -top-2 -right-2" />
          </div>
        );
      case 3:
        return (
          <div className="relative">
            <Timer className="w-12 h-12 text-silver/60 animate-spin-slower" />
            <Shield className="w-6 h-6 text-silver/60 absolute -top-2 -right-2" />
          </div>
        );
      default:
        return <Hourglass className="w-12 h-12 text-silver/40" />;
    }
  };

  const getAchievementBadges = (wins: number, streak: number, accuracy: number) => {
    const badges = [];
    
    // Wins Badges
    if (wins >= 50) {
      badges.push({
        icon: Watch,
        color: 'text-silver',
        title: 'Grandmaster Timekeeper',
        description: '50+ wins'
      });
    } else if (wins >= 25) {
      badges.push({
        icon: Clock,
        color: 'text-silver/80',
        title: 'Master of Hours',
        description: '25+ wins'
      });
    }

    // Streak Badges
    if (streak >= 10) {
      badges.push({
        icon: Timer,
        color: 'text-silver/60',
        title: 'Eternal Timekeeper',
        description: '10+ streak'
      });
    } else if (streak >= 5) {
      badges.push({
        icon: Hourglass,
        color: 'text-silver/40',
        title: 'Time Bender',
        description: '5+ streak'
      });
    }

    // Accuracy Badges
    if (accuracy >= 95) {
      badges.push({
        icon: Star,
        color: 'text-silver',
        title: 'Perfect Precision',
        description: '95%+ accuracy'
      });
    }

    return badges;
  };

  return (
    <div className="space-y-8">
      {/* Top Players */}
      <div className="grid grid-cols-3 gap-6">
        {mockLeaderboard.slice(0, 3).map((player) => (
          <div key={player.rank} className="relative bg-black/50 border border-silver/20 rounded-lg p-6 text-center group hover:border-silver/30 transition-colors">
            <div className="absolute inset-0 clock-grid opacity-5" />
            <div className="relative">
              {/* Watch Icon */}
              <div className="mb-4 flex justify-center">
                {getWatchIcon(player.rank)}
              </div>

              {/* Player Info */}
              <h3 className="text-silver font-alice mb-2">{player.name}</h3>
              <div className="text-2xl text-silver font-alice mb-2">{player.score}</div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-black/30 rounded p-2">
                  <div className="text-silver/60 text-xs font-code">Accuracy</div>
                  <div className="text-silver font-alice">{player.accuracy}%</div>
                </div>
                <div className="bg-black/30 rounded p-2">
                  <div className="text-silver/60 text-xs font-code">Time Bonus</div>
                  <div className="text-silver font-alice">+{player.timeBonus}</div>
                </div>
              </div>

              <div className="text-silver/60 font-code">
                {player.wins} wins • {player.streak} streak
              </div>

              {/* Achievement Badges */}
              <div className="mt-4 flex justify-center space-x-2">
                {getAchievementBadges(player.wins, player.streak, player.accuracy).map((badge, index) => (
                  <div 
                    key={index}
                    className="group relative"
                    title={`${badge.title} - ${badge.description}`}
                  >
                    <badge.icon className={`w-6 h-6 ${badge.color} group-hover:animate-spin-slow`} />
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 bg-black/90 text-xs text-silver p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-silver/20">
                      <div className="font-alice">{badge.title}</div>
                      <div className="text-silver/60 font-code text-[10px]">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard */}
      <div className="bg-black/50 border border-silver/20 rounded-lg p-6">
        <h3 className="text-xl text-silver font-alice mb-6">Global Rankings</h3>
        <div className="space-y-4">
          {mockLeaderboard.map((player) => (
            <div 
              key={player.rank}
              className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-silver/10 hover:border-silver/20 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  {player.rank <= 3 ? (
                    getWatchIcon(player.rank)
                  ) : (
                    <span className="text-silver/40 font-alice">{player.rank}</span>
                  )}
                </div>
                <div>
                  <div className="text-silver font-alice">{player.name}</div>
                  <div className="text-silver/60 font-code text-sm">
                    {player.wins} wins • {player.accuracy}% accuracy
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-silver font-alice">{player.score}</div>
                  <div className="flex items-center text-silver/60 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+{player.timeBonus}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {getAchievementBadges(player.wins, player.streak, player.accuracy).map((badge, index) => (
                    <badge.icon key={index} className={`w-5 h-5 ${badge.color}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Stats */}
      <div className="bg-black/50 border border-silver/20 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Watch className="w-6 h-6 text-silver animate-spin-slow" />
            <h3 className="text-xl text-silver font-alice">Your Timepiece</h3>
          </div>
          <div className="flex items-center space-x-2 text-silver font-code">
            <Award className="w-5 h-5" />
            <span>Rank #28</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-black/30 p-4 rounded-lg border border-silver/10">
            <Watch className="w-6 h-6 text-silver/60 mx-auto mb-2" />
            <div className="text-2xl text-silver font-alice">1850</div>
            <div className="text-silver/60 font-code">Rating</div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg border border-silver/10">
            <Clock className="w-6 h-6 text-silver/60 mx-auto mb-2" />
            <div className="text-2xl text-silver font-alice">25</div>
            <div className="text-silver/60 font-code">Wins</div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg border border-silver/10">
            <Timer className="w-6 h-6 text-silver/60 mx-auto mb-2" />
            <div className="text-2xl text-silver font-alice">4</div>
            <div className="text-silver/60 font-code">Current Streak</div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg border border-silver/10">
            <Star className="w-6 h-6 text-silver/60 mx-auto mb-2" />
            <div className="text-2xl text-silver font-alice">92%</div>
            <div className="text-silver/60 font-code">Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
};