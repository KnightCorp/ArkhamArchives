import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Square,
  RotateCcw,
  Terminal,
  Eye,
  Code2,
  ChevronRight,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Zap,
  Target,
} from "lucide-react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import supabase from "../../../../../lib/supabaseClient";
import toast from "react-hot-toast";
import pythonPath from './learning_paths/python.json';
import cppPath from './learning_paths/cpp.json';
import javaPath from './learning_paths/java.json';
import cPath from './learning_paths/c.json';
import jsPath from './learning_paths/javascript.json';

const learningPaths: Record<string, any[]> = {
  python: pythonPath,
  cpp: cppPath,
  java: javaPath,
  c: cPath,
  javascript: jsPath,
};

interface Challenge {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  starterCode: string;
  expectedOutput: string;
  hints: string[];
  difficulty: "NOVICE" | "APPRENTICE" | "EXPERT" | "MASTER";
  xpReward?: number;
}

interface CodingIDEProps {
  pathId: string;
  pathTitle: string;
  onBack: () => void;
  onChallengeComplete?: (
    xpEarned: number,
    totalChallenges: number,
    completedChallenges: number,
    topic?: string,
    completedQuestions?: number
  ) => void;
}

// Add languageId mapping for Judge0
const judge0LanguageIds: Record<string, number> = {
  javascript: 63, // JavaScript (Node.js)
  java: 62,
  cpp: 54,
  c: 50,
  react: 63, // fallback to JS for React
  python: 71, // Python 3
};

// Supabase helper functions for CodingIDE progress tracking
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

const saveUserProgress = async (
  userId: string,
  topic: string,
  languageId: string,
  progressPercentage: number,
  completedQuestions: number[],
  totalQuestions: number,
  xpEarned: number
) => {
  try {
    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: userId,
        topic: topic,
        language_id: languageId,
        progress_percentage: progressPercentage,
        completed_questions: completedQuestions,
        total_questions: totalQuestions,
        xp_earned: xpEarned,
        last_accessed: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,topic,language_id",
      }
    );

    if (error) {
      console.error("Error saving user progress:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in saveUserProgress:", error);
    return false;
  }
};

