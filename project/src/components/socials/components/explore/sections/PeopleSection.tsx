// Updated PeopleSection.tsx with correct imports and functionality
import React, { useState, useEffect } from "react";
import { Heart, UserPlus, UserCheck } from "lucide-react";
// Updated imports - use the correct functions from the new files
import { getCompatibleProfiles } from "../../../lib/exploreQueries"; // This is from your first file
import {
  getCurrentUser,
  followUser,
  unfollowUser,
  isFollowing,
} from "../../../lib/socialMediaQueries"; // This is from your second file

interface CompatibilityProfile {
  id: string;
  display_name: string;
  personalityProfile: {
    traits: string[];
  };
  seductiveArchetype: {
    primaryArchetype: string;
  };
  coreValues: {
    attachmentStyle: string;
    emotionalIntelligence: number;
  };
  communicationStyle: {
    emotionalExpression: number;
  };
  interests: {
    hobbies: string[];
  };
  media: Array<{ type: "image" | "video"; url: string; thumbnail?: string }>;
  matchPercentage: number;
  isFollowing?: boolean;
}

const ProfileCard = ({
  profile,
  currentUserId,
  onFollowChange,
}: {
  profile: CompatibilityProfile;
  currentUserId: string;
  onFollowChange?: (profileId: string, isFollowing: boolean) => void;
}) => {
  const [isFollowingState, setIsFollowingState] = useState(
    profile.isFollowing || false
  );
  const [isLoading, setIsLoading] = useState(false);
  const [followingCheckLoading, setFollowingCheckLoading] = useState(true);

  // Check following status on component mount
  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (!currentUserId) return;

      try {
        setFollowingCheckLoading(true);
        const { isFollowing: followingStatus } = await isFollowing(
          currentUserId,
          profile.id
        );
        setIsFollowingState(followingStatus);
      } catch (error) {
        console.error("Error checking following status:", error);
      } finally {
        setFollowingCheckLoading(false);
      }
    };

    checkFollowingStatus();
  }, [currentUserId, profile.id]);

  const handleConnect = async () => {
    if (!currentUserId) return;

    setIsLoading(true);
    try {
      if (isFollowingState) {
        const { error } = await unfollowUser(currentUserId, profile.id);
        if (!error) {
          setIsFollowingState(false);
          onFollowChange?.(profile.id, false);
        } else {
          console.error("Error unfollowing user:", error);
        }
      } else {
        const { error } = await followUser(currentUserId, profile.id);
        if (!error) {
          setIsFollowingState(true);
          onFollowChange?.(profile.id, true);
        } else {
          console.error("Error following user:", error);
        }
      }
    } catch (error) {
      console.error("Error in follow/unfollow operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the main profile image or fallback
  const getProfileImage = () => {
    if (profile.media && profile.media.length > 0) {
      const mainImage = profile.media.find((item) => item.type === "image");
      if (mainImage) {
        return mainImage.url;
      }
    }
    return null;
  };

  const profileImage = getProfileImage();

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg p-6 transition-all duration-500 hover:transform hover:scale-[1.02] hover:border-purple-500/50">
      <div className="aspect-square mb-4 rounded-lg overflow-hidden">
        {profileImage ? (
          <img
            src={profileImage}
            alt={profile.display_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              (e.target as HTMLImageElement).style.display = "none";
              (
                e.target as HTMLImageElement
              ).nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div
          className={`w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center ${
            profileImage ? "hidden" : ""
          }`}
        >
          <span className="text-6xl font-bold text-zinc-300">
            {profile.display_name?.charAt(0)?.toUpperCase() || "?"}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-zinc-200">
          <h3 className="text-xl tracking-wider">{profile.display_name}</h3>
          <p className="text-sm text-zinc-400">
            {profile.seductiveArchetype.primaryArchetype}
          </p>
        </div>
        <div className="text-right flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          <div>
            <div className="text-2xl font-bold text-red-500">
              {Math.round(profile.matchPercentage)}%
            </div>
            <p className="text-sm text-zinc-400">affinity</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Heart className="w-4 h-4 text-red-400" />
          <span className="text-zinc-300 tracking-wide">
            {profile.coreValues.attachmentStyle} soul
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-zinc-400">
            <div className="mb-1 tracking-wider">Emotional Depth</div>
            <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-800 to-red-500 rounded-full"
                style={{
                  width: `${Math.min(
                    profile.communicationStyle.emotionalExpression * 10,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="text-zinc-400">
            <div className="mb-1 tracking-wider">Spirit Force</div>
            <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-800 to-red-500 rounded-full"
                style={{
                  width: `${Math.min(
                    profile.coreValues.emotionalIntelligence * 10,
                    100
                  )}%`,
                }}
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

      <button
        onClick={handleConnect}
        disabled={isLoading || followingCheckLoading}
        className={`w-full mt-4 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
          isFollowingState
            ? "bg-gradient-to-r from-green-900/50 to-green-800/50 text-green-300 hover:from-green-800/50 hover:to-green-700/50"
            : "bg-gradient-to-r from-red-900/50 to-red-800/50 text-red-300 hover:from-red-800/50 hover:to-red-700/50"
        } ${
          isLoading || followingCheckLoading
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {isLoading || followingCheckLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        ) : isFollowingState ? (
          <>
            <UserCheck className="w-4 h-4" />
            Connected
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Connect
          </>
        )}
      </button>
    </div>
  );
};

export const PeopleSection = () => {
  const [profiles, setProfiles] = useState<CompatibilityProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { user, error: userError } = await getCurrentUser();
        if (userError || !user) {
          throw new Error("User not authenticated");
        }

        setCurrentUser(user);

        // Get compatible profiles using the function from exploreQueries
        const compatibleProfiles = await getCompatibleProfiles(user.id, 12);

        // Transform the data to match our interface if needed
        interface RawProfile {
          id: string;
          display_name: string;
          personalityProfile: {
            traits: string[];
          };
          seductiveArchetype: {
            primaryArchetype: string;
          };
          coreValues: {
            attachmentStyle: string;
            emotionalIntelligence: number;
          };
          communicationStyle: {
            emotionalExpression: number;
          };
          interests: {
            hobbies: string[];
          };
          media: Array<{
            type: "image" | "video";
            url: string;
            thumbnail?: string;
          }>;
          compatibility_score?: number;
          matchPercentage?: number;
          isFollowing?: boolean;
        }

        const compatibleProfilesTyped: RawProfile[] = compatibleProfiles;

        const transformedProfiles: CompatibilityProfile[] =
          compatibleProfilesTyped.map(
            (profile: RawProfile): CompatibilityProfile => ({
              ...profile,
              matchPercentage:
                profile.compatibility_score ?? profile.matchPercentage ?? 75,
            })
          );

        setProfiles(transformedProfiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setError("Failed to load profiles. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleFollowChange = (profileId: string, isFollowing: boolean) => {
    setProfiles((prev) =>
      prev.map((profile) =>
        profile.id === profileId ? { ...profile, isFollowing } : profile
      )
    );
  };

  // Authentication check
  if (!currentUser && !loading) {
    return (
      <div className="text-center py-8">
        <div className="text-white/60 mb-4">
          Please log in to view compatible profiles
        </div>
        <button
          onClick={() => (window.location.href = "/login")}
          className="px-4 py-2 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition-colors text-purple-300"
        >
          Log In
        </button>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors text-red-300"
        >
          Retry
        </button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-zinc-900 rounded-lg p-6 animate-pulse">
            <div className="aspect-square bg-zinc-800 rounded-lg mb-4"></div>
            <div className="h-4 bg-zinc-800 rounded mb-2"></div>
            <div className="h-3 bg-zinc-800 rounded mb-4 w-2/3"></div>
            <div className="space-y-2">
              <div className="h-2 bg-zinc-800 rounded"></div>
              <div className="h-2 bg-zinc-800 rounded"></div>
            </div>
            <div className="h-8 bg-zinc-800 rounded mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (profiles.length === 0) {
    return (
      <div className="text-center py-8">
        <Heart className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <div className="text-white/60 mb-4">No compatible profiles found.</div>
        <div className="text-white/40 text-sm mb-4">
          Try updating your preferences or check back later for new matches.
        </div>
        <button
          onClick={() => {
            // You can add navigation to preferences page here
            console.log("Navigate to preferences");
          }}
          className="px-4 py-2 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition-colors text-purple-300"
        >
          Update Preferences
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Compatible Souls
          </h2>
          <p className="text-white/60">
            Discover people who resonate with your energy - {profiles.length}{" "}
            profiles found
          </p>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            currentUserId={currentUser?.id}
            onFollowChange={handleFollowChange}
          />
        ))}
      </div>
    </div>
  );
};
