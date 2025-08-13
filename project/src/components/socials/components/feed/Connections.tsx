import React, { useState, useEffect } from "react";
import {
  Users,
  Heart,
  Activity,
  Brain,
  Loader2,
  UserMinus,
  UserCheck,
  MoreVertical,
} from "lucide-react";

import {
  getMutualConnections,
  getUserStats,
  getAllUsers,
  unfollowUser,
  getConnectionCount,
} from "../../lib/socialMediaQueries";

// Add API integration function for connection analysis
async function analyzeConnectionNetwork(
  individualId: string,
  connections: any[]
) {
  try {
    const response = await fetch(
      "https://connection-api-343916782787.us-central1.run.app/analyze_node",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          individual_id: individualId,
          connections: connections,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to analyze connection network. Status: ${response.status}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error analyzing connection network:", error);
    throw new Error(
      "Could not analyze connection network. Please try again later."
    );
  }
}

interface Connection {
  id: string;
  name: string;
  avatar: string;
  relationship: string;
  strength: number;
  interactions: number;
  insights: string[];
  karma: number;
  followId?: string; // For tracking the follow relationship ID
  connectionDate: string;
}

interface ConnectionsProps {
  currentUser: any;
}

export const Connections: React.FC<ConnectionsProps> = ({ currentUser }) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [stats, setStats] = useState({
    totalConnections: 0,
    closeRelations: 0,
    activeThisWeek: 0,
    influenceScore: 0,
    community: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disconnectingUsers, setDisconnectingUsers] = useState<Set<string>>(
    new Set()
  );
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "recent" | "active">("all");

  useEffect(() => {
    if (currentUser) {
      loadConnectionsData();
    }
  }, [currentUser]);

  const loadConnectionsData = async () => {
    if (!currentUser?.id) return;

    setLoading(true);
    setError(null);
    try {
      console.log("Loading connections for user:", currentUser.id);

      // Get user stats (updated for mutual system)
      const { data: userStats, error: statsError } = await getUserStats(
        currentUser.id
      );
      if (statsError) throw statsError;
      console.log("User stats:", userStats);

      // Get mutual connections using the new function
      const { data: mutualConnections, error: connectionsError } =
        await getMutualConnections(currentUser.id);
      if (connectionsError) throw connectionsError;
      console.log("Mutual connections raw data:", mutualConnections);

      // Transform connections data with better display name logic
      const transformedConnections = (mutualConnections || []).map(
        (connection: any) => {
          const profile = connection.connected_user;
          console.log(
            "Processing connection:",
            connection,
            "Profile:",
            profile
          );

          // Better fallback logic for user display name - prioritize display_name
          const displayName =
            profile?.display_name ||
            profile?.full_name ||
            profile?.username ||
            `User ${connection.following_id.slice(0, 8)}`;

          // Better fallback logic for avatar
          const avatarUrl =
            profile?.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              displayName
            )}&background=6366f1&color=ffffff&size=150`;

          return {
            id: connection.following_id,
            name: displayName,
            avatar: avatarUrl,
            relationship: "Connected", // In mutual system, all are "Connected"
            strength: Math.floor(Math.random() * 30) + 70, // Higher base strength for mutual connections
            interactions: Math.floor(Math.random() * 100) + 25,
            insights: [
              "Mutual connection - you follow each other",
              "Active engagement with shared interests",
              "Part of your trusted network",
            ],
            karma: profile?.karma || 0,
            followId: connection.id,
            connectionDate: connection.created_at,
          };
        }
      );

      console.log("Transformed connections:", transformedConnections);
      setConnections(transformedConnections);

      // Calculate stats for mutual system
      const totalConnections = transformedConnections.length;
      const closeRelations = transformedConnections.filter(
        (c) => c.strength > 85
      ).length;
      const activeThisWeek = Math.floor(totalConnections * 0.7); // Assume higher activity for mutual connections

      setStats({
        totalConnections,
        closeRelations,
        activeThisWeek,
        influenceScore: 0,
        community: 0,
      });

      // Test the Connection API with the current user's connections
      if (transformedConnections.length > 0) {
        try {
          console.log("🔍 Testing Connection API...");
          const connectionData = {
            individual_id: currentUser.id,
            connections: transformedConnections.slice(0, 5).map((conn) => ({
              individual_id: conn.id,
              relationship_strength: conn.strength / 100, // Convert to 0-1 scale
            })),
          };

          const response = await fetch(
            "https://connection-api-343916782787.us-central1.run.app/analyze_node",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(connectionData),
            }
          );

          if (response.ok) {
            const analysisResult = await response.json();
            console.log("✅ Connection API Response:", analysisResult);

            // Store the API result for display
            if (analysisResult.status === "success") {
              setStats((prev) => ({
                ...prev,
                influenceScore: analysisResult.influence_score || 0,
                community: analysisResult.community || 0,
              }));
            }
          } else {
            console.warn(
              "Connection API returned non-OK status:",
              response.status
            );
          }
        } catch (error) {
          console.error("Connection API test failed:", error);
        }
      }
    } catch (err) {
      console.error("Error loading connections data:", err);
      setError("Failed to load connections data");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (connection: Connection) => {
    if (!currentUser?.id) return;

    setDisconnectingUsers((prev) => new Set([...prev, connection.id]));
    try {
      // In mutual system, unfollowing removes both directions automatically
      const { error } = await unfollowUser(currentUser.id, connection.id);
      if (error) throw error;

      // Update local state - remove the connection entirely
      setConnections((prev) => prev.filter((c) => c.id !== connection.id));

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalConnections: prev.totalConnections - 1,
        closeRelations:
          prev.closeRelations - (connection.strength > 85 ? 1 : 0),
      }));

      setActiveDropdown(null);
    } catch (err) {
      console.error("Error disconnecting from user:", err);
      setError("Failed to disconnect from user");
    } finally {
      setDisconnectingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(connection.id);
        return newSet;
      });
    }
  };

  // Updated filter logic for mutual system
  const filteredConnections = connections.filter((connection) => {
    if (filter === "all") return true;
    if (filter === "recent") {
      // Show connections from last 30 days
      const connectionDate = new Date(connection.connectionDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return connectionDate > thirtyDaysAgo;
    }
    if (filter === "active") {
      // Show connections with high interaction or strength
      return connection.interactions > 50 || connection.strength > 80;
    }
    return true;
  });

  if (!currentUser) {
    return (
      <div className="text-center py-8 text-white/60">
        Please log in to view your connections.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-white/60" />
        <span className="ml-2 text-white/60">Loading connections...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={loadConnectionsData}
          className="px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Updated Filter Tabs for Mutual System */}
      <div className="flex space-x-1 bg-black/20 backdrop-blur-xl rounded-lg p-1 border border-white/5">
        {[
          { key: "all", label: "All Connections", count: connections.length },
          {
            key: "recent",
            label: "Recent",
            count: connections.filter((c) => {
              const connectionDate = new Date(c.connectionDate);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return connectionDate > thirtyDaysAgo;
            }).length,
          },
          {
            key: "active",
            label: "Active",
            count: connections.filter(
              (c) => c.interactions > 50 || c.strength > 80
            ).length,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === tab.key
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/60 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Updated Overview for Mutual System */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-white/60" />
            <span className="text-white/60">Total Connections</span>
          </div>
          <div className="text-2xl text-white">{stats.totalConnections}</div>
          <div className="text-xs text-white/40 mt-1">Mutual Network</div>
        </div>
        <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-5 h-5 text-white/60" />
            <span className="text-white/60">Close Relations</span>
          </div>
          <div className="text-2xl text-white">{stats.closeRelations}</div>
          <div className="text-xs text-white/40 mt-1">85%+ Strength</div>
        </div>
        <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-5 h-5 text-white/60" />
            <span className="text-white/60">Active This Week</span>
          </div>
          <div className="text-2xl text-white">{stats.activeThisWeek}</div>
          <div className="text-xs text-white/40 mt-1">Engaged Users</div>
        </div>
        <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-5 h-5 text-blue-400" />
            <span className="text-white/60">Influence Score</span>
          </div>
          <div className="text-2xl text-blue-400">
            {stats.influenceScore.toFixed(2)}
          </div>
          <div className="text-xs text-white/40 mt-1">AI-Powered</div>
        </div>
        <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-green-400" />
            <span className="text-white/60">Community</span>
          </div>
          <div className="text-2xl text-green-400">{stats.community}</div>
          <div className="text-xs text-white/40 mt-1">AI-Analyzed</div>
        </div>
      </div>

      {/* Connections List */}
      <div className="space-y-4">
        {filteredConnections.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <Users className="w-12 h-12 mx-auto mb-4 text-white/30" />
            <p>
              {filter === "all"
                ? "No connections yet. Start connecting with people to build your network!"
                : `No ${filter} connections found.`}
            </p>
          </div>
        ) : (
          filteredConnections.map((connection) => (
            <div
              key={connection.id}
              className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={connection.avatar}
                  alt={connection.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-white font-medium">
                          {connection.name}
                        </h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          <UserCheck className="w-3 h-3 inline mr-1" />
                          Connected
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-white/40">
                          {connection.karma} karma
                        </span>
                        <span className="text-xs text-white/40">
                          {connection.interactions} interactions
                        </span>
                        <span className="text-xs text-white/40">
                          Connected{" "}
                          {new Date(
                            connection.connectionDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-white text-sm">
                          {connection.strength}% Strength
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === connection.id
                                ? null
                                : connection.id
                            )
                          }
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          disabled={disconnectingUsers.has(connection.id)}
                        >
                          {disconnectingUsers.has(connection.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin text-white/60" />
                          ) : (
                            <MoreVertical className="w-4 h-4 text-white/60" />
                          )}
                        </button>

                        {activeDropdown === connection.id && (
                          <div className="absolute right-0 top-full mt-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg py-1 z-10 min-w-[140px]">
                            <button
                              onClick={() => handleDisconnect(connection)}
                              className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5 flex items-center space-x-2"
                            >
                              <UserMinus className="w-4 h-4" />
                              <span>Disconnect</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-white/60" />
                      <span className="text-white/60 text-sm">
                        Connection Insights
                      </span>
                    </div>
                    <div className="space-y-1">
                      {connection.insights.map((insight, index) => (
                        <p key={index} className="text-white/70 text-sm">
                          • {insight}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};
