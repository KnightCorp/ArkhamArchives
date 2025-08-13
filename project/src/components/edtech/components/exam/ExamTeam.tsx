import React, { useState, useEffect } from "react";
import { Users, Coins, Award, TrendingUp, Plus, UserPlus } from "lucide-react";
import {
  rankingService,
  LeaderboardEntry,
} from "../../../../services/rankingService";
import supabase from "../../../../lib/supabaseClient";
import toast from "react-hot-toast";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  rating: number;
  speciality: string;
  price: number;
}

// Supabase helper functions
const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  return data;
};

const addUserXP = async (userId: string, xpToAdd: number) => {
  try {
    const { data, error } = await supabase.rpc("add_user_xp", {
      user_uuid: userId,
      xp_amount: xpToAdd,
    });

    if (error) {
      console.error("Error adding user XP:", error);
      return false;
    }
    return data;
  } catch (error) {
    console.error("Error in addUserXP:", error);
    return false;
  }
};

const saveTeamComposition = async (
  userId: string,
  teamMembers: TeamMember[]
) => {
  try {
    const { error } = await supabase.from("challenge_completions").insert({
      user_id: userId,
      challenge_type: "team_formation",
      challenge_id: `team_${Date.now()}`,
      score: teamMembers.reduce((sum, member) => sum + member.rating, 0),
      time_taken: 0,
      completed: true,
      metadata: {
        team_members: teamMembers,
        team_rating:
          teamMembers.length > 0
            ? Math.floor(
                teamMembers.reduce((sum, member) => sum + member.rating, 0) /
                  teamMembers.length
              )
            : 0,
      },
    });

    if (error) {
      console.error("Error saving team composition:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in saveTeamComposition:", error);
    return false;
  }
};

const getTeamLeaderboard = async () => {
  try {
    const { data, error } = await supabase
      .from("challenge_completions")
      .select("*")
      .eq("challenge_type", "team_formation")
      .eq("completed", true)
      .order("score", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching team leaderboard:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error in getTeamLeaderboard:", error);
    return [];
  }
};

const getAvailablePlayersFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, total_xp, current_level")
      .order("total_xp", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching available players:", error);
      return [];
    }

    return (data || []).map((player, index) => ({
      rank: index + 1,
      user_id: player.id,
      name: player.username || "Anonymous",
      score: player.total_xp || 0,
      wins: 0,
      streak: 0,
      accuracy: 85 + Math.random() * 15, // Simulated accuracy
      time_bonus: Math.floor(Math.random() * 100),
      last_updated: new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error in getAvailablePlayersFromSupabase:", error);
    return [];
  }
};

export const ExamTeam = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<LeaderboardEntry[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [showMarket, setShowMarket] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [teamStats, setTeamStats] = useState<any>(null);

  useEffect(() => {
    loadTeamData();
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        const profile = await getUserProfile(user.id);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadTeamData = async () => {
    setLoading(true);
    try {
      // Get players from Supabase first
      const supabasePlayers = await getAvailablePlayersFromSupabase();

      // Fallback to ranking service if no Supabase players
      let leaderboard: LeaderboardEntry[] = [];
      if (supabasePlayers.length > 0) {
        leaderboard = supabasePlayers;
      } else {
        leaderboard = await rankingService.getLeaderboard();
      }

      // Create team members from top players (simulating a team)
      const currentTeam: TeamMember[] = leaderboard
        .slice(0, 3)
        .map((player, index) => ({
          id: player.user_id || `player-${index}`,
          name: player.name,
          role: index === 0 ? "Team Captain" : "Member",
          rating: player.score,
          speciality: getSpecialityFromScore(player.score),
          price: calculatePrice(player.score),
        }));

      setTeamMembers(currentTeam);
      setAvailablePlayers(leaderboard.slice(3, 10)); // Next 7 players as available

      // Load team stats
      const teamLeaderboard = await getTeamLeaderboard();
      setTeamStats(teamLeaderboard);
    } catch (error) {
      toast.error("Failed to load team data");
      console.error("Error loading team data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSpecialityFromScore = (score: number): string => {
    if (score >= 2000) return "Elite Scholar";
    if (score >= 1500) return "Advanced Learner";
    if (score >= 1000) return "Intermediate";
    return "Beginner";
  };

  const calculatePrice = (score: number): number => {
    return Math.floor(score * 0.8);
  };

  const addPlayerToTeam = async (player: LeaderboardEntry) => {
    if (teamMembers.length >= 5) {
      toast.error("Team is full! Maximum 5 members allowed.");
      return;
    }

    const newMember: TeamMember = {
      id: player.user_id || `player-${Date.now()}`,
      name: player.name,
      role: "Member",
      rating: player.score,
      speciality: getSpecialityFromScore(player.score),
      price: calculatePrice(player.score),
    };

    const updatedTeam = [...teamMembers, newMember];
    setTeamMembers(updatedTeam);
    setAvailablePlayers(
      availablePlayers.filter((p) => p.user_id !== player.user_id)
    );

    // Save team composition to Supabase
    if (currentUser) {
      await saveTeamComposition(currentUser.id, updatedTeam);
      // Award XP for team building
      await addUserXP(currentUser.id, 50);
    }

    toast.success(`${player.name} added to team!`);
  };

  const removePlayerFromTeam = async (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (member) {
      const updatedTeam = teamMembers.filter((m) => m.id !== memberId);
      setTeamMembers(updatedTeam);

      // Add back to available players
      const playerEntry: LeaderboardEntry = {
        user_id: member.id,
        name: member.name,
        score: member.rating,
        wins: 0,
        streak: 0,
        accuracy: 85,
        time_bonus: 0,
        rank: 0,
        last_updated: new Date().toISOString(),
      };
      setAvailablePlayers([...availablePlayers, playerEntry]);

      // Save updated team composition to Supabase
      if (currentUser) {
        await saveTeamComposition(currentUser.id, updatedTeam);
      }

      toast.success(`${member.name} removed from team`);
    }
  };

  const teamRating =
    teamMembers.length > 0
      ? Math.floor(
          teamMembers.reduce((sum, member) => sum + member.rating, 0) /
            teamMembers.length
        )
      : 0;

  const teamBudget =
    5000 - teamMembers.reduce((sum, member) => sum + member.price, 0);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-silver mx-auto mb-4"></div>
          <p className="text-silver font-code">Loading Team Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Team Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-black/50 border border-silver/20 rounded-lg p-6">
          <div className="flex items-center space-x-2 text-silver/70 mb-4">
            <Users className="w-5 h-5" />
            <span className="font-code">Team Size</span>
          </div>
          <div className="text-3xl text-silver font-code">
            {teamMembers.length}/5
          </div>
        </div>
        <div className="bg-black/50 border border-silver/20 rounded-lg p-6">
          <div className="flex items-center space-x-2 text-silver/70 mb-4">
            <Coins className="w-5 h-5" />
            <span className="font-code">Budget</span>
          </div>
          <div className="text-3xl text-silver font-code">{teamBudget}</div>
        </div>
        <div className="bg-black/50 border border-silver/20 rounded-lg p-6">
          <div className="flex items-center space-x-2 text-silver/70 mb-4">
            <Award className="w-5 h-5" />
            <span className="font-code">Team Rating</span>
          </div>
          <div className="text-3xl text-silver font-code">{teamRating}</div>
        </div>
      </div>

      {/* Team Members */}
      <div className="space-y-4">
        <h3 className="text-xl text-silver font-code">Current Roster</h3>
        {teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-black/50 border border-silver/20 rounded-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-silver font-code">{member.name}</h4>
                  <p className="text-silver/60 font-code">{member.role}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-silver font-code">
                    <TrendingUp className="w-4 h-4" />
                    <span>{member.rating}</span>
                  </div>
                  <p className="text-silver/60 font-code">
                    {member.speciality}
                  </p>
                </div>
                <button
                  onClick={() => removePlayerFromTeam(member.id)}
                  className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-all font-code text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-silver/60 font-code">
              No team members yet. Add players from the market!
            </p>
          </div>
        )}
      </div>

      {/* Market */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl text-silver font-code">Transfer Market</h3>
          <button
            onClick={() => setShowMarket(!showMarket)}
            className="px-4 py-2 bg-silver/10 text-silver border border-silver/30 rounded hover:bg-silver/20 transition-all font-code text-sm flex items-center space-x-2"
          >
            {showMarket ? "Hide Market" : "Open Market"}
            {showMarket ? (
              <Plus className="w-4 h-4 rotate-45" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
          </button>
        </div>

        {showMarket && (
          <div className="space-y-4">
            {availablePlayers.length > 0 ? (
              availablePlayers.map((player) => (
                <div
                  key={player.user_id}
                  className="bg-black/50 border border-silver/20 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-silver font-code">{player.name}</h4>
                      <p className="text-silver/60 font-code">
                        Rank #{player.rank}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-silver font-code">
                        <TrendingUp className="w-4 h-4" />
                        <span>{player.score}</span>
                      </div>
                      <p className="text-silver/60 font-code">
                        {getSpecialityFromScore(player.score)}
                      </p>
                    </div>
                    <button
                      onClick={() => addPlayerToTeam(player)}
                      className="px-3 py-1 bg-silver/10 text-silver border border-silver/30 rounded hover:bg-silver/20 transition-all font-code text-sm"
                    >
                      Add to Team
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-silver/60 font-code">
                  No available players in the market.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Team Performance */}
      {teamStats && teamStats.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl text-silver font-code">
            Team Performance Leaderboard
          </h3>
          <div className="space-y-2">
            {teamStats.slice(0, 5).map((team: any, index: number) => (
              <div
                key={index}
                className="bg-black/50 border border-silver/20 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-silver font-code">
                      Team #{index + 1}
                    </div>
                    <div className="text-silver/60 font-code text-sm">
                      {team.metadata?.team_members?.length || 0} members
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-silver font-code">{team.score}</div>
                    <div className="text-silver/60 font-code text-sm">
                      Avg Rating: {team.metadata?.team_rating || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Team Building Stats */}
      {userProfile && (
        <div className="bg-black/50 border border-silver/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-silver font-code">
              Your Team Building Stats
            </h3>
            <div className="flex items-center space-x-2 text-silver font-code">
              <Award className="w-5 h-5" />
              <span>XP: {userProfile.total_xp || 0}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="text-silver/60 font-code text-sm">Level</div>
              <div className="text-2xl text-silver font-code">
                {userProfile.current_level || 1}
              </div>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="text-silver/60 font-code text-sm">
                Teams Created
              </div>
              <div className="text-2xl text-silver font-code">
                {teamStats?.length || 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
