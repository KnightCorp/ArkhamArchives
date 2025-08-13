import React, { useState } from "react";
import { ExamChat } from "../exam/ExamChat";
import { ExamArena } from "../exam/ExamArena";
import { ExamTeam } from "../exam/ExamTeam";
import { ExamLeaderboard } from "../exam/ExamLeaderboard";
import { ExamPractice } from "../exam/ExamPractice";
import { ExamVisualNovel } from "../exam/ExamVisualNovel";
import {
  Clock,
  Watch,
  Timer,
  Hourglass,
  StopCircle,
  Book,
  Smartphone,
} from "lucide-react";

const ExamPrep = () => {
  const [activeTab, setActiveTab] = useState("chat");

  const tabs = [
    { id: "chat", label: "Time Keeper", icon: Clock },
    { id: "practice", label: "Practice Sessions", icon: Book },
    { id: "arena", label: "Countdown Arena", icon: Timer },
    { id: "team", label: "Watchmakers", icon: Watch },
    { id: "leaderboard", label: "Eternal Records", icon: Hourglass },
    { id: "novel", label: "Visual Novel", icon: Smartphone },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative bg-black/95 rounded-2xl overflow-hidden border border-zinc-800/50">
        {/* ... rest of the hero section remains the same ... */}
      </div>

      {/* Navigation */}
      <div className="bg-black/95 rounded-xl p-2 border border-zinc-800/50">
        <div className="flex flex-wrap gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-alice transform hover:scale-105 ${
                activeTab === id
                  ? "bg-zinc-900/80 text-zinc-200 border border-zinc-700/50 hover:shadow-[0_0_15px_rgba(39,39,42,0.3)]"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  activeTab === id ? "animate-spin-slow" : ""
                }`}
              />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-black/95 rounded-2xl overflow-hidden border border-zinc-800/50">
        <div className="relative p-8">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501139083538-0139583c060f?w=1200&h=800&fit=crop')] opacity-10" />
          <div className="relative">
            {activeTab === "chat" && <ExamChat />}
            {activeTab === "practice" && <ExamPractice />}
            {activeTab === "arena" && <ExamArena />}
            {activeTab === "team" && <ExamTeam />}
            {activeTab === "leaderboard" && <ExamLeaderboard />}
            {activeTab === "novel" && <ExamVisualNovel />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPrep;
