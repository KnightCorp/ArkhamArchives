// Updated InterestsSection.tsx with proper error handling and authentication
import React, { useState, useEffect } from "react";
import { Users, UserPlus, UserCheck, Heart } from "lucide-react";
import { profileQueries } from "../../../lib/exploreQueries";
import { getCurrentUser } from "../../../lib/socialMediaQueries";

interface InterestGroup {
  id: string;
  name: string;
  curator_id: string;
  curator_name: string;
  curator_avatar: string | null;
  description: string | null;
  interests_covered: string[];
  featured_content: any[];
  member_count: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
  isMember?: boolean;
}

const InterestCard = ({
  interest,
  currentUserId,
  onMembershipChange,
}: {
  interest: InterestGroup;
  currentUserId: string;
  onMembershipChange?: (groupId: string, isMember: boolean) => void;
}) => {
  const [isMember, setIsMember] = useState(interest.isMember || false);
  const [memberCount, setMemberCount] = useState(interest.member_count);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinLeave = async () => {
    if (!currentUserId) return;

    setIsLoading(true);
    try {
      if (isMember) {
        const { error } = await profileQueries.leaveInterestGroup(
          currentUserId,
          interest.id
        );
        if (!error) {
          setIsMember(false);
          setMemberCount((prev) => prev - 1);
          onMembershipChange?.(interest.id, false);
        } else {
          console.error("Error leaving group:", error);
        }
      } else {
        const { error } = await profileQueries.joinInterestGroup(
          currentUserId,
          interest.id
        );
        if (!error) {
          setIsMember(true);
          setMemberCount((prev) => prev + 1);
          onMembershipChange?.(interest.id, true);
        } else {
          console.error("Error joining group:", error);
        }
      }
    } catch (error) {
      console.error("Error in join/leave operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate placeholder featured content if empty
  const featuredContent =
    interest.featured_content?.length > 0
      ? interest.featured_content.slice(0, 3)
      : [
          {
            type: "Article",
            title: "Featured Content",
            image: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop&auto=format`,
          },
          {
            type: "Video",
            title: "Popular Discussion",
            image: `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=200&fit=crop&auto=format`,
          },
          {
            type: "Event",
            title: "Community Meetup",
            image: `https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=200&h=200&fit=crop&auto=format`,
          },
        ];

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg overflow-hidden transition-all duration-500 hover:transform hover:scale-[1.02] hover:border-purple-500/50">
      <div className="grid grid-cols-3 gap-1">
        {featuredContent.map((item, index) => (
          <div key={index} className="aspect-square relative group">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
              onError={(e) => {
                e.currentTarget.src = `https://images.unsplash.com/photo-${
                  1500000000000 + index * 1000
                }?w=200&h=200&fit=crop&auto=format`;
              }}
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-center p-2">
                <div className="text-zinc-200 text-xs font-medium mb-1 line-clamp-2">
                  {item.title}
                </div>
                <div className="text-zinc-400 text-xs">{item.type}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-zinc-200 font-medium mb-1 tracking-wide">
              {interest.name}
            </h3>
            <div className="flex items-center mb-2">
              <img
                src={
                  interest.curator_avatar ||
                  "https://images.unsplash.com/photo-1494790108755-2616b332c74c?w=32&h=32&fit=crop"
                }
                alt={interest.curator_name}
                className="w-6 h-6 rounded-full mr-2"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1494790108755-2616b332c74c?w=32&h=32&fit=crop";
                }}
              />
              <span className="text-zinc-400 text-sm">
                {interest.curator_name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-zinc-400">
            <Users className="w-4 h-4" />
            <span className="text-xs">{memberCount.toLocaleString()}</span>
          </div>
        </div>

        {interest.description && (
          <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
            {interest.description}
          </p>
        )}

        <div className="space-y-3">
          {/* Interest Tags */}
          {interest.interests_covered?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {interest.interests_covered
                .slice(0, 4)
                .map((interestItem, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-900/30 text-blue-300 rounded border border-blue-700/30"
                  >
                    {interestItem}
                  </span>
                ))}
              {interest.interests_covered.length > 4 && (
                <span className="px-2 py-1 text-xs bg-zinc-800/50 text-zinc-400 rounded">
                  +{interest.interests_covered.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Join/Leave Button */}
          <button
            onClick={handleJoinLeave}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
              isMember
                ? "bg-gradient-to-r from-green-900/50 to-green-800/50 text-green-300 hover:from-green-800/50 hover:to-green-700/50"
                : "bg-gradient-to-r from-blue-900/50 to-blue-800/50 text-blue-300 hover:from-blue-800/50 hover:to-blue-700/50"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : isMember ? (
              <>
                <UserCheck className="w-4 h-4" />
                Member
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Join Group
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const InterestsSection = () => {
  const [interests, setInterests] = useState<InterestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { user, error: userError } = await getCurrentUser();
        if (userError || !user) {
          throw new Error("User not authenticated");
        }

        setCurrentUser(user);

        // Get personalized interest groups
        const { data, error: interestsError } =
          await profileQueries.getPersonalizedInterestGroups(user.id, 12);

        if (interestsError) {
          throw new Error("Failed to fetch interest groups");
        }

        setInterests(data || []);
      } catch (error) {
        console.error("Error fetching interests:", error);
        setError("Failed to load interest groups. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  const handleMembershipChange = (groupId: string, isMember: boolean) => {
    setInterests((prev) =>
      prev.map((interest) =>
        interest.id === groupId
          ? {
              ...interest,
              isMember,
              member_count: interest.member_count + (isMember ? 1 : -1),
            }
          : interest
      )
    );
  };

  // Authentication check
  if (!currentUser && !loading) {
    return (
      <div className="text-center py-8">
        <div className="text-white/60 mb-4">
          Please log in to view personalized interest groups
        </div>
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
          <div
            key={i}
            className="bg-zinc-900 rounded-lg overflow-hidden animate-pulse border border-zinc-800"
          >
            <div className="grid grid-cols-3 gap-1">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="aspect-square bg-zinc-800"></div>
              ))}
            </div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-zinc-800 rounded"></div>
              <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-zinc-800 rounded w-16"></div>
                <div className="h-6 bg-zinc-800 rounded w-20"></div>
              </div>
              <div className="h-8 bg-zinc-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (interests.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-white/60 mb-4">
          No interest groups found. Try updating your interest preferences to
          discover relevant communities.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {interests.map((interest) => (
        <InterestCard
          key={interest.id}
          interest={interest}
          currentUserId={currentUser?.id}
          onMembershipChange={handleMembershipChange}
        />
      ))}
    </div>
  );
};
