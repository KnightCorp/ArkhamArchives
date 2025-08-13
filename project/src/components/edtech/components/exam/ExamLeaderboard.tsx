import React, { useState, useEffect } from "react";
import {
  Watch,
  Clock,
  Timer,
  Hourglass,
  Award,
  Crown,
  TrendingUp,
  Medal,
  Shield,
  Star,
} from "lucide-react";
import {
  rankingService,
  LeaderboardEntry,
  UserScore,
} from "../../../../services/rankingService";
import supabase from "../../../../lib/supabaseClient";
import { initializeUserProfile } from "../../../../lib/userUtils";
import toast from "react-hot-toast";

// Supabase helper functions
const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);

    // If profile doesn't exist, create one
    if (error.code === "PGRST116") {
      console.log("Profile doesn't exist, creating new profile...");
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await initializeUserProfile(
          userId,
          userData.user.email || null,
          userData.user.user_metadata?.full_name || null
        );

        // Try to fetch again after creation
        const { data: newData, error: newError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (newError) {
          console.error("Error fetching newly created profile:", newError);
          return null;
        }

        return newData;
      }
    }

    return null;
  }
  return data;
};

const getSupabaseLeaderboard = async () => {
  try {
    console.log("Fetching leaderboard from Supabase...");
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, display_name, total_xp, level, current_streak, longest_streak"
      )
      .order("total_xp", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching Supabase leaderboard:", error);
      return [];
    }

    console.log("Supabase leaderboard data:", data);

    if (!data || data.length === 0) {
      console.log("No leaderboard data found in Supabase");
      return [];
    }

    const leaderboard = data.map((player, index) => ({
      rank: index + 1,
      user_id: player.id,
      name: player.display_name || "Anonymous",
      score: player.total_xp || 0,
      wins: Math.floor((player.total_xp || 0) / 50), // Estimate wins from XP (50 XP per win)
      streak: player.current_streak || 0,
      accuracy: Math.floor(85 + Math.random() * 15), // TODO: Calculate real accuracy from challenge_completions
      time_bonus: Math.floor(Math.random() * 100), // TODO: Calculate from actual completion times
      last_updated: new Date().toISOString(),
    }));

    console.log("Processed leaderboard:", leaderboard);
    return leaderboard;
  } catch (error) {
    console.error("Error in getSupabaseLeaderboard:", error);
    return [];
  }
};

