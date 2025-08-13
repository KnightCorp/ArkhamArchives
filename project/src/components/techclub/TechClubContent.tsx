import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Brain,
  Code,
  Zap,
  Trophy,
  Target,
  CheckCircle2,
  HelpCircle,
  Flame,
  Terminal,
  GitBranch,
  Medal,
} from "lucide-react";
import CodingIDE from "./code/CodingIDE";
import DailyChallenges from "./code/DailyChallenges";
import PVPArena from "./code/PVPArena";
import OpensourceCompetitions from "./code/OpensourceCompetitions";
import useProgressStore from "../../../src/store/useProgressStore";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  riddle: string;
  difficulty: "NOVICE" | "APPRENTICE" | "EXPERT" | "MASTER";
  totalXP: number;
  currentXP: number;
  level: number;
  totalLevels: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  icon: React.ReactNode;
  prerequisites?: string[];
  imageUrl: string;
}

const initialLearningPaths: LearningPath[] = [
  {
    id: "javascript",
    title: "JAVASCRIPT.EXE",
    description: "MASTER THE LANGUAGE OF THE WEB",
    riddle: "I RUN EVERYWHERE YET COMPILE NOWHERE. WHAT AM I?",
    difficulty: "NOVICE",
    totalXP: 0,
    currentXP: 0,
    level: 0,
    totalLevels: 10,
    isUnlocked: true,
    isCompleted: false,
    icon: <Code className="w-5 h-5" />,
    imageUrl:
      "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "react",
    title: "REACT.JSX",
    description: "BUILD DYNAMIC USER INTERFACES",
    riddle: "I MAKE THE STATIC DYNAMIC, THE COMPLEX SIMPLE. WHAT AM I?",
    difficulty: "APPRENTICE",
    totalXP: 0,
    currentXP: 0,
    level: 0,
    totalLevels: 12,
    isUnlocked: true,
    isCompleted: false,
    icon: <Zap className="w-5 h-5" />,
    prerequisites: ["javascript"],
    imageUrl:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "python",
    title: "PYTHON.PY",
    description: "FROM DATA TO AI, I SLITHER THROUGH ALL",
    riddle: "NAMED AFTER COMEDY, USED FOR SERIOUS WORK. WHAT AM I?",
    difficulty: "NOVICE",
    totalXP: 0,
    currentXP: 0,
    level: 0,
    totalLevels: 10,
    isUnlocked: true,
    isCompleted: false,
    icon: <Brain className="w-5 h-5" />,
    imageUrl:
      "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "java",
    title: "JAVA.JAVA",
    description: "WRITE ONCE, RUN ANYWHERE",
    riddle: "I RUN ONCE, RUN ANYWHERE. WHAT AM I?",
    difficulty: "APPRENTICE",
    totalXP: 0,
    currentXP: 0,
    level: 0,
    totalLevels: 12,
    isUnlocked: true,
    isCompleted: false,
    icon: <Flame className="w-5 h-5" />,
    imageUrl:
      "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "cpp",
    title: "C++.CPP",
    description: "THE POWER OF OBJECT-ORIENTED SYSTEMS",
    riddle: "I AM C WITH CLASSES. WHAT AM I?",
    difficulty: "EXPERT",
    totalXP: 0,
    currentXP: 0,
    level: 0,
    totalLevels: 15,
    isUnlocked: true,
    isCompleted: false,
    icon: <Trophy className="w-5 h-5" />,
    imageUrl:
      "https://images.pexels.com/photos/1181277/pexels-photo-1181277.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "c",
    title: "C.C",
    description: "THE FOUNDATION OF MODERN PROGRAMMING",
    riddle: "I AM THE MOTHER OF ALL LANGUAGES. WHAT AM I?",
    difficulty: "NOVICE",
    totalXP: 0,
    currentXP: 0,
    level: 0,
    totalLevels: 10,
    isUnlocked: true,
    isCompleted: false,
    icon: <Target className="w-5 h-5" />,
    imageUrl:
      "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

function TechClubContent() {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeView, setActiveView] = useState<
    "pathways" | "ide" | "daily" | "pvp" | "opensource" | "interview"
  >("pathways");
  const [currentPathId, setCurrentPathId] = useState<string>("");
  const { user } = useAuth();

  // Get global progress and XP/level methods
  const progress = useProgressStore((state) => state.progress);
  const addXP = useProgressStore((state) => state.addXP);
  const updateProgress = useProgressStore((state) => state.updateProgress);
  const globalTotalXP = useProgressStore((state) => state.totalXP);
  const getXPForNextLevel = useProgressStore((state) => state.getXPForNextLevel);
  const initializeUserProgress = useProgressStore((state) => state.initializeUserProgress);
  const saveChallengeCompletion = useProgressStore((state) => state.saveChallengeCompletion);
  const isLoading = useProgressStore((state) => state.isLoading);

  useEffect(() => {
    if (user?.id) {
      initializeUserProgress(user.id);
    }
  }, [user?.id, initializeUserProgress]);

  // For the list of languages, use the initialLearningPaths as the base
  const learningPaths = initialLearningPaths.map((path) => {
    const langProgress = progress[path.id] || {};
    // Aggregate XP and level from all topics for this language
    let currentXP = 0;
    let totalQuestions = 0;
    let completedQuestions = 0;
    Object.values(langProgress).forEach((lesson: any) => {
      if (lesson && Array.isArray(lesson.completedQuestions)) {
        const qCount = lesson.completedQuestions.length;
        currentXP += qCount * 100; // 100 XP per question solved
        totalQuestions += 10; // Assume 10 questions per topic (customize as needed)
        completedQuestions += qCount;
      }
    });
    // Robust level calculation using store logic
    let level = 0;
    let xpForLevel = currentXP;
    let xpToNextLevel = getXPForNextLevel(level);
    while (xpForLevel >= xpToNextLevel) {
      xpForLevel -= xpToNextLevel;
      level += 1;
      xpToNextLevel = getXPForNextLevel(level);
    }
    const totalXP = totalQuestions * 100;
    const isCompleted =
      totalQuestions > 0 && completedQuestions === totalQuestions;
    return {
      ...path,
      currentXP,
      level,
      totalXP: totalXP || 1000, // fallback if no topics
      isCompleted,
      xpToNextLevel,
      xpForLevel,
    };
  });

  const completedPaths = learningPaths.filter(
    (path) => path.isCompleted
  ).length;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getProgressPercentage = (path: LearningPath) => {
    return (path.currentXP / path.totalXP) * 100;
  };

  const getLevelProgress = (path: LearningPath) => {
    const xpPerLevel = path.totalXP / path.totalLevels;
    const currentLevelXP = path.currentXP % xpPerLevel;
    return (currentLevelXP / xpPerLevel) * 100;
  };

  const handleInitializeLearning = (pathId: string) => {
    setCurrentPathId(pathId);
    setActiveView("ide");
    setSelectedPath(null);
  };

  const handleBackToPathways = () => {
    setActiveView("pathways");
    setCurrentPathId("");
  };

  // Update XP and progress globally when a challenge is completed
  const updatePathProgress = async (
    pathId: string,
    xpEarned: number,
    challengeCount: number,
    challengesCompleted: number,
    topic?: string,
    completedQuestions?: number[]
  ) => {
    if (topic && completedQuestions) {
      updateProgress(
        pathId,
        topic,
        (challengesCompleted / challengeCount) * 100,
        completedQuestions
      );
    }
    
    if (xpEarned && xpEarned > 0) {
      addXP(xpEarned);
      // Save challenge completion to Supabase
      if (user?.id) {
        const challengeId = `${pathId}-${topic || 'challenge'}-${Date.now()}`;
        await saveChallengeCompletion(user.id, challengeId, pathId, xpEarned);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-white/60">LOADING NEURAL PATHWAYS...</p>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    if (activeView === "ide") {
      const path = learningPaths.find((p) => p.id === currentPathId);
      return (
        <CodingIDE
          pathId={currentPathId}
          pathTitle={path?.title || "UNKNOWN PATH"}
          onBack={handleBackToPathways}
          onChallengeComplete={(xp, total, completed) =>
            updatePathProgress(currentPathId, xp, total, completed)
          }
        />
      );
    }

    if (activeView === "daily") {
      return <DailyChallenges onBack={handleBackToPathways} />;
    }

    if (activeView === "pvp") {
      return <PVPArena onBack={handleBackToPathways} />;
    }

    if (activeView === "opensource") {
      return <OpensourceCompetitions onBack={handleBackToPathways} />;
    }

    if (activeView === "interview") {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
          <Medal className="w-16 h-16 mb-4" style={{ color: "#C0C0C0" }} />
          <h2 className="text-2xl font-bold text-white mb-2">
            INTERVIEW PREPARATION
          </h2>
          <p className="text-lg text-white/70">Coming Soon</p>
        </div>
      );
    }

    // Pathways view content - ADD THE MISSING PATHWAY CARDS HERE
    return (
      <>
        {/* Terminal Prompt */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-white/80 text-sm mb-6">
            <div>
              <span className="text-white subtle-glow">
                root@neural-academy:~$
              </span>{" "}
              ls -la <span className="text-green-400">learning_pathways</span>/
            </div>
            <div className="mt-2 text-xs opacity-60">
              INITIALIZING <span className="text-green-400">NEURAL</span>{" "}
              PATHWAYS... [████████████████████████████████] 100%
            </div>
          </div>
        </div>

        {/* Main Content - Cards with full image backgrounds */}
        <main className="max-w-7xl mx-auto px-6 pb-8">
          <div className="grid grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                className={`relative overflow-hidden border border-white/20 hover:border-white/40 transition-all cursor-pointer h-[400px] group ${
                  !path.isUnlocked ? "opacity-50" : ""
                }`}
                style={{
                  backgroundImage: `url(${path.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "grayscale(100%) contrast(1.2) brightness(0.7)",
                }}
                onClick={() => path.isUnlocked && setSelectedPath(path)}
              >
                {/* Lighter overlay with gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 group-hover:from-black/85 group-hover:via-black/65 group-hover:to-black/45 transition-all duration-300" />

                {/* Glass effect overlay */}
                <div className="absolute inset-0 backdrop-blur-[0.5px] bg-black/20" />

                <div className="relative z-10 p-5 h-full flex flex-col">
                  {/* Header with Icon and Title */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-white drop-shadow-lg">{path.icon}</div>
                    <h3 className="text-white text-base font-bold tracking-wide drop-shadow-lg">
                      {path.title}
                    </h3>
                    {path.isCompleted && (
                      <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto drop-shadow-lg" />
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-white text-sm mb-4 leading-relaxed drop-shadow-lg">
                    {path.description}
                  </p>

                  {/* Riddle Box */}
                  <div className="border border-green-400/60 bg-black/60 backdrop-blur-sm p-3 mb-5 flex-grow">
                    <div className="text-green-400 text-[10px] font-bold tracking-wider mb-1">
                      RIDDLE:
                    </div>
                    <div className="text-green-300 text-xs leading-relaxed font-mono">
                      {path.riddle}
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="space-y-3 mt-auto">
                    {/* Difficulty and Level */}
                    <div className="flex justify-between">
                      <div>
                        <div className="text-green-400 text-[10px] font-bold tracking-wider mb-1 drop-shadow-lg">
                          DIFFICULTY:
                        </div>
                        <div className="text-white text-sm font-bold drop-shadow-lg">
                          {path.difficulty}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 text-[10px] font-bold tracking-wider mb-1 drop-shadow-lg">
                          LEVEL:
                        </div>
                        <div className="text-white text-sm font-bold drop-shadow-lg">
                          {path.level}/{path.totalLevels}
                        </div>
                      </div>
                    </div>

                    {/* XP Progress */}
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-green-400 text-[10px] font-bold tracking-wider drop-shadow-lg">
                          XP:
                        </span>
                        <span className="text-white text-xs drop-shadow-lg">
                          {path.currentXP.toLocaleString()}/
                          {path.totalXP.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-black/40 backdrop-blur-sm h-1.5 border border-white/30">
                        <div
                          className="h-full bg-white transition-all duration-300 shadow-lg"
                          style={{
                            width: `${getProgressPercentage(path)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Level Progress */}
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-green-400 text-[10px] font-bold tracking-wider drop-shadow-lg">
                          LVL {path.level}:
                        </span>
                        <span className="text-white text-xs drop-shadow-lg">
                          {Math.round(getLevelProgress(path))}%
                        </span>
                      </div>
                      <div className="w-full bg-black/40 backdrop-blur-sm h-1.5 border border-white/30">
                        <div
                          className="h-full bg-white transition-all duration-300 shadow-lg"
                          style={{
                            width: `${getLevelProgress(path)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Prerequisites */}
                    {path.prerequisites && (
                      <div className="pt-2 border-t border-white/20">
                        <div className="text-green-400 text-[10px] font-bold tracking-wider mb-1 drop-shadow-lg">
                          REQUIRES:
                        </div>
                        <div className="text-white text-xs font-mono drop-shadow-lg">
                          {path.prerequisites
                            .map((req) => req.toUpperCase())
                            .join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Subtle Matrix Rain Effect */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='15' font-family='monospace' font-size='12' fill='%23ffffff' text-anchor='middle'%3E?%3C/text%3E%3C/svg%3E")`,
            backgroundSize: "20px 20px",
            animation: "matrix-rain 25s linear infinite",
          }}
        />
      </div>
      <style>{`
              @keyframes matrix-rain {
                0% {
                  transform: translateY(-100vh);
                }
                100% {
                  transform: translateY(100vh);
                }
              }
              .subtle-glow {
                text-shadow: 0 0 2px rgba(0, 255, 65, 0.3);
              }
              .white-glow {
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.1),
                  inset 0 0 10px rgba(255, 255, 255, 0.05);
              }
              .white-glow-strong {
                box-shadow: 0 0 15px rgba(255, 255, 255, 0.2),
                  inset 0 0 15px rgba(255, 255, 255, 0.1);
              }
              .black-glass {
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
              }
              .terminal-cursor::after {
                content: "_";
                animation: blink 1s infinite;
                color: rgba(0, 255, 65, 0.5);
              }
              @keyframes blink {
                0%,
                50% {
                  opacity: 1;
                }
                51%,
                100% {
                  opacity: 0;
                }
              }
              .card-image {
                filter: grayscale(100%) contrast(1.2) brightness(0.8);
                opacity: 0.6;
              }
              .question-glow {
                box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
              }
              .battle-glow {
                box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
              }
              .opensource-glow {
                box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
              }
            `}</style>
      <div className="relative z-10">
        {/* Terminal Header */}
        <header className="border-b border-white/10 black-glass">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-6 h-6 text-white" />
                  <span className="text-white subtle-glow text-xl font-bold">
                    NEURAL_ACADEMY.<span className="text-green-400">EXE</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-8 text-sm">
                <div className="text-white/80">
                  <span>
                    SYSTEM_<span className="text-green-400">TIME</span>: {currentTime.toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-white/80">
                  <span>
                    TOTAL_<span className="text-green-400">XP</span>: {globalTotalXP.toLocaleString()}
                  </span>
                </div>
                <div className="text-white/80">
                  <span>
                    <span className="text-green-400">COMPLETED</span>: {completedPaths}/{learningPaths.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* Navigation Menu - Now outside conditional rendering */}
        <div className="border-b border-white/10 black-glass">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveView("pathways")}
                className={`flex items-center space-x-2 px-4 py-3 text-sm transition-colors border-b-2 ${
                  activeView === "pathways"
                    ? "text-white border-green-400"
                    : "text-white/60 border-transparent hover:text-white/80"
                }`}
              >
                <Code className="w-4 h-4" />
                <span>LEARNING_PATHWAYS</span>
              </button>
              <button
                onClick={() => setActiveView("daily")}
                className={`flex items-center space-x-2 px-4 py-3 text-sm transition-colors border-b-2 ${
                  activeView === "daily"
                    ? "text-white border-green-400"
                    : "text-white/60 border-transparent hover:text-white/80"
                }`}
              >
                <HelpCircle className="w-4 h-4 question-glow" />
                <span>DAILY_CHALLENGES</span>
              </button>
              <button
                onClick={() => setActiveView("pvp")}
                className={`flex items-center space-x-2 px-4 py-3 text-sm transition-colors border-b-2 ${
                  activeView === "pvp"
                    ? "text-white border-green-400"
                    : "text-white/60 border-transparent hover:text-white/80"
                }`}
              >
                <Trophy className="w-4 h-4 battle-glow" />
                <span>PVP_ARENA</span>
              </button>
              <button
                onClick={() => setActiveView("opensource")}
                className={`flex items-center space-x-2 px-4 py-3 text-sm transition-colors border-b-2 ${
                  activeView === "opensource"
                    ? "text-white border-green-400"
                    : "text-white/60 border-transparent hover:text-white/80"
                }`}
              >
                <GitBranch className="w-4 h-4 opensource-glow" />
                <span>OPENSOURCE_COMPETITIONS</span>
              </button>
              <button
                onClick={() => setActiveView("interview")}
                className={`flex items-center space-x-2 px-4 py-3 text-sm transition-colors border-b-2 ${
                  activeView === "interview"
                    ? "text-white border-gray-400"
                    : "text-white/60 border-transparent hover:text-white/80"
                }`}
              >
                <Medal className="w-4 h-4" style={{ color: "#C0C0C0" }} />
                <span>INTERVIEW_PREPARATION</span>
              </button>
            </div>
          </div>
        </div>
        {/* Render the active view */}
        {renderActiveView()}
      </div>
      {/* Terminal Modal */}
      {selectedPath && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0, 0, 0, 0.9)" }}
        >
          <div className="black-glass max-w-md w-full white-glow-strong overflow-hidden">
            {/* Modal Background Image */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${selectedPath.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "grayscale(100%) contrast(1.2) brightness(0.5)",
              }}
            />
            <div className="absolute inset-0 bg-black/75" />
            <div className="relative z-10">
              <div className="border-b border-white/10 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm subtle-glow">
                    PATHWAY_DETAILS.
                    <span className="text-green-400">EXE</span>
                  </span>
                  <button
                    onClick={() => setSelectedPath(null)}
                    className="text-white/80 hover:text-white text-lg"
                  >
                    [<span className="text-green-400">X</span>]
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold mb-2 subtle-glow">
                  {selectedPath.title}
                </h3>
                <p className="text-white/80 text-sm mb-3">
                  {selectedPath.description}
                </p>
                <div className="black-glass border border-white/10 p-2 mb-4">
                  <div className="text-white/80 text-xs">
                    <span className="text-white">
                      <span className="text-green-400">RIDDLE</span>:
                    </span>{" "}
                    {selectedPath.riddle}
                  </div>
                </div>
                <button
                  className="w-full black-glass border border-white/20 text-white font-bold py-2 px-4 hover:white-glow transition-all subtle-glow"
                  onClick={() => handleInitializeLearning(selectedPath.id)}
                >
                  [<span className="text-green-400">INITIALIZE</span>
                  _LEARNING_SEQUENCE]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TechClubContent;