const markChallengeComplete = async (
  userId: string,
  challengeId: string,
  languageId: string,
  languageName: string,
  xpEarned: number,
  codeSubmitted: string,
  executionOutput: string
) => {
  try {
    const { error } = await supabase.from("challenge_completions").upsert(
      {
        user_id: userId,
        challenge_id: challengeId,
        challenge_type: "learning_pathway",
        language_id: languageId,
        language_name: languageName,
        xp_earned: xpEarned,
        code_submitted: codeSubmitted,
        execution_output: executionOutput,
        completed_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,challenge_id,challenge_type",
      }
    );

    if (error) {
      console.error("Error marking challenge complete:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in markChallengeComplete:", error);
    return false;
  }
};

const getUserProgressByTopic = async (
  userId: string,
  topic: string,
  languageId: string
) => {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("topic", topic)
    .eq("language_id", languageId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "not found"
    console.error("Error fetching user progress:", error);
    return null;
  }
  return data;
};

// Utility functions for localStorage progress
const LOCAL_PROGRESS_KEY = `edtech_techclub_progress`;

function saveProgressToLocal(language: string, completedIds: string[]) {
  localStorage.setItem(`${LOCAL_PROGRESS_KEY}_${language}`, JSON.stringify(completedIds));
}

function loadProgressFromLocal(language: string): string[] {
  const data = localStorage.getItem(`${LOCAL_PROGRESS_KEY}_${language}`);
  return data ? JSON.parse(data) : [];
}

const CodingIDE: React.FC<CodingIDEProps> = ({
  pathId,
  pathTitle,
  onBack,
  onChallengeComplete,
}) => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "console">("preview");
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [terminalHistory, setTerminalHistory] = useState<
    Array<{
      type: "system" | "success" | "error" | "hint" | "output" | "input";
      message: string;
    }>
  >([]);
  
  const [showHints, setShowHints] = useState(false);
  const [challengeStatus, setChallengeStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>(
    []
  );
  const [user, setUser] = useState<any>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Initialize user authentication and load progress from Supabase
  useEffect(() => {
    const initializeUser = async () => {
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
        // Load progress for this topic
        const topic = `pathway_${pathId}`;
        const progress = await getUserProgressByTopic(user.id, topic, pathId);
        if (progress && progress.completed_questions) {
          // Convert question numbers back to challenge IDs
          const completedIds = progress.completed_questions.map(
            (qNum: number) =>
              challenges.length > qNum
                ? challenges[qNum]?.id || `${pathId}-${qNum}`
                : `${pathId}-${qNum}`
          );
          setCompletedChallengeIds(completedIds);
        }
      }
    };

    initializeUser();
  }, [pathId]);

  // Replace the backend fetch useEffect for challenges
  useEffect(() => {
    setIsFetchingNext(true);
    let loadedChallenges: Challenge[] = [];
    if (learningPaths[pathId] && Array.isArray(learningPaths[pathId])) {
      loadedChallenges = learningPaths[pathId].map((ch, idx) => ({
        id: ch.id || `${pathId}-${idx}`,
        title: ch.title || `CHALLENGE_${idx + 1}`,
        description: ch.title || "", // Use title as description if no description
        instructions: [ch.instructions], // JSON has a single string, wrap in array
        starterCode: ch.starterCode || "",
        expectedOutput: ch.expectedOutput || "",
        hints: ch.hint ? [ch.hint] : [],
        difficulty: "NOVICE",
        xpReward: 100,
      }));
    }
    if (loadedChallenges.length === 0) {
      alert("No challenges found in the learning path JSON.");
      setIsFetchingNext(false);
      return;
    }
    setChallenges(loadedChallenges);
    setCurrentChallenge(0);
    setIsFetchingNext(false);
    console.log('Loaded learning path:', loadedChallenges);
  }, [pathId]);

  useEffect(() => {
    // On mount, load completed questions for this language
    const saved = loadProgressFromLocal(pathId);
    setCompletedChallengeIds(saved);
    // Find the first uncompleted question
    if (challenges.length > 0) {
      const nextIndex = challenges.findIndex(ch => !saved.includes(ch.id));
      setCurrentChallenge(nextIndex === -1 ? 0 : nextIndex);
    }
  }, [challenges, pathId]);

  const challenge = challenges[currentChallenge];

  useEffect(() => {
    if (challenge) {
      setTerminalHistory([
        {
          type: "system",
          message: `INITIALIZING ${challenge.title || challenge.description || ""}...`,
        },
        {
          type: "system",
          message: `DIFFICULTY: ${challenge.difficulty || ""}`,
        },
        { type: "system", message: challenge.instructions[0] || "" },
        { type: "system", message: "INSTRUCTIONS LOADED. BEGIN WHEN READY." },
      ]);
      setChallengeStatus("pending");
      setCode(challenge.starterCode || "");
      setOutput("");
    }
  }, [challenge]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  useEffect(() => {
    const handleChallengeSuccess = async () => {
      if (
        challengeStatus === "success" &&
        challenge &&
        !completedChallengeIds.includes(challenge.id) &&
        user
      ) {
        // This is now handled in the runCode function's handleChallengeCompletion call
        // to avoid duplicate processing. The completion logic is centralized.
        console.log("Challenge success already handled in runCode");
      }
    };

    handleChallengeSuccess();
    // eslint-disable-next-line
  }, [challengeStatus, challenge, user]);

  const runCode = async () => {
    if (!challenge) return;
    if (pathId === "react") {
      setTerminalHistory((prev) => [
        ...prev,
        { type: "system", message: "LIVE PREVIEW UPDATED" },
      ]);
      setIsRunning(false);
      return;
    }
    setIsRunning(true);
    setTerminalHistory((prev) => [
      ...prev,
      { type: "system", message: "EXECUTING CODE..." },
    ]);
    
    // Show input in terminal if provided
    if (input && input.trim()) {
      setTerminalHistory((prev) => [
        ...prev,
        { type: "input", message: `INPUT: ${input}` },
      ]);
    }
    
    try {
      const response = await fetch("http://localhost:5050/api/judge0/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: code,
          language_id: judge0LanguageIds[pathId] || 63,
          stdin: input,
        }),
      });
      const data = await response.json();
      console.log("Judge0 response:", data);
      let outputText = "";
      if (data.stdout) {
        outputText = atob(data.stdout);
      } else if (data.stderr) {
        outputText = atob(data.stderr);
      } else if (data.compile_output) {
        outputText = atob(data.compile_output);
      } else {
        outputText = "No output.";
      }
      setOutput(outputText);
      setTerminalHistory((prev) => [
        ...prev,
        { type: "success", message: "CODE EXECUTION COMPLETE" },
        { type: "output", message: outputText },
      ]);

      // Check if the challenge is completed successfully
      if (
        challenge &&
        challenge.expectedOutput &&
        outputText.trim() === challenge.expectedOutput.trim()
      ) {
        setChallengeStatus("success");
        setTerminalHistory((prev) => [
          ...prev,
          { type: "success", message: "CHALLENGE COMPLETED SUCCESSFULLY!" },
        ]);
        
        // Use the comprehensive completion handler
        const xpReward = challenge.xpReward || 100;
        const challengeTitle = challenge.title || challenge.description || "Challenge";
        await handleChallengeCompletion(challenge.id, xpReward, challengeTitle);
      }
    } catch (error) {
      setOutput("Failed to execute code.");
      setTerminalHistory((prev) => [
        ...prev,
        { type: "error", message: "FAILED TO EXECUTE CODE." },
      ]);
    }
    setIsRunning(false);
  };

  const resetCode = () => {
    if (challenge) {
      setCode(challenge.starterCode);
      setOutput("");
      setChallengeStatus("pending");
      setTerminalHistory((prev) => [
        ...prev,
        { type: "system", message: "CODE RESET TO INITIAL STATE" },
      ]);
    }
  };

  const handleNextChallenge = async () => {
    if (challenges.length === 1 && currentChallenge === 0) {
      setIsFetchingNext(true);
      try {
        const response = await fetch(
          "http://localhost:8000/generate-challenges/?type=learning_pathway",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              language: pathId,
              difficulty: "beginner",
              type: "learning_pathway",
            }),
          }
        );
        const data = await response.json();
        let loadedChallenges: Challenge[] = [];
        if (
          data.challenges &&
          Array.isArray(data.challenges) &&
          data.challenges.length > 0
        ) {
          loadedChallenges = data.challenges.map(
            (ch: any, idx: number): Challenge => ({
              id: ch.id || `backend-${idx}`,
              title: ch.title || `CHALLENGE_${idx + 1}`,
              description: ch.description || ch.question || "",
              instructions: Array.isArray(ch.instructions)
                ? ch.instructions
                : [],
              starterCode: ch.starterCode || "",
              expectedOutput: ch.expectedOutput || "",
              hints: ch.hints || (ch.hint ? [ch.hint] : []),
              difficulty:
                ch.difficulty &&
                ["NOVICE", "APPRENTICE", "EXPERT", "MASTER"].includes(
                  ch.difficulty.toUpperCase()
                )
                  ? (ch.difficulty.toUpperCase() as
                      | "NOVICE"
                      | "APPRENTICE"
                      | "EXPERT"
                      | "MASTER")
                  : "NOVICE",
              xpReward: ch.xpReward || 100,
            })
          );
        }
        if (loadedChallenges.length === 0) {
          alert("No dynamic challenges were returned from the backend.");
          setIsFetchingNext(false);
          return;
        }
        setChallenges(loadedChallenges);
        setCurrentChallenge(0);
      } catch (err) {
        alert("Failed to fetch dynamic challenges. See console for details.");
        console.error("Failed to fetch challenges:", err);
      }
      setIsFetchingNext(false);
    } else {
      setCurrentChallenge((prev) => Math.min(challenges.length - 1, prev + 1));
    }
  };

  const handleSaveProgress = () => {
    saveProgressToLocal(pathId, completedChallengeIds);
    // Optionally show a toast or message
    alert('Progress saved!');
  };

  // Enhanced challenge completion handler
  const handleChallengeCompletion = async (
    challengeId: string,
    xpReward: number,
    challengeTitle: string
  ) => {
    if (!user) return;

    try {
      // Award XP immediately
      const newTotalXP = await addUserXP(user.id, xpReward);
      
      if (newTotalXP && newTotalXP > 0) {
        // Show celebratory toast
        toast.success(`🎉 "${challengeTitle}" Completed! +${xpReward} XP earned!`, {
          duration: 4000,
          style: {
            background: '#065f46',
            color: '#fff',
            fontWeight: 'bold',
            border: '1px solid #10b981',
            fontSize: '16px',
          },
        });

        // Mark challenge as complete in Supabase
        await markChallengeComplete(
          user.id,
          challengeId,
          pathId,
          pathTitle,
          xpReward,
          code,
          output
        );

        // Update local progress
        const newCompleted = [...completedChallengeIds, challengeId];
        setCompletedChallengeIds(newCompleted);
        saveProgressToLocal(pathId, newCompleted);

        // Save progress to user_progress table
        const topic = `pathway_${pathId}`;
        const progressPercentage = (newCompleted.length / challenges.length) * 100;
        const completedQuestionNumbers = newCompleted.map((_, idx) => idx);

        await saveUserProgress(
          user.id,
          topic,
          pathId,
          progressPercentage,
          completedQuestionNumbers,
          challenges.length,
          xpReward
        );

        // Show progress update toast
        setTimeout(() => {
          toast.success(`Progress: ${newCompleted.length}/${challenges.length} challenges completed`, {
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#10b981',
              border: '1px solid #10b981',
            },
          });
        }, 2000);

        // Call parent callback if provided
        if (onChallengeComplete) {
          const challengeTopic = `challenge_${challengeId}`;
          const completedQuestions = currentChallenge + 1;
          onChallengeComplete(
            xpReward,
            challenges.length,
            newCompleted.length,
            challengeTopic,
            completedQuestions
          );
        }
      } else {
        toast.error("Failed to award XP. Please try again.");
      }
    } catch (error) {
      console.error("Error completing challenge:", error);
      toast.error("Failed to save progress. Please try again.");
    }
  };

  if (challenges.length > 0 && completedChallengeIds.length >= challenges.length) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
        <p>You've completed all questions in this learning path.</p>
      </div>
    );
  }

  if (!challenge && !isFetchingNext) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <style>{`
        .terminal-cursor::after {
          content: '_';
          animation: blink 1s infinite;
          color: rgba(0, 255, 65, 0.5);
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
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
                <Code2 className="w-5 h-5 text-white" />
                <span className="text-white subtle-glow font-bold">
                  {pathTitle}
                </span>
                <ChevronRight className="w-4 h-4 text-white/40" />
                <span className="text-white/80 text-sm">{challenge ? challenge.title : ""}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-white/60" />
              </div>
              <div
                className={`flex items-center space-x-2 ${
                  challengeStatus === "success"
                    ? "text-green-400"
                    : challengeStatus === "error"
                    ? "text-white"
                    : "text-white/60"
                }`}
              >
                {challengeStatus === "success" && (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                {challengeStatus === "error" && <XCircle className="w-4 h-4" />}
                {challengeStatus === "pending" && <Zap className="w-4 h-4" />}
                <span className="font-bold">
                  {challengeStatus.toUpperCase()}
                </span>
                {/* Save Progress button removed as per request */}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Left Panel - Code Editor & Preview */}
        <div className="flex-1 flex flex-col border-r border-white/10">
          {/* Code Editor Header */}
          <div className="border-b border-white/10 black-glass">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm">CODE_EDITOR.JS</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetCode}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESET</span>
                </button>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className={`flex items-center space-x-1 px-3 py-1 text-xs font-bold transition-all ${
                    isRunning
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-green-600/20 border border-green-400/30 text-green-400 hover:bg-green-600/30 success-glow"
                  }`}
                >
                  {isRunning ? (
                    <Square className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                  <span>{isRunning ? "RUNNING..." : "RUN"}</span>
                </button>
                {challenge && challengeStatus !== "success" && !completedChallengeIds.includes(challenge.id) && output && (
                  <button
                    onClick={async () => {
                      const xpReward = challenge.xpReward || 100;
                      const challengeTitle = challenge.title || challenge.description || "Challenge";
                      await handleChallengeCompletion(challenge.id, xpReward, challengeTitle);
                      setChallengeStatus("success");
                    }}
                    className="flex items-center space-x-1 px-3 py-1 text-xs font-bold bg-blue-600/20 border border-blue-400/30 text-blue-400 hover:bg-blue-600/30 transition-all"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>COMPLETE</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-black/50">
            {isFetchingNext ? (
              <div className="flex flex-col md:flex-row h-full items-center justify-center">
                <svg
                  className="animate-spin h-12 w-12 text-green-400"
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
                <span className="text-white/80 text-lg ml-4">
                  Loading challenge...
                </span>
              </div>
            ) : pathId === "react" ? (
              <div className="flex flex-col md:flex-row h-full">
                {/* Code Editor */}
                <div className="flex-1 min-w-0 border-r border-white/10 p-2">
                  <LiveProvider code={code} noInline>
                    <LiveEditor
                      onChange={setCode}
                      className="w-full h-full bg-black text-white font-mono text-sm p-4 resize-none outline-none border border-white/10 rounded"
                      style={{
                        background: "black",
                        color: "white",
                        fontFamily: "monospace",
                        minHeight: 300,
                      }}
                    />
                  </LiveProvider>
                  <div className="text-xs text-white/50 mt-2">
                    <span className="font-bold">Hint:</span> For live preview,
                    end your code with <code>render(&lt;App /&gt;)</code> or{" "}
                    <code>render(&lt;YourComponent /&gt;)</code>.
                  </div>
                </div>
                {/* Live Preview & Error */}
                <div className="flex-1 min-w-0 p-2 flex flex-col">
                  <div className="text-white/60 text-xs mb-1">
                    LIVE PREVIEW:
                  </div>
                  <div className="bg-white text-black rounded p-4 flex-1 min-h-[120px]">
                    <LiveProvider code={code} noInline>
                      <LivePreview />
                    </LiveProvider>
                  </div>
                  <div className="text-red-400 text-xs mt-2 bg-black/80 p-2 rounded">
                    <LiveProvider code={code} noInline>
                      <LiveError />
                    </LiveProvider>
                  </div>
                </div>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent text-white font-mono text-sm p-4 resize-none outline-none"
                placeholder="// START CODING HERE..."
                spellCheck={false}
              />
            )}
          </div>

          {/* Preview/Console Tabs */}
          <div className="border-t border-white/10">
            <div className="flex border-b border-white/10 black-glass">
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                  activeTab === "preview"
                    ? "text-white border-b-2 border-green-400"
                    : "text-white/60 hover:text-white/80"
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
                    : "text-white/60 hover:text-white/80"
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>CONSOLE</span>
              </button>
            </div>

            <div className="h-32 bg-black/30 p-4">
              {activeTab === "preview" && (
                <div className="h-full">
                  <div className="text-white/60 text-xs mb-2">OUTPUT:</div>
                  <div className="text-white font-mono text-sm">
                    {output || "NO OUTPUT YET"}
                  </div>
                </div>
              )}
              {activeTab === "console" && (
                <div className="h-full flex flex-col">
                  <div className="text-white/60 text-xs mb-2">CONSOLE LOG:</div>
                  <div className="text-white/80 font-mono text-sm flex-1">
                    {output ? `> ${output}` : "> WAITING FOR EXECUTION..."}
                  </div>
                  <div className="mt-2 flex">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter all input for your code here, one per line, before running."
                      className="flex-1 px-2 py-1 text-xs bg-black border border-white/20 text-white rounded resize-y min-h-[32px] max-h-24"
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Instructions & Terminal */}
        <div className="w-96 flex flex-col bg-black/30">
          {/* Instructions Header */}
          <div className="border-b border-white/10 black-glass">
            <div className="px-4 py-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-white subtle-glow font-bold">
                  NEURAL_TERMINAL
                </span>
              </div>
            </div>
          </div>

          {/* Challenge Instructions */}
          <div className="border-b border-white/10 p-4 bg-black/20 min-h-[200px] flex flex-col justify-center items-center">
            {isFetchingNext ? (
              <div className="flex flex-col items-center justify-center h-full w-full">
                <svg
                  className="animate-spin h-6 w-6 text-green-400 mb-2"
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
                <span className="text-white/80 text-sm">
                  Loading challenges...
                </span>
              </div>
            ) : (
              <>
                <h2 className="text-white mb-2 subtle-glow text-lg text-center">
                  {challenge ? challenge.title : ""}
                </h2>
                {/* Instructions Button and Modal */}
                <button
                  className="mb-2 px-2 py-1 text-xs bg-white/10 border border-green-400/30 text-green-400 rounded hover:bg-white/20 transition-all"
                  onClick={() => setShowInstructions(true)}
                  disabled={!challenge}
                >
                  SHOW INSTRUCTIONS
                </button>
                {showInstructions && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                    <div className="bg-black rounded-lg p-8 max-w-3xl w-full border border-white/20">
                      <h4 className="text-white font-bold mb-4 text-lg">
                        Instructions
                      </h4>
                      <div className="space-y-3 mb-6">
                        {challenge ? challenge.instructions.map((instruction, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 text-sm"
                          >
                            <span className="text-green-400 mt-0.5">
                              {index + 1}.
                            </span>
                            <span className="text-white/80 leading-relaxed">{instruction}</span>
                          </div>
                        )) : "Loading instructions..."}
                      </div>
                      <button
                        className="mt-4 px-4 py-2 text-sm bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all"
                        onClick={() => setShowInstructions(false)}
                      >
                        CLOSE
                      </button>
                    </div>
                  </div>
                )}
                <div className="mt-4 flex space-x-2">
                  <button
                    className="px-2 py-1 text-xs bg-black/40 border border-green-400/30 text-green-400 rounded hover:bg-white/20 transition-all"
                    onClick={() => setShowHints(true)}
                    disabled={!challenge}
                  >
                    HINT
                  </button>
                  <button
                    onClick={() =>
                      setCurrentChallenge((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentChallenge === 0}
                    className={`flex items-center space-x-1 px-2 py-1 text-xs border border-white/30 transition-all ${
                      currentChallenge === 0
                        ? "bg-white/5 text-white/30 cursor-not-allowed"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={handleNextChallenge}
                    disabled={isFetchingNext}
                    className={`flex items-center space-x-1 px-2 py-1 text-xs border border-white/30 transition-all ${
                      isFetchingNext
                        ? "bg-white/5 text-white/30 cursor-not-allowed"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {isFetchingNext ? (
                      <svg
                        className="animate-spin h-4 w-4 text-green-400"
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
                    ) : (
                      <span>Next</span>
                    )}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                {showHints && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                    <div className="bg-black rounded-lg p-8 max-w-2xl w-full border border-green-400/30">
                      <div className="mb-6 text-green-400 text-center text-base leading-relaxed">
                        {challenge && challenge.hints && challenge.hints[0]}
                      </div>
                      <button
                        className="mt-4 px-4 py-2 text-sm bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all"
                        onClick={() => setShowHints(false)}
                      >
                        CLOSE
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Terminal Output */}
          <div className="flex-1 overflow-hidden">
            <div
              ref={terminalRef}
              className="h-full overflow-y-auto p-4 space-y-2 text-xs"
            >
              {terminalHistory.map((entry, index) =>
                entry.type === "output" ? (
                  <div
                    key={index}
                    className="text-white font-mono text-sm whitespace-pre-line"
                  >
                    {entry.message}
                  </div>
                ) : (
                  <div
                    key={index}
                    className={`${
                      entry.type === "system"
                        ? "text-white/60"
                        : entry.type === "success"
                        ? "text-green-400"
                        : entry.type === "error"
                        ? "text-red-400"
                        : entry.type === "input"
                        ? "text-white"
                        : entry.type === "hint"
                        ? "text-white/80"
                        : "text-white"
                    }`}
                  >
                    <span className="text-green-400">neural@academy:~$</span>{" "}
                    {entry.message}
                  </div>
                )
              )}
              <div className="text-green-400 terminal-cursor">
                neural@academy:~$
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingIDE;