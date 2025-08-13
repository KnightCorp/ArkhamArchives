import React, { useState, useEffect, useRef } from "react";
import {
  Swords,
  Clock,
  Trophy,
  Target,
  Zap,
  Users,
  Crown,
  ArrowLeft,
  Play,
  Square,
  Eye,
  Terminal,
  CheckCircle2,
  XCircle,
  Medal,
  TrendingUp,
} from "lucide-react";
import useAuthStore from "../../../../../store/useAuthStore";
import { supabase } from "../../../../../lib/supabaseClient";
import toast from "react-hot-toast";

interface PVPMatch {
  id: string;
  title: string;
  description: string;
  problem: string;
  starterCode: string;
  expectedOutput: string;
  timeLimit: number;
  difficulty: "NOVICE" | "APPRENTICE" | "EXPERT" | "MASTER";
  xpReward: number;
}

interface Player {
  id: string;
  username: string;
  level: number;
  xp: number;
  rank: number;
  avatar: string;
  status: "waiting" | "coding" | "completed" | "disconnected";
  progress: number;
}

interface PVPArenaProps {
  onBack: () => void;
}

const sampleMatches: PVPMatch[] = [
  {
    id: "pvp-1",
    title: "ARRAY_BATTLE.JS",
    description: "FASTEST CODER WINS",
    problem: "Write a function that finds the maximum number in an array",
    starterCode:
      "function findMax(arr) {\n  // YOUR CODE HERE\n  \n}\n\n// Test: findMax([1, 5, 3, 9, 2]) should return 9",
    expectedOutput: "9",
    timeLimit: 300,
    difficulty: "NOVICE",
    xpReward: 500,
  },
  {
    id: "pvp-2",
    title: "STRING_DUEL.JS",
    description: "REVERSE ENGINEERING CHALLENGE",
    problem:
      "Create a function that reverses a string without using built-in reverse methods",
    starterCode:
      'function reverseString(str) {\n  // YOUR CODE HERE\n  \n}\n\n// Test: reverseString("hello") should return "olleh"',
    expectedOutput: "olleh",
    timeLimit: 300, // Set to 5 minutes
    difficulty: "APPRENTICE",
    xpReward: 750,
  },
  {
    id: "pvp-3",
    title: "MATRIX_MULTIPLICATION.JS",
    description: "MULTIPLY TWO MATRICES",
    problem: "Write a function to multiply two matrices and return the result.",
    starterCode:
      "function multiplyMatrices(a, b) {\n  // YOUR CODE HERE\n}\n\n// Test: multiplyMatrices([[1,2],[3,4]], [[5,6],[7,8]])",
    expectedOutput: "[[19,22],[43,50]]",
    timeLimit: 300,
    difficulty: "EXPERT",
    xpReward: 1000,
  },
  {
    id: "pvp-4",
    title: "PALINDROME_CHECK.JS",
    description: "CHECK FOR PALINDROMES",
    problem: "Write a function that checks if a given string is a palindrome.",
    starterCode:
      'function isPalindrome(str) {\n  // YOUR CODE HERE\n}\n\n// Test: isPalindrome("racecar") should return true',
    expectedOutput: "true",
    timeLimit: 180,
    difficulty: "NOVICE",
    xpReward: 500,
  },
  {
    id: "pvp-5",
    title: "FIZZBUZZ_CHALLENGE.JS",
    description: "CLASSIC FIZZBUZZ",
    problem:
      'Write a function that prints numbers from 1 to 100. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both print "FizzBuzz".',
    starterCode:
      "function fizzBuzz() {\n  // YOUR CODE HERE\n}\n\n// Test: fizzBuzz()",
    expectedOutput: "1\n2\nFizz\n4\nBuzz\n...etc",
    timeLimit: 120,
    difficulty: "NOVICE",
    xpReward: 400,
  },
  {
    id: "pvp-6",
    title: "TWO_SUM.JS",
    description: "FIND TWO NUMBERS THAT ADD UP",
    problem:
      "Given an array of integers and a target, return indices of the two numbers such that they add up to the target.",
    starterCode:
      "function twoSum(nums, target) {\n  // YOUR CODE HERE\n}\n\n// Test: twoSum([2,7,11,15], 9) should return [0,1]",
    expectedOutput: "[0,1]",
    timeLimit: 180,
    difficulty: "APPRENTICE",
    xpReward: 600,
  },
  {
    id: "pvp-7",
    title: "ANAGRAM_FIGHT.JS",
    description: "CHECK FOR ANAGRAMS",
    problem:
      "Write a function to check if two strings are anagrams of each other.",
    starterCode:
      'function isAnagram(s, t) {\n  // YOUR CODE HERE\n}\n\n// Test: isAnagram("listen", "silent") should return true',
    expectedOutput: "true",
    timeLimit: 150,
    difficulty: "APPRENTICE",
    xpReward: 550,
  },
  {
    id: "pvp-8",
    title: "BINARY_SEARCH.JS",
    description: "SEARCH IN A SORTED ARRAY",
    problem:
      "Implement binary search on a sorted array. Return the index of the target, or -1 if not found.",
    starterCode:
      "function binarySearch(arr, target) {\n  // YOUR CODE HERE\n}\n\n// Test: binarySearch([1,2,3,4,5], 4) should return 3",
    expectedOutput: "3",
    timeLimit: 180,
    difficulty: "APPRENTICE",
    xpReward: 600,
  },
  {
    id: "pvp-9",
    title: "MERGE_SORT.JS",
    description: "IMPLEMENT MERGE SORT",
    problem: "Write a function to perform merge sort on an array.",
    starterCode:
      "function mergeSort(arr) {\n  // YOUR CODE HERE\n}\n\n// Test: mergeSort([5,2,4,6,1,3]) should return [1,2,3,4,5,6]",
    expectedOutput: "[1,2,3,4,5,6]",
    timeLimit: 300,
    difficulty: "EXPERT",
    xpReward: 1200,
  },
  {
    id: "pvp-10",
    title: "FIND_DUPLICATE.JS",
    description: "FIND DUPLICATE NUMBER",
    problem: "Given an array of integers, find any duplicate number.",
    starterCode:
      "function findDuplicate(nums) {\n  // YOUR CODE HERE\n}\n\n// Test: findDuplicate([1,3,4,2,2]) should return 2",
    expectedOutput: "2",
    timeLimit: 180,
    difficulty: "APPRENTICE",
    xpReward: 650,
  },
];