const getUserStatsFromSupabase = async (userId: string) => {
  try {
    const profile = await getUserProfile(userId);
    if (!profile) return null;

    // Get user's challenge completions for more detailed stats
    const { data: completions, error } = await supabase
      .from("challenge_completions")
      .select("*")
      .eq("user_id", userId)
      .eq("completed", true);

    if (error) {
      console.error("Error fetching user completions:", error);
    }

    const wins = completions?.length || 0;
    const avgAccuracy =
      completions && completions.length > 0
        ? completions.reduce(
            (sum, comp) => sum + (comp.metadata?.accuracy || 85),
            0
          ) / completions.length
        : 85;

    return {
      user_id: userId,
      username: profile.display_name || "Anonymous",
      score: profile.total_xp || 0,
      wins,
      streak: profile.current_streak || 0, // Use actual streak from profile
      accuracy: Math.floor(avgAccuracy),
      time_bonus: Math.floor(Math.random() * 100), // TODO: Calculate from actual completion times
      last_updated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error in getUserStatsFromSupabase:", error);
    return null;
  }
};

export const ExamLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<UserScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState("");
  const [userRank, setUserRank] = useState<number>(0);
  const [showDebugger, setShowDebugger] = useState(false);

  useEffect(() => {
    loadData();
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const profile = await getUserProfile(user.id);
        setCurrentUsername(profile?.display_name || "Anonymous");
      } else {
        // Fallback to ranking service user info
        const userInfo = rankingService.getCurrentUserInfo();
        setCurrentUsername(userInfo.username);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      const userInfo = rankingService.getCurrentUserInfo();
      setCurrentUsername(userInfo.username);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      console.log("Loading leaderboard data...");
      let leaderboardData: LeaderboardEntry[] = [];
      let userStatsData: UserScore | null = null;

      // Always try to get data from Supabase first
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("Current user:", user?.id || "Not authenticated");

      // Get Supabase leaderboard data
      leaderboardData = await getSupabaseLeaderboard();
      console.log(
        "Leaderboard data loaded:",
        leaderboardData.length,
        "entries"
      );

      if (user) {
        // Get user-specific stats from Supabase
        userStatsData = await getUserStatsFromSupabase(user.id);
        console.log("User stats loaded:", userStatsData);

        // Calculate user rank from leaderboard position
        if (userStatsData) {
          const userRankPosition =
            leaderboardData.findIndex((player) => player.user_id === user.id) +
            1;
          setUserRank(userRankPosition || leaderboardData.length + 1);
          console.log(
            "User rank calculated:",
            userRankPosition || leaderboardData.length + 1
          );
        }
      }

      // Only fallback to ranking service if no Supabase data AND user is not authenticated
      if (leaderboardData.length === 0 && !user) {
        console.log("Falling back to ranking service for unauthenticated user");
        const [rankingLeaderboard, rankingUserStats] = await Promise.all([
          rankingService.getLeaderboard(),
          rankingService.getUserStats(),
        ]);
        leaderboardData = rankingLeaderboard;
        userStatsData = rankingUserStats;
        console.log(
          "Ranking service data loaded:",
          leaderboardData.length,
          "entries"
        );
      }

      setLeaderboard(leaderboardData);
      setUserStats(userStatsData);
      console.log("Data loading complete");
    } catch (error) {
      toast.error("Failed to load leaderboard data");
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUsername = async () => {
    const newUsername = prompt("Enter new username:", currentUsername);
    if (newUsername && newUsername.trim() && newUsername !== currentUsername) {
      try {
        // First try to update in Supabase
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { error } = await supabase
            .from("profiles")
            .update({
              display_name: newUsername.trim(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

          if (error) {
            throw error;
          }

          setCurrentUsername(newUsername.trim());
          toast.success("Username updated!");
          // Reload data to reflect changes
          await loadData();
        } else {
          // Fallback to ranking service for non-authenticated users
          rankingService.updateUsername(newUsername.trim());
          setCurrentUsername(newUsername.trim());
          toast.success("Username updated!");
          await loadData();
        }
      } catch (error) {
        console.error("Error updating username:", error);
        toast.error("Failed to update username");
      }
    }
  };

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

  const getAchievementBadges = (
    wins: number,
    streak: number,
    accuracy: number
  ) => {
    const badges = [];

    // Wins Badges
    if (wins >= 50) {
      badges.push({
        icon: Watch,
        color: "text-silver",
        title: "Grandmaster Timekeeper",
        description: "50+ wins",
      });
    } else if (wins >= 25) {
      badges.push({
        icon: Clock,
        color: "text-silver/80",
        title: "Master of Hours",
        description: "25+ wins",
      });
    }

    // Streak Badges
    if (streak >= 10) {
      badges.push({
        icon: Timer,
        color: "text-silver/60",
        title: "Eternal Timekeeper",
        description: "10+ streak",
      });
    } else if (streak >= 5) {
      badges.push({
        icon: Hourglass,
        color: "text-silver/40",
        title: "Time Bender",
        description: "5+ streak",
      });
    }

    // Accuracy Badges
    if (accuracy >= 95) {
      badges.push({
        icon: Star,
        color: "text-silver",
        title: "Perfect Precision",
        description: "95%+ accuracy",
      });
    }

    return badges;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-silver mx-auto mb-4"></div>
          <p className="text-silver font-code">Loading Eternal Records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User Info */}
      <div className="bg-black/50 border border-silver/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Watch className="w-6 h-6 text-silver animate-spin-slow" />
            <span className="text-silver font-code">Current Player:</span>
            <span className="text-silver font-alice">{currentUsername}</span>
          </div>
          <button
            onClick={updateUsername}
            className="px-3 py-1 bg-silver/10 text-silver border border-silver/30 rounded hover:bg-silver/20 transition-all font-code text-sm"
          >
            Change Name
          </button>
        </div>
      </div>

      {/* Top Players */}
      {leaderboard.length > 0 && (
        <div className="grid grid-cols-3 gap-6">
          {leaderboard.slice(0, 3).map((player) => (
            <div
              key={player.rank}
              className="relative bg-black/50 border border-silver/20 rounded-lg p-6 text-center group hover:border-silver/30 transition-colors"
            >
              <div className="absolute inset-0 clock-grid opacity-5" />
              <div className="relative">
                {/* Watch Icon */}
                <div className="mb-4 flex justify-center">
                  {getWatchIcon(player.rank)}
                </div>

                {/* Player Info */}
                <h3 className="text-silver font-alice mb-2">{player.name}</h3>
                <div className="text-2xl text-silver font-alice mb-2">
                  {player.score}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-black/30 rounded p-2">
                    <div className="text-silver/60 text-xs font-code">
                      Accuracy
                    </div>
                    <div className="text-silver font-alice">
                      {player.accuracy}%
                    </div>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <div className="text-silver/60 text-xs font-code">
                      Time Bonus
                    </div>
                    <div className="text-silver font-alice">
                      +{player.time_bonus}
                    </div>
                  </div>
                </div>

                <div className="text-silver/60 font-code">
                  {player.wins} wins • {player.streak} streak
                </div>

                {/* Achievement Badges */}
                <div className="mt-4 flex justify-center space-x-2">
                  {getAchievementBadges(
                    player.wins,
                    player.streak,
                    player.accuracy
                  ).map((badge, index) => (
                    <div
                      key={index}
                      className="group relative"
                      title={`${badge.title} - ${badge.description}`}
                    >
                      <badge.icon
                        className={`w-6 h-6 ${badge.color} group-hover:animate-spin-slow`}
                      />
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 bg-black/90 text-xs text-silver p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-silver/20">
                        <div className="font-alice">{badge.title}</div>
                        <div className="text-silver/60 font-code text-[10px]">
                          {badge.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="bg-black/50 border border-silver/20 rounded-lg p-6">
        <h3 className="text-xl text-silver font-alice mb-6">Global Rankings</h3>
        {leaderboard.length > 0 ? (
          <div className="space-y-4">
            {leaderboard.map((player) => (
              <div
                key={player.rank}
                className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-silver/10 hover:border-silver/20 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {player.rank <= 3 ? (
                      getWatchIcon(player.rank)
                    ) : (
                      <span className="text-silver/40 font-alice">
                        {player.rank}
                      </span>
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
                      <span>+{player.time_bonus}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {getAchievementBadges(
                      player.wins,
                      player.streak,
                      player.accuracy
                    ).map((badge, index) => (
                      <badge.icon
                        key={index}
                        className={`w-5 h-5 ${badge.color}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-silver/60 font-code mb-2">
              {leaderboard.length === 0
                ? "No players yet. Be the first to compete!"
                : "Loading player data..."}
            </p>
            {process.env.NODE_ENV === "development" && (
              <p className="text-silver/40 font-code text-sm">
                Tip: Run the SQL scripts to add test data or invite friends!
              </p>
            )}
          </div>
        )}
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
            <span>Rank #{userRank || "N/A"}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-black/30 p-4 rounded-lg border border-silver/10">
            <Watch className="w-6 h-6 text-silver/60 mx-auto mb-2" />
            <div className="text-2xl text-silver font-alice">
              {userStats?.score || 0}
            </div>
            <div className="text-silver/60 font-code">Rating</div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg border border-silver/10">
            <Clock className="w-6 h-6 text-silver/60 mx-auto mb-2" />
            <div className="text-2xl text-silver font-alice">
              {userStats?.wins || 0}
            </div>
            <div className="text-silver/60 font-code">Wins</div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg border border-silver/10">
            <Timer className="w-6 h-6 text-silver/60 mx-auto mb-2" />
            <div className="text-2xl text-silver font-alice">
              {userStats?.streak || 0}
            </div>
            <div className="text-silver/60 font-code">Current Streak</div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg border border-silver/10">
            <Star className="w-6 h-6 text-silver/60 mx-auto mb-2" />
            <div className="text-2xl text-silver font-alice">
              {userStats?.accuracy || 0}%
            </div>
            <div className="text-silver/60 font-code">Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
};
