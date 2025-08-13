import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Star,
  Calendar,
  ArrowLeft,
  Play,
  Trophy,
  Target,
} from "lucide-react";
import supabase from "../../../../../lib/supabaseClient";
import toast from "react-hot-toast";

// Daily language rotation logic
const SUPPORTED_LANGUAGES = [
  { id: 71, name: "Python", icon: "🐍" },
  { id: 63, name: "JavaScript", icon: "🟨" },
  { id: 54, name: "C++", icon: "🔵" },
  { id: 62, name: "Java", icon: "☕" },
  { id: 50, name: "C", icon: "🔵" },
];

// XP and Level System Functions
const getCurrentLevel = (totalXP: number) => {
  return Math.floor(totalXP / 1000) + 1;
};

const getXPForNextLevel = (currentLevel: number) => {
  return currentLevel * 1000;
};

const getXPProgress = (totalXP: number) => {
  const currentLevel = getCurrentLevel(totalXP);
  const xpForCurrentLevel = (currentLevel - 1) * 1000;
  const xpForNextLevel = getXPForNextLevel(currentLevel);
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - totalXP;
  const progressPercentage = (xpInCurrentLevel / 1000) * 100;

  return {
    currentLevel,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage,
    totalXP,
  };
};

// Supabase helper functions
const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  return data;
};

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

const checkTodaysChallengeCompletion = async (userId: string) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  const { data, error } = await supabase
    .from("daily_challenge_history")
    .select("*")
    .eq("user_id", userId)
    .eq("challenge_date", today)
    .eq("completed", true)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "not found"
    console.error("Error checking challenge completion:", error);
    return false;
  }
  return !!data;
};

const markTodaysChallengeComplete = async (
  userId: string,
  languageUsed: string,
  xpEarned: number
) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    // Insert or update daily challenge history
    const { error: historyError } = await supabase
      .from("daily_challenge_history")
      .upsert(
        {
          user_id: userId,
          challenge_date: today,
          completed: true,
          xp_earned: xpEarned,
          language_used: languageUsed,
          completion_time: new Date().toISOString(),
        },
        {
          onConflict: "user_id,challenge_date",
        }
      );

    if (historyError) {
      console.error("Error updating daily challenge history:", historyError);
      return false;
    }

    // Update streak using the database function
    const { error: streakError } = await supabase.rpc("update_daily_streak", {
      user_uuid: userId,
    });

    if (streakError) {
      console.error("Error updating streak:", streakError);
      // Don't return false here as the main completion was successful
    }

    return true;
  } catch (error) {
    console.error("Error in markTodaysChallengeComplete:", error);
    return false;
  }
};

interface DailyChallenge {
  id: string;
  type: "debug" | "theory" | "code";
  title: string;
  description: string;
  question: string;
  code?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  xpReward: number;
  difficulty: "NOVICE" | "APPRENTICE" | "EXPERT" | "MASTER";
  timeLimit: number; // in seconds
  sequence_number?: number;
  stdin?: string;
}

interface DailyChallengesProps {
  onBack: () => void;
}

