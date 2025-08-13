// Create this as a new component: components/reels/ReelModal.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronUp,
  ChevronDown,
  Heart,
  MessageCircle,
  Share,
  Pause,
  Play,
} from "lucide-react";
import { reelQueries, reelUtils } from "../../lib/reelQueries";
import type { Reel } from "../../types/reel";

interface ReelModalProps {
  reels: Reel[];
  currentReelIndex: number;
  currentUserId?: string;
  onClose: () => void;
  onReelUpdate?: (updatedReel: Reel) => void;
}

export const ReelModal: React.FC<ReelModalProps> = ({
  reels,
  currentReelIndex,
  currentUserId,
  onClose,
  onReelUpdate,
}) => {
  const [currentIndex, setCurrentIndex] = useState(currentReelIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const currentReel = reels[currentIndex];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowUp":
          e.preventDefault();
          navigateToPrevious();
          break;
        case "ArrowDown":
          e.preventDefault();
          navigateToNext();
          break;
        case " ":
          e.preventDefault();
          togglePlayPause();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  // Auto-play video when reel changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(console.error);
      }
    }

    // Record view for the current reel
    recordView();
  }, [currentIndex]);

  const navigateToNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const navigateToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const recordView = async () => {
    try {
      await reelQueries.recordReelView(currentReel.id);
      if (onReelUpdate) {
        onReelUpdate({
          ...currentReel,
          views_count: currentReel.views_count + 1,
        });
      }
    } catch (error) {
      console.error("Error recording view:", error);
    }
  };

  const handleLike = async () => {
    if (!currentUserId || isLiking) return;

    setIsLiking(true);
    try {
      const { error, isLiked } = await reelQueries.toggleReelLike(
        currentReel.id
      );

      if (!error && onReelUpdate) {
        onReelUpdate({
          ...currentReel,
          is_liked_by_user: isLiked,
          likes_count: isLiked
            ? currentReel.likes_count + 1
            : currentReel.likes_count - 1,
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  if (!currentReel) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateToPrevious();
          }}
          className="absolute top-1/2 left-4 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {currentIndex < reels.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateToNext();
          }}
          className="absolute top-1/2 right-4 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      )}

      {/* Reel container */}
      <div
        className="relative max-w-md max-h-[90vh] aspect-[9/16] bg-zinc-900 rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video */}
        <video
          ref={videoRef}
          src={currentReel.video_url}
          className="w-full h-full object-cover"
          loop
          playsInline
          muted
          autoPlay
          onClick={togglePlayPause}
        />

        {/* Play/Pause overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <button
              onClick={togglePlayPause}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </button>
          </div>
        )}

        {/* Content overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none">
          {/* Creator info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center mb-2">
                  <img
                    src={
                      currentReel.creator_avatar ||
                      `https://ui-avatars.com/api/?name=${currentReel.creator_name}&background=6366f1&color=ffffff&size=150`
                    }
                    alt={currentReel.creator_name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="text-white font-medium">
                      {currentReel.creator_name ||
                        currentReel.creator_username ||
                        "Unknown User"}
                    </h3>
                    <p className="text-white/70 text-sm">
                      @{currentReel.creator_username || "unknown"}
                    </p>
                  </div>
                </div>

                <h4 className="text-white text-sm mb-2 line-clamp-2">
                  {currentReel.title}
                </h4>

                {currentReel.description && (
                  <p className="text-white/80 text-sm line-clamp-3 mb-3">
                    {currentReel.description}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={handleLike}
                  disabled={!currentUserId || isLiking}
                  className={`flex flex-col items-center space-y-1 ${
                    currentReel.is_liked_by_user ? "text-red-400" : "text-white"
                  } ${!currentUserId ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                    <Heart
                      className={`w-6 h-6 ${
                        currentReel.is_liked_by_user ? "fill-current" : ""
                      }`}
                    />
                  </div>
                  <span className="text-xs">{currentReel.likes_count}</span>
                </button>

                <button className="flex flex-col items-center space-y-1 text-white">
                  <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-xs">{currentReel.comments_count}</span>
                </button>

                <button className="flex flex-col items-center space-y-1 text-white">
                  <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                    <Share className="w-6 h-6" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute top-4 left-4 right-4 flex space-x-1">
          {reels.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
