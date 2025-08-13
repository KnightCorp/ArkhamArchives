// CreatorsSection.tsx
import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import * as exploreQueries from "../../../lib/exploreQueries";

interface Creator {
  id: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  follower_count: number;
  content_count: number;
  categories: string[];
  verified: boolean;
  featured: boolean;
  is_following?: boolean;
}

const CreatorCard = ({
  creator,
  onFollow,
}: {
  creator: Creator;
  onFollow: (creatorId: string) => void;
}) => (
  <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all">
    <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 flex items-center justify-center">
      <img
        src={
          creator.avatar_url ||
          "https://images.unsplash.com/photo-1494790108755-2616b332c74c?w=150&h=150&fit=crop"
        }
        alt={creator.name}
        className="w-20 h-20 rounded-full border-2 border-white/20"
      />
    </div>
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-zinc-200 font-medium">{creator.name}</h3>
        {creator.verified && <Star className="w-4 h-4 text-yellow-500" />}
      </div>
      <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{creator.bio}</p>
      <div className="flex justify-between items-center mb-3">
        <span className="text-zinc-400 text-sm">
          {creator.follower_count.toLocaleString()} followers
        </span>
        <span className="text-zinc-400 text-sm">
          {creator.content_count} posts
        </span>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {creator.categories.slice(0, 3).map((category, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-zinc-800 text-zinc-300 rounded"
          >
            {category}
          </span>
        ))}
      </div>
      <button
        onClick={() => onFollow(creator.id)}
        className={`w-full py-2 px-4 rounded-lg transition-all ${
          creator.is_following
            ? "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }`}
      >
        {creator.is_following ? "Following" : "Follow"}
      </button>
    </div>
  </div>
);

export const CreatorsSection = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        // You can switch between different queries based on your needs
        const data = await exploreQueries.getAllCreators();
        // Or use: exploreQueries.getFeaturedCreators()
        // Or use: exploreQueries.getNewCreators()
        setCreators(data);
      } catch (error) {
        console.error("Error fetching creators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  const handleFollow = async (creatorId: string) => {
    try {
      const userId = "current-user-id"; // Replace with actual user ID
      const creator = creators.find((c) => c.id === creatorId);

      if (creator?.is_following) {
        await exploreQueries.unfollowCreator(userId, creatorId);
      } else {
        await exploreQueries.followCreator(userId, creatorId);
      }

      // Update local state
      setCreators((prev) =>
        prev.map((c) =>
          c.id === creatorId ? { ...c, is_following: !c.is_following } : c
        )
      );
    } catch (error) {
      console.error("Error following/unfollowing creator:", error);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-zinc-900 rounded-lg animate-pulse">
            <div className="aspect-video bg-zinc-800"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-zinc-800 rounded"></div>
              <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
              <div className="h-8 bg-zinc-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator) => (
        <CreatorCard
          key={creator.id}
          creator={creator}
          onFollow={handleFollow}
        />
      ))}
    </div>
  );
};