const DailyChallenges: React.FC<DailyChallengesProps> = ({ onBack }) => {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(
    SUPPORTED_LANGUAGES[0]
  );
  const [totalXP, setTotalXP] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completedToday, setCompletedToday] = useState(false);
  const [judgeOutput, setJudgeOutput] = useState("");
  const [judgeStatus, setJudgeStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [judgeError, setJudgeError] = useState("");
  const [user, setUser] = useState<any>(null);
  const challenge = challenges[0];
  const [userInput, setUserInput] = useState("");
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>(
    []
  );
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [challengesLoaded, setChallengesLoaded] = useState(false);

  // Check authentication and get user profile
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error);
        return;
      }

      setUser(user);

      if (user) {
        const profile = await getUserProfile(user.id);
        setTotalXP(profile?.total_xp || 0);

        // Check if today's challenge is completed
        const isCompleted = await checkTodaysChallengeCompletion(user.id);
        setCompletedToday(isCompleted);
      }
    };

    getUser();
  }, []);

  // Fetch daily challenges from backend on mount
  useEffect(() => {
    setLoading(true);
    fetchDailyChallenges().then((challs) => {
      setChallenges(challs.length > 0 ? [challs[0]] : []);
      setLoading(false);
    });
  }, []);

  // Fetch latest XP from Supabase when challenge is completed
  useEffect(() => {
    const fetchLatestXP = async () => {
      if (completedToday && user) {
        const profile = await getUserProfile(user.id);
        setTotalXP(profile?.total_xp || 0);
      }
    };
    fetchLatestXP();
  }, [completedToday, user]);

  useEffect(() => {
    // Load progress
    const saved = loadProgressFromLocal(selectedLanguage.name);
    setCompletedChallengeIds(saved);
    setProgressLoaded(true);
  }, [selectedLanguage.name]);

  useEffect(() => {
    // When challenges are fetched/set, set challengesLoaded to true
    if (challenges && challenges.length >= 0) {
      setChallengesLoaded(true);
    }
  }, [challenges]);

  if (!progressLoaded || !challengesLoaded) {
    return null; // or a spinner
  }

  if (
    challenges.length > 0 &&
    completedChallengeIds.length >= challenges.length
  ) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
        <p>You've completed all daily challenges.</p>
      </div>
    );
  }

  // Handle code execution
  const handleRun = async () => {
    setJudgeStatus("pending");
    setJudgeOutput("");
    setJudgeError("");

    try {
      const res = await fetch("http://localhost:5050/api/judge0/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: userAnswer,
          language_id: selectedLanguage.id,
          stdin: userInput,
        }),
      });

      const data = await res.json();
      let outputGiven = false;

      if (data.stdout) {
        setJudgeOutput(atob(data.stdout));
        setJudgeStatus("success");
        outputGiven = true;
      } else if (data.stderr) {
        setJudgeOutput(atob(data.stderr));
        setJudgeStatus("error");
        outputGiven = true;
      } else {
        setJudgeOutput("No output.");
        setJudgeStatus("error");
        outputGiven = true;
      }

      // Award XP for running code (even if it fails)
      if (outputGiven && !completedToday && user) {
        const xpToAdd = 50; // XP for attempting the challenge
        const newTotalXP = await addUserXP(user.id, xpToAdd);
        if (newTotalXP && newTotalXP > 0) {
          setTotalXP(newTotalXP);
          toast.success(`+${xpToAdd} XP for running code!`);
        }
      }
    } catch (e: any) {
      setJudgeError("Failed to execute code.");
      setJudgeStatus("error");

      // Still award XP for attempt
      if (!completedToday && user) {
        const xpToAdd = 25;
        const newTotalXP = await addUserXP(user.id, xpToAdd);
        if (newTotalXP && newTotalXP > 0) {
          setTotalXP(newTotalXP);
          toast.success(`+${xpToAdd} XP for attempting!`);
        }
      }
    }
  };

  // Handle challenge completion
  const handleChallengeComplete = async () => {
    if (!user || completedToday) return;

    try {
      const xpReward = challenge?.xpReward || 200;

      // First, add XP to the user's profile
      const newTotalXP = await addUserXP(user.id, xpReward);

      if (newTotalXP && newTotalXP > 0) {
        // Mark challenge as complete and update streak
        const success = await markTodaysChallengeComplete(
          user.id,
          selectedLanguage.name,
          xpReward
        );

        if (success) {
          // Update local state with the new XP total
          setTotalXP(newTotalXP);
          setCompletedToday(true);
          toast.success(`Challenge completed! +${xpReward} XP earned!`);
        } else {
          toast.error("Failed to complete challenge. Please try again.");
        }
      } else {
        toast.error("Failed to award XP. Please try again.");
      }
    } catch (error) {
      console.error("Error completing challenge:", error);
      toast.error("An error occurred while completing the challenge.");
    }
  };

  // Show completion message - consolidated logic
  console.log("🔍 Debug completion:", {
    completedToday: completedToday,
    challengesLength: challenges.length,
    loading: loading,
    user: user?.id || "No user",
  });

  // Don't show anything while loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-6">
          <svg
            className="animate-spin h-8 w-8 text-green-400 mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          <span className="text-white/80 text-lg">
            Loading daily challenges...
          </span>
        </div>
      </div>
    );
  }

  // Move this to the very top and remove all other completion returns
  if (completedToday && challenges.length > 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-6">
          <Trophy className="w-16 h-16 text-gray-300 animate-bounce" />
          <div className="text-center space-y-2">
            <h2 className="text-3xl text-white font-bold">
              Daily Challenge Completed!
            </h2>
            <p className="text-white/60">
              You've already completed today's challenge. Come back tomorrow for
              a new one!
            </p>
            <p className="text-white/40 text-sm">
              Total XP: {totalXP.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all rounded-lg"
          >
            Return to Tech Club
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <style>{`
        .subtle-glow {
          text-shadow: 0 0 2px rgba(0, 255, 65, 0.3);
        }
        .black-glass {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .success-glow {
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
        }
        .error-glow {
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }
        .question-glow {
          box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-white/10 black-glass">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">BACK</span>
              </button>
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-6 h-6 text-green-400 question-glow" />
                <span className="text-white subtle-glow font-bold">
                  DAILY_CHALLENGES.EXE
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-white/60" />
                <span className="text-white/60">
                  DAY {new Date().getDate()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-white/60" />
                <span className="text-white/80">
                  LVL {getCurrentLevel(totalXP)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-white/60" />
                <span className="text-white/80">
                  XP: {getXPProgress(totalXP).totalXP.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* XP Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-white/60">
              Level {getCurrentLevel(totalXP)} Progress
            </span>
            <span className="text-white/80">
              {getXPProgress(totalXP).xpInCurrentLevel}/{1000} XP
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getXPProgress(totalXP).progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-white/40 mt-1">
            {getXPProgress(totalXP).xpNeededForNextLevel} XP needed for Level{" "}
            {getCurrentLevel(totalXP) + 1}
          </div>
        </div>

        {/* Language Header */}
        <div className="flex flex-col items-center mb-8">
          {/* Removed the existing header section */}
        </div>

        {/* Code Editor (always shown for the challenge) */}
        {challenge ? (
          <div className="mb-6 p-4 bg-black/40 border border-white/20 rounded">
            <div className="text-base font-semibold text-white mb-1">
              {challenge.question || "Solve the problem as described below."}
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-black/40 border border-white/20 rounded text-white/60 text-center">
            No daily challenge available.
          </div>
        )}

        {/* Code Editor (always shown for the challenge) */}
        <div className="mb-6">
          <div className="border border-white/20 bg-black/50">
            <div className="border-b border-white/10 px-3 py-2 bg-white/5 flex items-center justify-end">
              <button
                onClick={handleRun}
                className="flex items-center space-x-2 px-4 py-1 bg-white/10 border border-white/30 text-white/80 hover:bg-white/20 transition-all rounded"
              >
                <Play className="w-4 h-4" />
                <span>RUN</span>
              </button>
              <select
                value={selectedLanguage.id}
                onChange={(e) => {
                  const lang = SUPPORTED_LANGUAGES.find(
                    (l) => l.id === Number(e.target.value)
                  );
                  if (lang) setSelectedLanguage(lang);
                }}
                className="ml-2 bg-black border border-white/20 text-white px-2 py-1 rounded focus:outline-none"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full h-64 bg-transparent text-white font-mono text-sm p-4 resize-none outline-none"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Terminal Output */}
        <div
          className="mt-4 bg-black/80 border border-white/20 rounded p-4 max-h-64 overflow-y-auto text-xs font-mono flex flex-col"
          style={{ minHeight: "12rem" }}
        >
          <div className="mb-2 text-white/60 flex items-center">
            <span className="text-green-400 mr-2">neural@academy:~$</span>
            <span>TERMINAL OUTPUT</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {judgeStatus === "pending" && (
              <div className="text-white/60">Running code...</div>
            )}
            {judgeStatus === "success" && judgeOutput && (
              <div className="text-white whitespace-pre-line">
                {judgeOutput}
              </div>
            )}
            {judgeStatus === "error" && (judgeError || judgeOutput) && (
              <div className="text-red-400 whitespace-pre-line">
                {judgeError || judgeOutput}
              </div>
            )}
            {judgeStatus === "idle" && !judgeOutput && !judgeError && (
              <div className="text-white/40 whitespace-pre-line">
                No output.
              </div>
            )}
          </div>
          <div className="mt-3">
            <label className="block text-white/60 text-xs mb-1">
              Input (stdin):
            </label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full px-2 py-1 text-xs bg-black border border-white/20 text-white rounded resize-y min-h-[32px] max-h-24"
              placeholder="Enter input for your code here, one line per input() call."
              rows={2}
            />
          </div>
        </div>

        {/* Complete Button (always visible, block format) */}
        <div className="mt-6 flex justify-center">
          <button
            disabled={!(judgeOutput || judgeError) || completedToday}
            onClick={handleChallengeComplete}
            className={`block w-full max-w-xs px-6 py-3 rounded-lg font-bold text-lg transition-all
              ${
                completedToday
                  ? "bg-black text-white cursor-not-allowed border-2 border-white"
                  : judgeOutput || judgeError
                  ? "bg-white text-black hover:bg-black hover:text-white border-2 border-white shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-300"
              }
            `}
            style={{
              opacity: completedToday ? 0.7 : 1,
              boxShadow:
                (judgeOutput || judgeError) && !completedToday
                  ? "0 2px 8px rgba(0,0,0,0.15)"
                  : undefined,
            }}
          >
            {completedToday ? "Today's challenge completed!" : "Complete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyChallenges;

// Fetch daily challenges from backend
export const fetchDailyChallenges = async () => {
  try {
    const response = await fetch(
      "http://localhost:8000/techclub/daily-challenge/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.challenges && Array.isArray(data.challenges)) {
      return data.challenges;
    } else if (data.challenge) {
      return [data.challenge];
    } else {
      return [];
    }
  } catch (e) {
    console.error("Failed to fetch daily challenges:", e);
    return [];
  }
};

function loadProgressFromLocal(language: string): string[] {
  const key = `edtech_techclub_progress_${language}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}
