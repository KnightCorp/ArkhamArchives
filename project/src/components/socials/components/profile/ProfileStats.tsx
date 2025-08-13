import React from "react";
import { Trophy, Users, Star, Eye, Loader2 } from "lucide-react";
import type { Achievement } from "../../lib/profileQueries";

interface ProfileStatsProps {
  stats: any;
  achievements: Achievement[];
  loading: boolean;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  stats,
  achievements,
  loading,
}) => {
  if (!stats) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400">No stats data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Trophy}
          label="Total XP"
          value={stats.totalXp?.toLocaleString() || "0"}
          trend={`Level ${stats.level || 1}`}
        />
        <StatCard
          icon={Users}
          label="Karma"
          value={stats.karma?.toLocaleString() || "0"}
          trend={`Streak: ${stats.currentStreak || 0}`}
        />
        <StatCard
          icon={Star}
          label="Content Rating"
          value={stats.contentRating?.toFixed(1) || "0.0"}
          trend={`${stats.inventoryCount || 0} items`}
        />
        <StatCard
          icon={Eye}
          label="Profile Views"
          value={stats.profileViews?.toLocaleString() || "0"}
          trend={`Longest: ${stats.longestStreak || 0}`}
        />
      </div>

      <div className="metallic-shine rounded-lg p-6">
        <h3 className="text-xl text-white mb-4">Achievement Progress</h3>
        <div className="space-y-4">
          {achievements.length > 0 ? (
            achievements.map((achievement) => (
              <AchievementBar
                key={achievement.id}
                title={achievement.achievement_type
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                progress={achievement.progress}
                max={achievement.max_progress}
                completed={achievement.completed}
                completedAt={achievement.completed_at}
              />
            ))
          ) : (
            <p className="text-zinc-400">
              No achievements yet. Start creating content to unlock
              achievements!
            </p>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="metallic-shine rounded-lg p-6">
          <h3 className="text-lg text-white mb-4">Activity Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-zinc-400">Current XP</span>
              <span className="text-zinc-200">
                {stats.xp?.toLocaleString() || "0"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Total Earnings</span>
              <span className="text-zinc-200">
                {stats.totalEarnings?.toLocaleString() || "0"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Current Streak</span>
              <span className="text-zinc-200">
                {stats.currentStreak || 0} days
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Longest Streak</span>
              <span className="text-zinc-200">
                {stats.longestStreak || 0} days
              </span>
            </div>
          </div>
        </div>

        <div className="metallic-shine rounded-lg p-6">
          <h3 className="text-lg text-white mb-4">Progress to Next Level</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Level {stats.level || 1}</span>
              <span className="text-zinc-400">
                Level {(stats.level || 1) + 1}
              </span>
            </div>
            <div className="h-3 bg-zinc-800 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(((stats.xp || 0) % 1000) / 10, 100)}%`,
                }}
              />
            </div>
            <p className="text-sm text-zinc-400">
              {1000 - ((stats.xp || 0) % 1000)} XP to next level
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: any;
  label: string;
  value: string;
  trend: string;
}) => (
  <div className="metallic-shine rounded-lg p-4">
    <Icon className="w-6 h-6 text-zinc-400 mb-2" />
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-sm text-zinc-400">{label}</div>
    <div className="text-sm text-emerald-400 mt-1">{trend}</div>
  </div>
);

const AchievementBar = ({
  title,
  progress,
  max,
  completed,
  completedAt,
}: {
  title: string;
  progress: number;
  max: number;
  completed: boolean;
  completedAt: string | null;
}) => (
  <div
    className={`p-4 rounded-lg ${
      completed
        ? "bg-emerald-900/20 border border-emerald-500/30"
        : "bg-zinc-800/50"
    }`}
  >
    <div className="flex justify-between items-center text-sm mb-2">
      <span
        className={`font-medium ${
          completed ? "text-emerald-300" : "text-zinc-300"
        }`}
      >
        {title}
        {completed && " ✓"}
      </span>
      <span className="text-zinc-400">
        {progress}/{max}
      </span>
    </div>
    <div className="h-2 bg-zinc-700 rounded-full">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          completed
            ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
            : "bg-gradient-to-r from-purple-600 to-purple-400"
        }`}
        style={{ width: `${Math.min((progress / max) * 100, 100)}%` }}
      />
    </div>
    {completed && completedAt && (
      <p className="text-xs text-emerald-400 mt-1">
        Completed {new Date(completedAt).toLocaleDateString()}
      </p>
    )}
  </div>
);
