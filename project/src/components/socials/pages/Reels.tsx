import React, { useState, useEffect } from "react";
import { ReelCard } from "../components/reels/ReelCard";
import { reelQueries } from "../lib/reelQueries";
import { supabase } from "../../../lib/supabaseClient";
import type { Reel } from "../types/reel";
import { Loader2, Plus, TrendingUp, Clock } from "lucide-react";
import { CreateReel } from "../components/reels/createReel";
import { ReelModal } from "../components/reels/ReelModal";

const Reels: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"latest">("latest");
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReelModal, setShowReelModal] = useState(false);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);

  const loadReels = async (tab: "latest", offset = 0) => {
    try {
      let result;

      if (user?.id) {
        result = await reelQueries.getReelsWithUserStatus(user.id, 50, offset);
      } else {
        result = await reelQueries.getAllReels(50, offset);
      }

      if (result.error) {
        throw result.error;
      }

      if (offset === 0) {
        setReels(result.data || []);
      } else {
        setReels((prev) => [...prev, ...(result.data || [])]);
      }

      setHasMore((result.data?.length || 0) === 50);
    } catch (err) {
      console.error("Error loading reels:", err);
      setError("Failed to load reels. Please try again.");
    }
  };

  useEffect(() => {
    const fetchReels = async () => {
      setLoading(true);
      setError(null);
      await loadReels(activeTab);
      setLoading(false);
    };

    fetchReels();
  }, [activeTab, user?.id]);

  const handleTabChange = (tab: "latest") => {
    setActiveTab(tab);
    setReels([]);
    setHasMore(true);
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    await loadReels(activeTab, reels.length);
    setLoadingMore(false);
  };

  const handleReelUpdate = (updatedReel: Reel) => {
    setReels((prev) =>
      prev.map((reel) => (reel.id === updatedReel.id ? updatedReel : reel))
    );
  };

  const handleReelPlay = (reel: Reel) => {
    const reelIndex = reels.findIndex((r) => r.id === reel.id);
    setCurrentReelIndex(reelIndex);
    setShowReelModal(true);
  };
  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (!error) setUser(user);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      </div>
    );
  }
  const handleReelCreated = (newReel: Reel) => {
    setReels((prev) => [newReel, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-typewriter text-zinc-200">Reels</h1>

        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Reel</span>
          </button>
        )}
        {showCreateModal && (
          <CreateReel
            onClose={() => setShowCreateModal(false)}
            onReelCreated={handleReelCreated}
          />
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => handleTabChange("latest")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === "latest"
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Latest</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => loadReels(activeTab)}
            className="mt-2 text-red-300 hover:text-red-200 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Reels grid */}
      {reels.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {reels.map((reel) => (
              <ReelCard
                key={reel.id}
                reel={reel}
                currentUserId={user?.id}
                onReelUpdate={handleReelUpdate}
                onPlay={handleReelPlay}
              />
            ))}
          </div>

          {/* Load more button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center space-x-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>{loadingMore ? "Loading..." : "Load More"}</span>
              </button>
            </div>
          )}
        </>
      ) : (
        ""
      )}
      {showReelModal && (
        <ReelModal
          reels={reels}
          currentReelIndex={currentReelIndex}
          currentUserId={user?.id}
          onClose={() => setShowReelModal(false)}
          onReelUpdate={handleReelUpdate}
        />
      )}
    </div>
  );
};

export default Reels;