const mockPlayers: Player[] = [
  {
    id: "1",
    username: "NEURAL_HACKER",
    level: 15,
    xp: 12500,
    rank: 1,
    avatar: "🤖",
    status: "coding",
    progress: 75,
  },
  {
    id: "2",
    username: "CODE_NINJA",
    level: 12,
    xp: 9800,
    rank: 2,
    avatar: "🥷",
    status: "coding",
    progress: 60,
  },
  {
    id: "3",
    username: "BYTE_WARRIOR",
    level: 18,
    xp: 15200,
    rank: 3,
    avatar: "⚔️",
    status: "completed",
    progress: 100,
  },
  {
    id: "4",
    username: "CYBER_GHOST",
    level: 10,
    xp: 7500,
    rank: 4,
    avatar: "👻",
    status: "coding",
    progress: 45,
  },
];

const PVPArena: React.FC<PVPArenaProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<"lobby" | "battle" | "results">(
    "lobby"
  );
  const [currentMatch, setCurrentMatch] = useState<PVPMatch | null>(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "console">("preview");
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [currentPlayer] = useState<Player>(mockPlayers[0]);
  const [matchResult, setMatchResult] = useState<{
    position: number;
    xpGained: number;
    timeUsed: number;
    accuracy: number;
  } | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [matchHistory, setMatchHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningBattleId, setJoiningBattleId] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (gameState === "battle" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === "battle") {
      endMatch();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, timeLeft]);

  // Initialize user authentication and load data from Supabase
  useEffect(() => {
    const initializeUser = async () => {
      setLoading(true);

      try {
        // Get authenticated user
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error getting user:", error);
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(user);

        if (user) {
          // Fetch user profile
          const profile = await getUserProfile(user.id);
          setUserProfile(profile);

          // Fetch user's PVP stats
          const stats = await getUserPVPStats(user.id);
          setUserStats(stats);

          // Fetch user's match history
          const history = await getPVPMatchHistory(user.id);
          setMatchHistory(history);
        }

        // Fetch leaderboard (available for all users)
        const leaderboardData = await getPVPLeaderboard(10);
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Error initializing user:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Legacy effect for backward compatibility
  useEffect(() => {
    // Fetch leaderboard from legacy backend
    fetch("http://localhost:8000/leaderboard/")
      .then((res) => res.json())
      .then((data) => {
        // Only use legacy data if Supabase data is not available
        if (leaderboard.length === 0) {
          setLeaderboard(data.leaderboard || []);
        }
      })
      .catch(() => {
        // Fallback handled by Supabase data
      });

    // Fetch user stats from legacy backend if user is available
    if (user && user._id) {
      fetch(`http://localhost:8000/user-stats/${user._id}`)
        .then((res) => res.json())
        .then((data) => {
          // Only use legacy data if Supabase data is not available
          if (!userStats || userStats.totalMatches === 0) {
            setUserStats(data);
          }
        })
        .catch(() => {
          // Fallback handled by Supabase data
        });
    }
  }, [user, leaderboard.length, userStats]);

  const startMatch = async (match: PVPMatch) => {
    setJoiningBattleId(match.id);
    try {
      console.log("[PVP Arena] Starting match with:", match);
      
      // Update fetch call for PVP Arena
      const response = await fetch(
        "http://localhost:8000/techclub/pvp-arena-question/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: match.title,
            description: match.description,
            problem: match.problem,
          }),
        }
      );
      
      console.log("[PVP Arena] Backend response status:", response.status);
      
      if (!response.ok) {
        console.error("[PVP Arena] Backend error:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("[PVP Arena] Error response:", errorText);
        setJoiningBattleId(null);
        return;
      }
      
      const data = await response.json();
      console.log("[PVP Arena] Backend response data:", data);
      
      if (data.question) {
        const timeLimit =
          (data.question && data.question.timeLimit) ||
          match.timeLimit ||
          300; // default to 5 minutes if all else fails
        const generatedMatch = {
          id: `arena-${Date.now()}`,
          title: match.title,
          description: match.description,
          problem: data.question.question || match.problem,
          starterCode: data.question.starterCode || match.starterCode,
          expectedOutput: data.question.expectedOutput || match.expectedOutput,
          timeLimit: timeLimit,
          difficulty: data.question.difficulty || match.difficulty,
          xpReward: data.question.xpReward || match.xpReward,
        };
        
        console.log("[PVP Arena] Generated match:", generatedMatch);
        
        setCurrentMatch(generatedMatch);
        setCode(data.question.starterCode || match.starterCode);
        setTimeLeft(timeLimit);
        setGameState("battle");
        setOutput("");
        setMatchResult(null);
      } else {
        console.error("[PVP Arena] No question data in response");
      }
    } catch (e) {
      console.error("[PVP Arena] Error starting match:", e);
      // fallback: do nothing or show error
    }
    setJoiningBattleId(null);
  };

  const runCode = async () => {
    if (!currentMatch) return;

    setIsRunning(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simple validation for demo
      const isCorrect =
        code.includes("Math.max") ||
        code.includes("return") ||
        code.includes("for");

      if (isCorrect) {
        setOutput(currentMatch.expectedOutput);
        endMatch(true);
      } else {
        setOutput("Incorrect output");
      }
    } catch (error) {
      setOutput("Runtime error");
    }

    setIsRunning(false);
  };

  const endMatch = async (completed = false) => {
    if (!currentMatch) return;

    const timeUsed = currentMatch.timeLimit - timeLeft;
    const position = Math.floor(Math.random() * 4) + 1;
    const baseXP = currentMatch.xpReward;
    const positionMultiplier =
      position === 1 ? 1.5 : position === 2 ? 1.2 : position === 3 ? 1.0 : 0.8;
    const xpGained = Math.floor(baseXP * positionMultiplier);

    setMatchResult({
      position,
      xpGained,
      timeUsed,
      accuracy: completed ? 100 : Math.floor(Math.random() * 60) + 20,
    });

    // Save match result to Supabase if user is authenticated
    if (user) {
      try {
        // Add XP to user's profile
        const newTotalXP = await addUserXP(user.id, xpGained);

        if (newTotalXP && newTotalXP > 0) {
          // Save match result
          const success = await savePVPMatchResult(
            user.id,
            currentMatch.id,
            currentMatch.difficulty,
            xpGained,
            position,
            timeUsed,
            code,
            position === 1
          );

          if (success) {
            toast.success(`Match completed! +${xpGained} XP earned!`);

            // Refresh user stats
            const updatedStats = await getUserPVPStats(user.id);
            setUserStats(updatedStats);

            // Refresh user profile
            const updatedProfile = await getUserProfile(user.id);
            setUserProfile(updatedProfile);
          } else {
            toast.error("Failed to save match result");
          }
        } else {
          toast.error("Failed to award XP");
        }
      } catch (error) {
        console.error("Error saving match result:", error);
        toast.error("An error occurred while saving match result");
      }
    } else {
      // Show local message for non-authenticated users
      toast.success(
        `Match completed! +${xpGained} XP earned! (Sign in to save progress)`
      );
    }

    setGameState("results");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-5 h-5 text-white" />;
      case 2:
        return <Medal className="w-5 h-5 text-white/80" />;
      case 3:
        return <Medal className="w-5 h-5 text-white/60" />;
      default:
        return <Target className="w-5 h-5 text-white/60" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "NOVICE":
        return "border-green-400/30 text-green-400";
      case "APPRENTICE":
        return "border-white/30 text-white";
      case "EXPERT":
        return "border-white/50 text-white";
      case "MASTER":
        return "border-white/70 text-white";
      default:
        return "border-white/30 text-white";
    }
  };

  // Supabase helper functions for PVP Arena
  const getUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("total_xp, level, display_name, avatar_url")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
      return data;
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      return null;
    }
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

  const savePVPMatchResult = async (
    userId: string,
    matchId: string,
    difficulty: string,
    xpEarned: number,
    position: number,
    timeUsed: number,
    codeSubmitted: string,
    isWinner: boolean
  ) => {
    try {
      const { error } = await supabase.from("challenge_completions").insert({
        user_id: userId,
        challenge_id: matchId,
        challenge_type: "pvp_match",
        language_id: "javascript",
        language_name: "JavaScript",
        xp_earned: xpEarned,
        code_submitted: codeSubmitted,
        execution_output: JSON.stringify({
          position,
          timeUsed,
          isWinner,
          difficulty,
        }),
        completed_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error saving PVP match result:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error in savePVPMatchResult:", error);
      return false;
    }
  };

  const getPVPLeaderboard = async (limit: number = 10) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, total_xp, level")
        .order("total_xp", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching PVP leaderboard:", error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error("Error in getPVPLeaderboard:", error);
      return [];
    }
  };

  const getPVPMatchHistory = async (userId: string, limit: number = 5) => {
    try {
      const { data, error } = await supabase
        .from("challenge_completions")
        .select("*")
        .eq("user_id", userId)
        .eq("challenge_type", "pvp_match")
        .order("completed_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching PVP match history:", error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error("Error in getPVPMatchHistory:", error);
      return [];
    }
  };

  const getUserPVPStats = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("challenge_completions")
        .select("*")
        .eq("user_id", userId)
        .eq("challenge_type", "pvp_match");

      if (error) {
        console.error("Error fetching user PVP stats:", error);
        return {
          totalMatches: 0,
          wins: 0,
          totalXP: 0,
          averagePosition: 0,
          bestPosition: 0,
        };
      }

      const matches = data || [];
      const totalMatches = matches.length;
      let wins = 0;
      let totalXP = 0;
      let positionSum = 0;
      let bestPosition = 999;

      matches.forEach((match) => {
        const output = JSON.parse(match.execution_output || "{}");
        const position = output.position || 4;

        if (position === 1) wins++;
        if (position < bestPosition) bestPosition = position;

        totalXP += match.xp_earned || 0;
        positionSum += position;
      });

      return {
        totalMatches,
        wins,
        totalXP,
        averagePosition: totalMatches > 0 ? positionSum / totalMatches : 0,
        bestPosition: bestPosition === 999 ? 0 : bestPosition,
      };
    } catch (error) {
      console.error("Error in getUserPVPStats:", error);
      return {
        totalMatches: 0,
        wins: 0,
        totalXP: 0,
        averagePosition: 0,
        bestPosition: 0,
      };
    }
  };

  if (gameState === "lobby") {
    return (
      <div className="min-h-screen bg-black text-white font-mono">
        <style>{`
          .subtle-glow { text-shadow: 0 0 2px rgba(0, 255, 65, 0.3); }
          .black-glass { background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
          .battle-glow { box-shadow: 0 0 15px rgba(255, 255, 255, 0.2); }
          .loader {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
            display: inline-block;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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
                  <Swords className="w-6 h-6 text-white battle-glow" />
                  <span className="text-white subtle-glow font-bold">
                    PVP_ARENA.EXE
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-white/60" />
                  <span className="text-white/60">{players.length} ONLINE</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-white/60" />
                  <span className="text-white/80">
                    RANK #{currentPlayer.rank}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white subtle-glow mb-2">
              BATTLE ARENA
            </h1>
            <p className="text-white/60">
              COMPETE AGAINST OTHER CODERS IN REAL-TIME
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Available Matches */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-white subtle-glow mb-4">
                ACTIVE BATTLES
              </h2>
              {sampleMatches.map((match) => (
                <div key={match.id} className="black-glass p-6 battle-glow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">
                      {match.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-bold border ${getDifficultyColor(
                        match.difficulty
                      )}`}
                    >
                      {match.difficulty}
                    </span>
                  </div>

                  <p className="text-white/80 mb-4">{match.description}</p>
                  <p className="text-white/60 text-sm mb-4">{match.problem}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-white/60" />
                        <span className="text-white/80">
                          {formatTime(match.timeLimit)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4 text-white/60" />
                        <span className="text-white/80">
                          {match.xpReward} XP
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-white/60" />
                        <span className="text-white/80">
                          {Math.floor(Math.random() * 8) + 2} players
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => startMatch(match)}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all battle-glow"
                      disabled={joiningBattleId === match.id}
                    >
                      {joiningBattleId === match.id ? (
                        <span className="flex items-center"><span className="loader mr-2"></span>Joining...</span>
                      ) : (
                        <>
                      <Swords className="w-4 h-4" />
                      <span>JOIN BATTLE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Global Rankings */}
            <div className="space-y-6">
              <div className="black-glass p-4">
                <h3 className="text-white font-bold mb-4 subtle-glow flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>GLOBAL RANKINGS</span>
                </h3>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-white/60 text-center">
                      Loading leaderboard...
                    </div>
                  ) : leaderboard.length === 0 ? (
                    <div className="text-white/60 text-center">
                      No rankings available.
                    </div>
                  ) : (
                    leaderboard.map((player, index) => (
                      <div
                        key={player.id || index}
                        className="flex items-center justify-between p-2 border border-white/10 bg-white/5"
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`w-6 h-6 flex items-center justify-center text-xs font-bold ${
                              index === 0
                                ? "text-white"
                                : index === 1
                                ? "text-white/80"
                                : index === 2
                                ? "text-white/60"
                                : "text-white/60"
                            }`}
                          >
                            #{index + 1}
                          </span>
                          <div>
                            <div className="text-white text-sm font-bold">
                              {player.display_name ||
                                player.name ||
                                player.username ||
                                "Anonymous"}
                            </div>
                            <div className="text-white/60 text-xs">
                              LVL{" "}
                              {player.level ||
                                Math.floor((player.total_xp || 0) / 1000) + 1}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white/80 text-sm">
                            {(
                              player.total_xp ||
                              player.score ||
                              0
                            ).toLocaleString()}{" "}
                            XP
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Player Stats */}
              <div className="black-glass p-4">
                <h3 className="text-white font-bold mb-4 subtle-glow">
                  YOUR STATS
                </h3>
                {loading ? (
                  <div className="text-white/60 text-center">
                    Loading stats...
                  </div>
                ) : !user ? (
                  <div className="text-white/60 text-center">
                    Sign in to view stats
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">LEVEL:</span>
                      <span className="text-white">
                        {userProfile?.level || 1}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">TOTAL XP:</span>
                      <span className="text-white">
                        {userProfile?.total_xp?.toLocaleString() || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">PVP MATCHES:</span>
                      <span className="text-white">
                        {userStats?.totalMatches || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">WINS:</span>
                      <span className="text-green-400">
                        {userStats?.wins || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">WIN RATE:</span>
                      <span className="text-green-400">
                        {userStats?.totalMatches > 0
                          ? Math.round(
                              (userStats.wins / userStats.totalMatches) * 100
                            ) + "%"
                          : "0%"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">BEST POSITION:</span>
                      <span className="text-white">
                        {userStats?.bestPosition > 0
                          ? `#${userStats.bestPosition}`
                          : "--"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">PVP XP EARNED:</span>
                      <span className="text-white">
                        {userStats?.totalXP || 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "battle" && currentMatch) {
    return (
      <div className="min-h-screen bg-black text-white font-mono">
        <style>{`
          .subtle-glow { text-shadow: 0 0 2px rgba(0, 255, 65, 0.3); }
          .black-glass { background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
          .battle-glow { box-shadow: 0 0 15px rgba(255, 255, 255, 0.2); }
        `}</style>

        {/* Battle Header */}
        <header className="border-b border-white/10 black-glass">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Swords className="w-6 h-6 text-white battle-glow" />
                <span className="text-white subtle-glow font-bold">
                  {currentMatch.title}
                </span>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-white/60" />
                  <span
                    className={`font-mono font-bold ${
                      timeLeft < 30 ? "text-white" : "text-white"
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-white/60" />
                  <span className="text-white/60">
                    {players.length} BATTLING
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-60px)]">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col border-r border-white/10">
            <div className="border-b border-white/10 black-glass p-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">
                  {currentMatch.problem}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className={`flex items-center space-x-1 px-3 py-1 text-xs font-bold transition-all ${
                      isRunning
                        ? "bg-white/10 text-white/40 cursor-not-allowed"
                        : "bg-green-600/20 border border-green-400/30 text-green-400 hover:bg-green-600/30"
                    }`}
                  >
                    {isRunning ? (
                      <Square className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                    <span>{isRunning ? "RUNNING..." : "RUN"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-black/50">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent text-white font-mono text-sm p-4 resize-none outline-none"
                spellCheck={false}
              />
            </div>

            {/* Preview/Console */}
            <div className="border-t border-white/10">
              <div className="flex border-b border-white/10 black-glass">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                    activeTab === "preview"
                      ? "text-white border-b-2 border-green-400"
                      : "text-white/60"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>PREVIEW</span>
                </button>
                <button
                  onClick={() => setActiveTab("console")}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                    activeTab === "console"
                      ? "text-white border-b-2 border-green-400"
                      : "text-white/60"
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>CONSOLE</span>
                </button>
              </div>

              <div className="h-32 bg-black/30 p-4">
                <div className="text-white font-mono text-sm">
                  {output || "NO OUTPUT YET"}
                </div>
              </div>
            </div>
          </div>

          {/* Live Leaderboard */}
          <div className="w-80 bg-black/30 border-l border-white/10">
            <div className="border-b border-white/10 black-glass p-3">
              <h3 className="text-white font-bold subtle-glow">
                LIVE LEADERBOARD
              </h3>
            </div>

            <div className="p-4 space-y-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2 border border-white/10 bg-white/5"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{player.avatar}</span>
                    <div>
                      <div className="text-white text-sm font-bold">
                        {player.username}
                      </div>
                      <div className="text-white/60 text-xs">
                        LVL {player.level}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold ${
                        player.status === "completed"
                          ? "text-green-400"
                          : player.status === "coding"
                          ? "text-white"
                          : "text-white/60"
                      }`}
                    >
                      {player.status === "completed"
                        ? "DONE"
                        : `${player.progress}%`}
                    </div>
                    <div className="w-16 bg-white/10 h-1 mt-1">
                      <div
                        className={`h-1 transition-all ${
                          player.status === "completed"
                            ? "bg-green-400"
                            : "bg-white"
                        }`}
                        style={{ width: `${player.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "results" && matchResult) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <style>{`
          .subtle-glow { text-shadow: 0 0 2px rgba(0, 255, 65, 0.3); }
          .black-glass { background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
          .victory-glow { box-shadow: 0 0 20px rgba(255, 255, 255, 0.3); }
        `}</style>

        <div className="black-glass p-8 max-w-md w-full mx-4 victory-glow">
          <div className="text-center">
            <div className="mb-6">
              {getPositionIcon(matchResult.position)}
              <h2 className="text-2xl font-bold text-white subtle-glow mt-2">
                {matchResult.position === 1
                  ? "VICTORY!"
                  : matchResult.position === 2
                  ? "SECOND PLACE!"
                  : matchResult.position === 3
                  ? "THIRD PLACE!"
                  : "BATTLE COMPLETE!"}
              </h2>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-white/60">POSITION:</span>
                <span className="text-white font-bold">
                  #{matchResult.position}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">XP GAINED:</span>
                <span className="text-white font-bold">
                  +{matchResult.xpGained}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">TIME USED:</span>
                <span className="text-white">
                  {formatTime(matchResult.timeUsed)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">ACCURACY:</span>
                <span className="text-green-400">{matchResult.accuracy}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setGameState("lobby")}
                className="w-full bg-green-600/20 border border-green-400/30 text-green-400 py-2 px-4 hover:bg-green-600/30 transition-all"
              >
                RETURN TO ARENA
              </button>
              <button
                onClick={onBack}
                className="w-full bg-white/10 border border-white/20 text-white/80 py-2 px-4 hover:bg-white/20 transition-all"
              >
                EXIT TO PATHWAYS
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PVPArena;
