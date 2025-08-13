import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  memo,
  useCallback,
  useMemo,
} from "react";
import { CreatePost } from "../components/create/CreatePost";
import { CreatorRow } from "../components/creator/CreatorRow";
import { FeedHeader } from "../components/feed/FeedHeader";
import { FeedPost } from "../components/feed/FeedPost";
import { AiContentGenerator } from "../components/feed/AiContentGenerator";
import { LiveStream } from "../components/feed/LiveStream";
// import { Multiverse } from "../components/feed/Multiverse";
// import { ExclusiveContent } from "../components/feed/ExclusiveContent";

// Lazy load components for better code splitting with preloading
const Journal = lazy(() =>
  import("../components/feed/Journal").then((module) => ({
    default: module.Journal,
  }))
);
const Alfred = lazy(() =>
  import("../components/feed/Alfred").then((module) => ({
    default: module.Alfred,
  }))
);
const Connections = lazy(() =>
  import("../components/feed/Connections").then((module) => ({
    default: module.Connections,
  }))
);
const Spectrum = lazy(() =>
  import("../components/feed/Spectrum").then((module) => ({
    default: module.Spectrum,
  }))
);
const CreatorJourney = lazy(() =>
  import("../components/feed/CreatorJourney").then((module) => ({
    default: module.CreatorJourney,
  }))
);
const Multiverse = lazy(() =>
  import("../components/feed/Multiverse").then((module) => ({
    default: module.Multiverse,
  }))
);
// const ExclusiveContent = lazy(() =>
//   import("../components/feed/ExclusiveContent").then((module) => ({
//     default: module.ExclusiveContent,
//   }))
// );
const EmergencySOS = lazy(() =>
  import("../components/feed/EmergencySOS").then((module) => ({
    default: module.EmergencySOS,
  }))
);
const Gossips = lazy(() =>
  import("../components/feed/Gossips").then((module) => ({
    default: module.Gossips,
  }))
);
const LiveMap = lazy(() =>
  import("../components/feed/LiveMap").then((module) => ({
    default: module.LiveMap,
  }))
);

// Preload function for commonly used components
const preloadComponent = (componentName: string) => {
  switch (componentName) {
    case "journal":
      import("../components/feed/Journal");
      break;
    case "search":
      import("../components/feed/Alfred");
      break;
    case "connections":
      import("../components/feed/Connections");
      break;
    default:
      break;
  }
};
import {
  Wand2,
  Radio,
  Rss,
  Book,
  SearchIcon,
  Users,
  Newspaper,
  Trophy,
  AlertTriangle,
  MessageSquareOff,
  MapPin,
  Bot,
  Printer,
  Crown,
  Network,
} from "../icons/FeedIcons";

import {
  getFeedPosts,
  getCurrentUser,
  likePostWithCount as likePost,
  unlikePostWithCount as unlikePost,
  createPost,
  subscribeToFeedUpdates,
} from "../lib/socialMediaQueries";

interface User {
  name: string;
  avatar: string;
  karma: number;
}

interface Post {
  id: string;
  user: User;
  image: string | null;
  likes: number;
  caption: string | null;
  comments: number;
  impressions: number;
  isLiked?: boolean;
  created_at?: string;
}

