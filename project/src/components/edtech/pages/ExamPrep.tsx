import { useState, useEffect, useRef } from "react";
import { ExamChat } from "../components/exam/ExamChat";
import { ExamArena } from "../components/exam/ExamArena";
import { ExamTeam } from "../components/exam/ExamTeam";
import { ExamLeaderboard } from "../components/exam/ExamLeaderboard";
import { ExamPractice } from "../components/exam/ExamPractice";
import ExamVisualNovel from "../components/exam/ExamVisualNovel";
import supabase from "../../../lib/supabaseClient";
import toast from "react-hot-toast";
import { Clock, Watch, Timer, Hourglass, Book, Smartphone } from "lucide-react";

const ExamPrep = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const chatSessionRef = useRef<any>(null);

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  // Helper functions for session management
  const addUserXP = async (userId: string, xpToAdd: number) => {
    try {
      const { data, error } = await supabase.rpc("add_user_xp", {
        user_uuid: userId,
        xp_amount: xpToAdd,
      });
      if (error) {
        console.error("Error adding user XP:", error);
        return false;
      }
      return data;
    } catch (error) {
      console.error("Error in addUserXP:", error);
      return false;
    }
  };

  const saveChatSession = async (userId: string, sessionData: any) => {
    try {
      const { error } = await supabase.from("challenge_completions").insert({
        user_id: userId,
        challenge_id: `chat_session_${Date.now()}`,
        challenge_type: "chat_session",
        language_id: "study_chat",
        language_name: "Study Chat Session",
        xp_earned: sessionData.timeScore + sessionData.questionScore,
        code_submitted: JSON.stringify(sessionData),
        execution_output: JSON.stringify({
          time_spent: sessionData.timeSpent,
          questions_asked: sessionData.questionsAsked,
          time_score: sessionData.timeScore,
          question_score: sessionData.questionScore,
        }),
        completed_at: new Date().toISOString(),
      });
      return !error;
    } catch (error) {
      console.error("Error in saveChatSession:", error);
      return false;
    }
  };

  // Handle tab switching and award points if coming from chat
  const handleTabSwitch = async (newTab: string) => {
    // If switching away from chat and there's an active session, award points
    if (
      activeTab === "chat" &&
      newTab !== "chat" &&
      currentUser &&
      chatSessionRef.current
    ) {
      const sessionData = chatSessionRef.current;

      if (sessionData.questionsAsked > 0) {
        const now = new Date();
        const timeSpentSeconds = Math.floor(
          (now.getTime() - sessionData.sessionStartTime.getTime()) / 1000
        );
        const finalTimeSpent = Math.max(60, timeSpentSeconds);

        try {
          // Calculate XP
          const sessionXPData = {
            timeScore: Math.floor(finalTimeSpent / 60) * 5, // 5 XP per minute
            questionScore: sessionData.questionsAsked * 10, // 10 XP per question
            timeSpent: finalTimeSpent,
            questionsAsked: sessionData.questionsAsked,
          };

          await saveChatSession(currentUser.id, sessionXPData);
          await addUserXP(
            currentUser.id,
            sessionXPData.timeScore + sessionXPData.questionScore
          );

          // Update session in database
          await supabase.from("study_sessions").upsert(
            {
              user_id: currentUser.id,
              session_type: "chat",
              start_time: sessionData.sessionStartTime.toISOString(),
              last_update: now.toISOString(),
              time_spent: finalTimeSpent,
              questions_asked: sessionData.questionsAsked,
              status: "completed",
              metadata: {
                component: "ExamChat",
                activity_type: "study_questions",
                ended_by_tab_switch: true,
                switched_to_tab: newTab,
                completed_at: now.toISOString(),
              },
            },
            {
              onConflict: "user_id,session_type,start_time",
            }
          );

          toast.success(
            `🏆 Study session completed! Earned ${
              sessionXPData.timeScore + sessionXPData.questionScore
            } XP!`,
            {
              duration: 4000,
              position: "top-center",
            }
          );

          console.log("Chat session completed via tab switch:", sessionXPData);
        } catch (error) {
          console.error("Error awarding points on tab switch:", error);
          toast.error("Failed to save session progress");
        }
      }

      // Clear the session reference
      chatSessionRef.current = null;
    }

    setActiveTab(newTab);
  };

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
              onClick={() => handleTabSwitch(id)}
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
            {activeTab === "chat" && (
              <ExamChat
                onSessionDataChange={(sessionData) => {
                  chatSessionRef.current = sessionData;
                }}
              />
            )}
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
