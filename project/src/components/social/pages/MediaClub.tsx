import React, { useState } from "react";
import { MediaClubHeader } from "../mediaclub/MediaClubHeader";
import { MediaClubTabs } from "../mediaclub/MediaClubTabs";
import { MediaClubContent } from "../mediaclub/MediaClubContent";
import { Eye, Newspaper } from "lucide-react";
import "../styles/themes/mediaClub.css";

const MediaClub = () => {
  const [activeTab, setActiveTab] = useState("learning");
  const [mode, setMode] = useState<"detective" | "gossip">("detective");

  return (
    <div
      className={`max-w-7xl mx-auto min-h-screen p-8 rounded-lg ${mode}-mode`}
    >
      {/* Mode Toggle */}
      <div className="flex justify-end mb-8">
        <button
          onClick={() => setMode(mode === "detective" ? "gossip" : "detective")}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
            mode === "detective"
              ? "bg-black/80 text-[#00ff00] border border-[#00ff00]/30"
              : "bg-[#1a0f0f]/90 text-[#8B0000] border border-[#8B0000]/30"
          }`}
        >
          {mode === "detective" ? (
            <>
              <Eye className="w-4 h-4" />
              <span>Switch to Gossip Mode</span>
            </>
          ) : (
            <>
              <Newspaper className="w-4 h-4" />
              <span>Switch to Detective Mode</span>
            </>
          )}
        </button>
      </div>

      <div className="relative">
        {mode === "detective" && (
          <div className="absolute inset-0 scan-effect" />
        )}
        <div className="relative z-10">
          <MediaClubHeader mode={mode} />
          <MediaClubTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mode={mode}
          />
          <MediaClubContent activeTab={activeTab} mode={mode} />
        </div>
      </div>
    </div>
  );
};

export default MediaClub;