const Feed = () => {
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [showLiveStream, setShowLiveStream] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");

  // Add these new state variables
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Replace the hardcoded posts array with useEffect for data fetching
  useEffect(() => {
    initializeData();

    // Set up real-time subscription
    const subscription = subscribeToFeedUpdates((payload) => {
      if (payload.eventType === "INSERT") {
        loadFeedPosts();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const initializeData = async () => {
    setLoading(true);
    try {
      // Get current user
      const { user, error: userError } = await getCurrentUser();
      if (userError) throw userError;
      setCurrentUser(user);

      // Load feed posts
      await loadFeedPosts(user?.id);
    } catch (err) {
      console.error("Error initializing data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadFeedPosts = async (userId?: string) => {
    try {
      const { data, error } = await getFeedPosts(userId || currentUser?.id);
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error("Error loading posts:", err);
      setError("Failed to load posts");
    }
  };

  // Memoize expensive callbacks
  const handleLikePost = useCallback(
    async (postId: string, isCurrentlyLiked: boolean) => {
      if (!currentUser) {
        console.log("No current user, cannot like post");
        return;
      }

      console.log(`${isCurrentlyLiked ? "Unliking" : "Liking"} post:`, postId);

      try {
        // Optimistic update - update UI immediately
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: !isCurrentlyLiked,
                  likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1,
                }
              : post
          )
        );

        // Make API call
        if (isCurrentlyLiked) {
          const { error } = await unlikePost(currentUser.id, postId);
          if (error) throw error;
        } else {
          const { error } = await likePost(currentUser.id, postId);
          if (error) throw error;
        }

        console.log(
          `Successfully ${isCurrentlyLiked ? "unliked" : "liked"} post`
        );
      } catch (err) {
        console.error("Error liking/unliking post:", err);

        // Revert optimistic update on error
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: isCurrentlyLiked,
                  likes: isCurrentlyLiked ? post.likes + 1 : post.likes - 1,
                }
              : post
          )
        );

        // Show error to user
        setError("Failed to update like. Please try again.");
      }
    },
    [currentUser, likePost, unlikePost]
  );

  const handleCreatePost = useCallback(
    async (caption: string, imageUrl: string) => {
      if (!currentUser) return;

      try {
        const { data, error } = await createPost(
          currentUser.id,
          caption,
          imageUrl
        );
        if (error) throw error;

        // Reload posts to show new post
        await loadFeedPosts();
      } catch (err) {
        console.error("Error creating post:", err);
      }
    },
    [currentUser, createPost, loadFeedPosts]
  );

  const handleGenerate = useCallback((url: string, type: string) => {
    console.log(`Generated ${type} content:`, url);
  }, []);

  // Memoize loading spinner to prevent re-renders
  const LoadingSpinner = memo(() => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      <span className="ml-3 text-white/60">Loading...</span>
    </div>
  ));

  // Memoize tab click handlers to prevent re-renders
  const handleTabClick = useCallback((tabName: string) => {
    setActiveTab(tabName);
    // Preload commonly used components on hover/click
    if (["journal", "search", "connections"].includes(tabName)) {
      preloadComponent(tabName);
    }
  }, []);

  // Memoize posts to prevent unnecessary re-renders
  const memoizedPosts = useMemo(() => posts, [posts]);

  const renderContent = () => {
    switch (activeTab) {
      case "feed":
        return (
          <>
            {/* <CreatorRow /> */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => setShowAiGenerator(true)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-black/20 hover:bg-black/30 text-white border border-white/10 rounded-lg transition-colors backdrop-blur-sm"
              >
                <Wand2 className="w-5 h-5" />
                <span>Create with AI</span>
              </button>
              <button
                onClick={() =>
                  window.open("https://web-dun-iota.vercel.app/", "_blank")
                }
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-black/20 hover:bg-black/30 text-white border border-white/10 rounded-lg transition-colors backdrop-blur-sm"
              >
                <Radio className="w-5 h-5" />
                <span>Go Live</span>
              </button>
            </div>
            {showLiveStream && <LiveStream />}
            <div className="mb-8">
              <CreatePost onCreatePost={handleCreatePost} />
            </div>

            {/* Add loading and error states */}
            {loading && (
              <div className="text-center py-8 text-white/60">
                Loading posts...
              </div>
            )}

            {error && (
              <div className="text-center py-8 text-red-400">
                {error}
                <button
                  onClick={() => loadFeedPosts()}
                  className="ml-4 px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && posts.length === 0 && (
              <div className="text-center py-8 text-white/60">
                No posts yet. Be the first to post!
              </div>
            )}

            {posts.map((post) => (
              <FeedPost
                key={post.id}
                post={post}
                onLike={(postId, isLiked) => handleLikePost(postId, isLiked)}
                currentUser={currentUser}
              />
            ))}
          </>
        );
      case "journal":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Journal currentUser={currentUser} />
          </Suspense>
        );
      case "search":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Alfred currentUser={currentUser} />
          </Suspense>
        );
      case "connections":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Connections currentUser={currentUser} />
          </Suspense>
        );
      case "spectrum":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Spectrum currentUser={currentUser} />
          </Suspense>
        );
      case "journey":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <CreatorJourney currentUser={currentUser} />
          </Suspense>
        );
      case "sos":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <EmergencySOS currentUser={currentUser} />
          </Suspense>
        );
      case "gossips":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Gossips currentUser={currentUser} />
          </Suspense>
        );
      case "livemap":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <LiveMap currentUser={currentUser} />
          </Suspense>
        );
      case "multiverse":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Multiverse />
          </Suspense>
        );
      // case "exclusive":
      //   return (
      //     <Suspense fallback={<LoadingSpinner />}>
      //       <ExclusiveContent />
      //     </Suspense>
      //   );
      default:
        return null;
    }
  };
  if (!currentUser && !loading) {
    return (
      <div className="max-w-2xl mx-auto min-h-screen p-8 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl mb-4">Please log in to continue</h2>
          <p className="text-white/60">
            You need to be authenticated to view the feed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto min-h-screen p-8">
      <div className="video-background">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="video-bg"
          onError={(e) => console.error("Video failed to load:", e)}
          onCanPlay={() => console.log("Video can play")}
          onLoadedData={() => console.log("Video loaded")}
        >
          <source src="/social1.mp4" type="video/mp4" />
          <p>Your browser doesn't support HTML video.</p>
        </video>
      </div>
      <div className="video-overlay"></div>
      <div className="content-wrapper">
        <FeedHeader />

        {/* Feed Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-black/20 backdrop-blur-sm p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "feed"
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Rss className="w-4 h-4" />
            <span>Feed</span>
          </button>
          <button
            onClick={() => setActiveTab("journal")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "journal"
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Book className="w-4 h-4" />
            <span>Journal</span>
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "search"
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <SearchIcon className="w-4 h-4" />
            <span>Search</span>
          </button>
          <button
            onClick={() => setActiveTab("connections")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "connections"
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Connections</span>
          </button>
          <button
            onClick={() => setActiveTab("spectrum")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "spectrum"
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Spectrum</span>
          </button>
          <button
            onClick={() => setActiveTab("journey")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "journey"
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Journey</span>
          </button>
          <button
            onClick={() => setActiveTab("sos")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "sos"
                ? "bg-red-500/20 text-red-400"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Emergency</span>
          </button>
          <button
            onClick={() => setActiveTab("gossips")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "gossips"
                ? "bg-purple-500/20 text-purple-400"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <MessageSquareOff className="w-4 h-4" />
            <span>Whispers</span>
          </button>
          <button
            onClick={() => setActiveTab("livemap")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "livemap"
                ? "bg-green-500/20 text-green-400"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Live Map</span>
          </button>
          {/* <button
            onClick={() => setActiveTab("exclusive")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "exclusive"
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Exclusive</span>
          </button> */}
          <button
            onClick={() => setActiveTab("multiverse")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "multiverse"
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Multiverse</span>
          </button>
        </div>

        {renderContent()}

        {showAiGenerator && (
          <AiContentGenerator
            onGenerate={handleGenerate}
            onClose={() => setShowAiGenerator(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Feed;
