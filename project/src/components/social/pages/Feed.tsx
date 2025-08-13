import React, { useState } from "react";
import { CreatePost } from "../create/CreatePost";
import { FeedHeader } from "../feed/FeedHeader";
import { CreatorRow } from "../creator/CreatorRow";
import { FeedPost } from "../feed/FeedPost";
import { AiContentGenerator } from "../feed/AiContentGenerator";
import { LiveStream } from "../feed/LiveStream";
import { Journal } from "../feed/Journal";
import { Alfred } from "../feed/Alfred";
import { Connections } from "../feed/Connections";
import { Spectrum } from "../feed/Spectrum";
import { CreatorJourney } from "../feed/CreatorJourney";
import { EmergencySOS } from "../feed/EmergencySOS";
import { Gossips } from "../feed/Gossips";
import {
  Wand2,
  Radio,
  Rss,
  Book,
  Search as SearchIcon,
  Users,
  Newspaper,
  Trophy,
  AlertTriangle,
  MessageSquareOff,
} from "lucide-react";

const Feed = () => {
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [showLiveStream, setShowLiveStream] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");

  const posts = [
    {
      id: 1,
      user: {
        name: "Vincent Gray",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
        karma: 250,
      },
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800",
      likes: 234,
      caption: "Shadows and light in the concrete jungle 🌃",
      comments: 12,
      impressions: 1543,
    },
    {
      id: 2,
      user: {
        name: "Nina Blake",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
        karma: 180,
      },
      image:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
      likes: 456,
      caption: "Late night jazz session at The Blue Room 🎷",
      comments: 23,
      impressions: 2891,
    },
  ];

  const handleGenerate = (url: string, type: string) => {
    console.log(`Generated ${type} content:`, url);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "feed":
        return (
          <>
            <CreatorRow />
            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => setShowAiGenerator(true)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-black/20 hover:bg-black/30 text-white border border-white/10 rounded-lg transition-colors backdrop-blur-sm"
              >
                <Wand2 className="w-5 h-5" />
                <span>Create with AI</span>
              </button>
              <button
                onClick={() => setShowLiveStream(!showLiveStream)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-black/20 hover:bg-black/30 text-white border border-white/10 rounded-lg transition-colors backdrop-blur-sm"
              >
                <Radio className="w-5 h-5" />
                <span>Go Live</span>
              </button>
            </div>
            {showLiveStream && <LiveStream />}
            <div className="mb-8">
              <CreatePost />
            </div>
            {posts.map((post) => (
              <FeedPost key={post.id} post={post} />
            ))}
          </>
        );
      case "journal":
        return <Journal />;
      case "search":
        return <Alfred />;
      case "connections":
        return <Connections />;
      case "spectrum":
        return <Spectrum />;
      case "journey":
        return <CreatorJourney />;
      case "sos":
        return <EmergencySOS />;
      case "gossips":
        return <Gossips />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-transparent min-h-screen p-8">
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
      </div>

      {renderContent()}

      {showAiGenerator && (
        <AiContentGenerator
          onGenerate={handleGenerate}
          onClose={() => setShowAiGenerator(false)}
        />
      )}
    </div>
  );
};

export default Feed;
