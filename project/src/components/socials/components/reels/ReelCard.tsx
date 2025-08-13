import React, { useState } from "react";
import {
  Play,
  Heart,
  Eye,
  MessageCircle,
  Share,
  MoreVertical,
} from "lucide-react";
import { reelQueries, reelUtils } from "../../lib/reelQueries";
import type { Reel } from "../../types/reel";

interface ReelCardProps {
  reel: Reel;
  currentUserId?: string;
  onReelUpdate?: (updatedReel: Reel) => void;
  onPlay?: (reel: Reel) => void;
}

export const ReelCard: React.FC<ReelCardProps> = ({
  reel,
  currentUserId,
  onReelUpdate,
  onPlay,
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const [localLikeState, setLocalLikeState] = useState({
    isLiked: reel.is_liked_by_user || false,
    count: reel.likes_count,
  });

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId || isLiking) return;

    setIsLiking(true);

    // Optimistic update
    setLocalLikeState((prev) => ({
      isLiked: !prev.isLiked,
      count: prev.isLiked ? prev.count - 1 : prev.count + 1,
    }));

    try {
      const { error, isLiked } = await reelQueries.toggleReelLike(reel.id);

      if (error) {
        // Revert optimistic update on error
        setLocalLikeState({
          isLiked: reel.is_liked_by_user || false,
          count: reel.likes_count,
        });
        console.error("Error toggling like:", error);
      } else if (onReelUpdate) {
        // Update parent component with new data
        onReelUpdate({
          ...reel,
          is_liked_by_user: isLiked,
          likes_count: localLikeState.count,
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert optimistic update
      setLocalLikeState({
        isLiked: reel.is_liked_by_user || false,
        count: reel.likes_count,
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handlePlay = async () => {
    // Record view when reel is played
    try {
      await reelQueries.recordReelView(reel.id);
      if (onReelUpdate) {
        onReelUpdate({
          ...reel,
          views_count: reel.views_count + 1,
        });
      }
    } catch (error) {
      console.error("Error recording view:", error);
    }

    if (onPlay) {
      onPlay(reel);
    }
  };

  return (
    <div
      className="group relative aspect-[9/16] rounded-lg overflow-hidden bg-zinc-900 cursor-pointer"
      onClick={handlePlay}
    >
      {/* Full-size background thumbnail image */}
      <img
        src={
          reel.thumbnail_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            reel.title
          )}&background=1f2937&color=ffffff&size=400`
        }
        alt={reel.title}
        className="absolute inset-0 w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
        loading="lazy"
      />

      {/* Duration badge */}
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs z-10">
        {reelUtils.formatDuration(reel.duration)}
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20"></div>

      {/* Hover overlay with enhanced opacity */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </button>
        </div>
      </div>

      {/* Content overlay - always visible */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        {/* Creator info */}
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                reel.creator_name || reel.creator_username || "Unknown"
              )}&background=random&size=32`}
              alt={reel.creator_name || reel.creator_username}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white text-sm font-medium truncate">
              {reel.creator_name || reel.creator_username || "Unknown User"}
            </h3>
            <p className="text-white/70 text-xs truncate">
              @{reel.creator_username || "unknown"}
            </p>
          </div>
          <button className="p-1 hover:bg-white/10 rounded transition-colors">
            <MoreVertical className="w-4 h-4 text-white/70" />
          </button>
        </div>

        <h4 className="text-white text-sm mb-3 line-clamp-2 font-medium">
          {reel.title}
        </h4>

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-white/70">
            <div className="flex items-center hover:text-white transition-colors">
              <Eye className="w-4 h-4 mr-1" />
              {reelUtils.formatViewCount(reel.views_count)}
            </div>
            <div className="flex items-center hover:text-white transition-colors">
              <MessageCircle className="w-4 h-4 mr-1" />
              {reel.comments_count}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              disabled={!currentUserId || isLiking}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full transition-all duration-300 ${
                localLikeState.isLiked
                  ? "bg-red-500/20 text-red-400 scale-105"
                  : "hover:bg-white/10 text-white/70 hover:text-white hover:scale-105"
              } ${!currentUserId ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Heart
                className={`w-4 h-4 transition-all duration-300 ${
                  localLikeState.isLiked ? "fill-current scale-110" : ""
                }`}
              />
              <span className="text-xs font-medium">
                {localLikeState.count}
              </span>
            </button>

            <button className="p-1.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all duration-300 hover:scale-110">
              <Share className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
