import React, { useState, useEffect } from "react";
import { Trophy, Star, Award, Target, Zap, Loader2 } from "lucide-react";
import { getUserStats, getUserProfile } from "../../lib/socialMediaQueries";

interface CreatorJourneyProps {
  currentUser: any;
}

interface UserStats {
  postsCount: number;
  totalLikes: number;
  followersCount: number;
  followingCount: number;
}

interface Profile {
  id: string;
  display_name: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  karma: number;
  bio: string | null;
  location: string | null;
  website: string | null;
  is_verified: boolean;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export const CreatorJourney: React.FC<CreatorJourneyProps> = ({
  currentUser,
}) => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.id) {
      loadUserData();
    }
  }, [currentUser]);

  const loadUserData = async () => {
    if (!currentUser?.id) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch user stats and profile in parallel
      const [statsResponse, profileResponse] = await Promise.all([
        getUserStats(currentUser.id),
        getUserProfile(currentUser.id),
      ]);

      if (statsResponse.error) {
        throw new Error("Failed to load user stats");
      }

      if (profileResponse.error) {
        throw new Error("Failed to load user profile");
      }

      setUserStats(statsResponse.data);
      setUserProfile(profileResponse.data);
    } catch (err) {
      console.error("Error loading user data:", err);
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate milestones based on real user data
  const getMilestones = () => {
    if (!userStats || !userProfile) return [];

    return [
      {
        id: 1,
        title: "First Post",
        description: "Started your journey",
        karma: 10,
        icon: Star,
        achieved: userStats.postsCount > 0,
      },
      {
        id: 2,
        title: "Rising Star",
        description: "Reached 100 followers",
        karma: 50,
        icon: Trophy,
        achieved: userStats.followersCount >= 100,
      },
      {
        id: 3,
        title: "Content Creator",
        description: "Published 10 posts",
        karma: 100,
        icon: Award,
        achieved: userStats.postsCount >= 10,
      },
      {
        id: 4,
        title: "Influencer",
        description: "Reached 1000 followers",
        karma: 500,
        icon: Target,
        achieved: userStats.followersCount >= 1000,
      },
      {
        id: 5,
        title: "Viral Creator",
        description: "Received 1000 total likes",
        karma: 200,
        icon: Zap,
        achieved: userStats.totalLikes >= 1000,
      },
    ];
  };

  // Get display name with same fallback logic as getFeedPosts
  const getDisplayName = (profile: Profile | null) => {
    if (!profile) return "Creator";

    return (
      profile.display_name ||
      profile.full_name ||
      profile.username ||
      `User ${profile.id.slice(0, 8)}`
    );
  };

  // Get avatar with fallback logic
  const getAvatarUrl = (profile: Profile | null) => {
    if (!profile) return "/default-avatar.png";

    const displayName = getDisplayName(profile);
    return (
      profile.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        displayName
      )}&background=6366f1&color=ffffff&size=150`
    );
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-white/60">
          <p>Please log in to view your creator journey.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3 text-white/60">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading your journey...</span>
        </div>
      </div>
    );
  }

  if (error || !userStats || !userProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Failed to load data"}</p>
          <button
            onClick={loadUserData}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalKarma = userProfile.karma || 0;
  const level = Math.floor(totalKarma / 100) + 1;
  const progress = totalKarma % 100;
  const milestones = getMilestones();

  return (
    <div className="space-y-8">
      {/* User Welcome */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={getAvatarUrl(userProfile)}
            alt={getDisplayName(userProfile)}
            className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
          />
          <div>
            <h2 className="text-2xl text-white">
              {getDisplayName(userProfile)}
            </h2>
            <p className="text-white/60">@{userProfile.username || "user"}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl text-white">{userStats.postsCount}</div>
            <p className="text-white/60 text-sm">Posts</p>
          </div>
          <div className="text-center">
            <div className="text-2xl text-white">
              {userStats.followersCount}
            </div>
            <p className="text-white/60 text-sm">Followers</p>
          </div>
          <div className="text-center">
            <div className="text-2xl text-white">
              {userStats.followingCount}
            </div>
            <p className="text-white/60 text-sm">Following</p>
          </div>
          <div className="text-center">
            <div className="text-2xl text-white">{userStats.totalLikes}</div>
            <p className="text-white/60 text-sm">Total Likes</p>
          </div>
        </div>
      </div>

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
            <p className="text-white/60">{100 - progress} until next level</p>
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
        <h3 className="text-xl text-white mb-4">Milestones</h3>
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`bg-black/40 backdrop-blur-xl rounded-lg p-6 border transition-all ${
              milestone.achieved
                ? "border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                : "border-white/5"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  milestone.achieved
                    ? "bg-white/10 text-white"
                    : "bg-white/5 text-white/40"
                }`}
              >
                <milestone.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4
                  className={`text-lg ${
                    milestone.achieved ? "text-white" : "text-white/40"
                  }`}
                >
                  {milestone.title}
                </h4>
                <p
                  className={
                    milestone.achieved ? "text-white/60" : "text-white/30"
                  }
                >
                  {milestone.description}
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`text-lg ${
                    milestone.achieved ? "text-white" : "text-white/40"
                  }`}
                >
                  +{milestone.karma} Karma
                </div>
                <div
                  className={`text-sm px-2 py-1 rounded-full ${
                    milestone.achieved
                      ? "text-emerald-400 bg-emerald-400/10"
                      : "text-white/30 bg-white/5"
                  }`}
                >
                  {milestone.achieved ? "Achieved" : "Locked"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievement Summary */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
        <h3 className="text-xl text-white mb-4">Achievement Summary</h3>
        <div className="flex items-center justify-between">
          <span className="text-white/60">
            {milestones.filter((m) => m.achieved).length} of {milestones.length}{" "}
            milestones completed
          </span>
          <div className="text-right">
            <div className="text-white">
              {Math.round(
                (milestones.filter((m) => m.achieved).length /
                  milestones.length) *
                  100
              )}
              % Complete
            </div>
          </div>
        </div>
        <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
            style={{
              width: `${
                (milestones.filter((m) => m.achieved).length /
                  milestones.length) *
                100
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
