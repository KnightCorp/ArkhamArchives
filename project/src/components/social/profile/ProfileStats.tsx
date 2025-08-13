import React from "react";
import { Trophy, Users, Star, Eye } from "lucide-react";

export const ProfileStats = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Trophy}
          label="Achievement Score"
          value="2,547"
          trend="+15%"
        />
        <StatCard icon={Users} label="Followers" value="12.4K" trend="+8%" />
        <StatCard icon={Star} label="Content Rating" value="4.8" trend="+0.2" />
        <StatCard icon={Eye} label="Profile Views" value="45.2K" trend="+25%" />
      </div>

      <div className="metallic-shine rounded-lg p-6">
        <h3 className="text-xl text-white mb-4">Achievement Progress</h3>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <AchievementBar key={achievement.id} {...achievement} />
          ))}
        </div>
      </div>
    </div>
  );
};

type StatCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  trend: string;
};

const StatCard = ({ icon: Icon, label, value, trend }: StatCardProps) => (
  <div className="metallic-shine rounded-lg p-4">
    <Icon className="w-6 h-6 text-zinc-400 mb-2" />
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-sm text-zinc-400">{label}</div>
    <div className="text-sm text-emerald-400 mt-1">{trend}</div>
  </div>
);

type AchievementBarProps = {
  title: string;
  progress: number;
  max: number;
};

const AchievementBar = ({ title, progress, max }: AchievementBarProps) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-zinc-300">{title}</span>
      <span className="text-zinc-400">
        {progress}/{max}
      </span>
    </div>
    <div className="h-2 bg-zinc-800 rounded-full">
      <div
        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
        style={{ width: `${(progress / max) * 100}%` }}
      />
    </div>
  </div>
);

const achievements = [
  { id: 1, title: "Content Creator", progress: 75, max: 100 },
  { id: 2, title: "Social Butterfly", progress: 45, max: 100 },
  { id: 3, title: "Explorer", progress: 60, max: 100 },
  { id: 4, title: "Trendsetter", progress: 30, max: 100 },
];
