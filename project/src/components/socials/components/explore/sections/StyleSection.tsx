// Updated StyleSection.tsx with proper error handling and authentication
import React, { useState, useEffect } from "react";
import { Heart, Bookmark, BookmarkCheck } from "lucide-react";
import { profileQueries } from "../../../lib/exploreQueries";
import { getCurrentUser } from "../../../lib/socialMediaQueries";

interface ContentStyle {
  id: string;
  title: string;
  curator_id: string;
  curator_name: string;
  curator_avatar: string | null;
  description: string | null;
  aesthetics_used: string[];
  moodboard: any[];
  tags: string[];
  featured: boolean;
  like_count: number;
  created_at: string;
  updated_at: string;
  isLiked?: boolean;
}

const StyleCard = ({
  style,
  currentUserId,
  onLikeChange,
}: {
  style: ContentStyle;
  currentUserId: string;
  onLikeChange?: (styleId: string, isLiked: boolean) => void;
}) => {
  const [isLiked, setIsLiked] = useState(style.isLiked || false);
  const [likeCount, setLikeCount] = useState(style.like_count);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (!currentUserId) return;

    setIsLoading(true);
    try {
      if (isLiked) {
        const { error } = await profileQueries.unlikeContentStyle(
          currentUserId,
          style.id
        );
        if (!error) {
          setIsLiked(false);
          setLikeCount((prev) => prev - 1);
          onLikeChange?.(style.id, false);
        } else {
          console.error("Error unliking style:", error);
        }
      } else {
        const { error } = await profileQueries.likeContentStyle(
          currentUserId,
          style.id
        );
        if (!error) {
          setIsLiked(true);
          setLikeCount((prev) => prev + 1);
          onLikeChange?.(style.id, true);
        } else {
          console.error("Error liking style:", error);
        }
      }
    } catch (error) {
      console.error("Error in like/unlike operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate placeholder moodboard if empty
  const moodboardImages =
    style.moodboard?.length > 0
      ? style.moodboard.slice(0, 9)
      : Array(9)
          .fill(null)
          .map((_, i) => ({
            url: `https://images.unsplash.com/photo-${
              1500000000000 + i * 1000
            }?w=200&h=200&fit=crop&auto=format`,
          }));

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg overflow-hidden transition-all duration-500 hover:transform hover:scale-[1.02] hover:border-purple-500/50">
      <div className="grid grid-cols-3 gap-1">
        {moodboardImages.map((item, index) => (
          <div key={index} className="aspect-square relative group">
            <img
              src={
                item?.url ||
                `https://images.unsplash.com/photo-${
                  1500000000000 + index * 1000
                }?w=200&h=200&fit=crop&auto=format`
              }
              alt=""
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
              onError={(e) => {
                e.currentTarget.src = `https://images.unsplash.com/photo-1500000000000?w=200&h=200&fit=crop&auto=format`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-zinc-200 font-medium mb-1 tracking-wide">
              {style.title}
            </h3>
            <div className="flex items-center">
              <img
                src={
                  style.curator_avatar ||
                  "https://images.unsplash.com/photo-1494790108755-2616b332c74c?w=32&h=32&fit=crop"
                }
                alt={style.curator_name}
                className="w-6 h-6 rounded-full mr-2"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1494790108755-2616b332c74c?w=32&h=32&fit=crop";
                }}
              />
              <span className="text-zinc-400 text-sm">
                {style.curator_name}
              </span>
            </div>
          </div>

          <button
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all duration-300 ${
              isLiked
                ? "bg-red-900/30 text-red-300 hover:bg-red-800/30"
                : "bg-zinc-800/50 text-zinc-400 hover:bg-red-900/30 hover:text-red-300"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            )}
            <span className="text-xs">{likeCount}</span>
          </button>
        </div>

        {style.description && (
          <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
            {style.description}
          </p>
        )}

        <div className="space-y-2">
          {/* Aesthetics */}
          {style.aesthetics_used?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {style.aesthetics_used.slice(0, 3).map((aesthetic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-purple-900/30 text-purple-300 rounded border border-purple-700/30"
                >
                  {aesthetic}
                </span>
              ))}
            </div>
          )}

          {/* Tags */}
          {style.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {style.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-zinc-800/50 text-zinc-300 rounded border border-zinc-700/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const StyleSection = () => {
  const [styles, setStyles] = useState<ContentStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { user, error: userError } = await getCurrentUser();
        if (userError || !user) {
          throw new Error("User not authenticated");
        }

        setCurrentUser(user);

        // Get personalized styles
        const { data, error: stylesError } =
          await profileQueries.getPersonalizedStyles(user.id, 12);

        if (stylesError) {
          throw new Error("Failed to fetch styles");
        }

        setStyles(data || []);
      } catch (error) {
        console.error("Error fetching styles:", error);
        setError("Failed to load styles. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStyles();
  }, []);

  const handleLikeChange = (styleId: string, isLiked: boolean) => {
    setStyles((prev) =>
      prev.map((style) =>
        style.id === styleId
          ? {
              ...style,
              isLiked,
              like_count: style.like_count + (isLiked ? 1 : -1),
            }
          : style
      )
    );
  };

  // Authentication check
  if (!currentUser && !loading) {
    return (
      <div className="text-center py-8">
        <div className="text-white/60 mb-4">
          Please log in to view personalized styles
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
              {[...Array(9)].map((_, j) => (
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
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (styles.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-white/60 mb-4">
          No styles found. Try updating your aesthetic preferences to discover
          personalized content.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {styles.map((style) => (
        <StyleCard
          key={style.id}
          style={style}
          currentUserId={currentUser?.id}
          onLikeChange={handleLikeChange}
        />
      ))}
    </div>
  );
};
