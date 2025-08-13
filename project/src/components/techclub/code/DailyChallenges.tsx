import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Calendar,
  ArrowLeft,
  Play,
  RotateCcw,
  Lightbulb,
  Trophy,
  Zap,
  Clock
} from 'lucide-react';

// Daily language rotation logic
const SUPPORTED_LANGUAGES = ['PYTHON', 'JAVA', 'C++', 'C', 'JAVASCRIPT'];
const LANGUAGE_ROTATION_DAYS = 5;

const getDailyLanguage = () => {
  const today = new Date();
  const daysSinceEpoch = Math.floor((today.getTime() - new Date(2024, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  const languageIndex = daysSinceEpoch % LANGUAGE_ROTATION_DAYS;
  return SUPPORTED_LANGUAGES[languageIndex];
};

const getDailyChallengeKey = () => {
  const today = new Date();
  return `daily_challenge_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
};

const getTodayKey = () => {
  const today = new Date();
  return `daily_challenges_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
};

const getGlobalXP = () => Number(localStorage.getItem('global_total_xp') || '0');
const setGlobalXP = (xp: number) => localStorage.setItem('global_total_xp', xp.toString());

const getCompletedToday = () => {
  const today = new Date();
  const key = `daily_challenges_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
  const completed = localStorage.getItem(key);
  return completed ? JSON.parse(completed) : false;
};

const setCompletedToday = (completed: boolean) => {
  const today = new Date();
  const key = `daily_challenges_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
  localStorage.setItem(key, JSON.stringify(completed));
};

const fetchDailyChallenges = async () => {
  try {
    // Get today's daily challenge with automatic language rotation
    const response = await fetch('http://localhost:8000/techclub/daily-challenge/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await response.json();
    if (data.challenge) {
      // Set the language from backend response
      setChallengeLanguage(data.language || '');
      // Return as array to match existing structure
      return [data.challenge];
    }
  } catch (e) {
    console.error('Error fetching daily challenge:', e);
  }
  return [];
};

const getLanguageIcon = (language: string) => {
  switch (language.toLowerCase()) {
    case 'python': return '🐍';
    case 'java': return '☕';
    case 'javascript': return '🟨';
    case 'c++': return '🔵';
    case 'c': return '🔵';
    default: return '💻';
  }
};

interface DailyChallenge {
  id: string;
  type: 'debug' | 'theory' | 'code';
  title: string;
  description: string;
  question: string;
  code?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  xpReward: number;
  difficulty: 'NOVICE' | 'APPRENTICE' | 'EXPERT' | 'MASTER';
  timeLimit: number; // in seconds
}

interface DailyChallengesProps {
  onBack: () => void;
}

const DailyChallenges: React.FC<DailyChallengesProps> = ({ onBack }) => {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCompleteMsg, setShowCompleteMsg] = useState(false);
  const [submittedChallenges, setSubmittedChallenges] = useState<string[]>([]);
  const [completedToday, setCompletedToday] = useState(false);
  const [challengeLanguage, setChallengeLanguage] = useState('');

  const challenge = challenges[currentChallenge];
  const todayLanguage = challengeLanguage || getDailyLanguage();

  useEffect(() => {
    setLoading(true);
    setCompletedToday(getCompletedToday());
    
    fetchDailyChallenges().then((challs) => {
      setChallenges(challs);
      setLoading(false);
    });
    
    // Reset progress for today if not completed
    if (!getCompletedToday()) {
      setCompletedChallenges([]);
      setTotalXP(0);
      const today = new Date();
      const key = `daily_challenges_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
      localStorage.setItem(key, JSON.stringify({ completed: [], totalXP: 0 }));
    }
  }, []);

  useEffect(() => {
    if (
      challenges.length > 0 &&
      completedChallenges.length === challenges.length &&
      !showCompleteMsg &&
      !completedToday
    ) {
      // Show the complete message after 2 seconds
      const timer = setTimeout(() => setShowCompleteMsg(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [completedChallenges, challenges, showCompleteMsg, completedToday]);

  useEffect(() => {
    if (challenge) {
      setUserAnswer(challenge.code || '');
      setSelectedOption(null);
      setShowResult(false);
      setIsCorrect(false);
    }
  }, [challenge]);

  const startChallenge = () => {
    setIsActive(true);
  };

  const handleSubmit = () => {
    setIsActive(false);
    let correct = false;

    if (challenge.type === 'theory' && challenge.options) {
      correct = selectedOption === challenge.correctAnswer;
    } else {
      const userCode = userAnswer.trim().replace(/\s+/g, ' ');
      const correctCode = challenge.correctAnswer.toString().trim().replace(/\s+/g, ' ');
      correct = userCode.includes(correctCode) || userCode === correctCode;
    }

    setIsCorrect(correct);
    setShowResult(true);

    if (correct && !completedChallenges.includes(challenge.id)) {
      const newCompleted = [...completedChallenges, challenge.id];
      const newXP = totalXP + challenge.xpReward;
      setCompletedChallenges(newCompleted);
      setTotalXP(newXP);
      
      // Save to localStorage for today
      const today = new Date();
      const key = `daily_challenges_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
      localStorage.setItem(key, JSON.stringify({ completed: newCompleted, totalXP: newXP }));

      // Update global XP
      const globalXP = getGlobalXP() + challenge.xpReward;
      setGlobalXP(globalXP);

      // Mark as completed today if all challenges are done
      if (newCompleted.length === challenges.length) {
        setCompletedToday(true);
        setCompletedToday(true);
      }
    }

    if (!submittedChallenges.includes(challenge.id)) {
      setSubmittedChallenges([...submittedChallenges, challenge.id]);
    }
  };

  const resetChallenge = () => {
    setUserAnswer(challenge.code || '');
    setSelectedOption(null);
    setIsActive(false);
    setShowResult(false);
  };

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'NOVICE': return 'border-green-400/30 text-green-400';
      case 'APPRENTICE': return 'border-white/30 text-white';
      case 'EXPERT': return 'border-white/50 text-white';
      case 'MASTER': return 'border-white/70 text-white';
      default: return 'border-white/30 text-white';
    }
  };

  // Show completion message
  if (showCompleteMsg && completedChallenges.length === challenges.length && challenges.length > 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-6">
          <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
          <div className="text-center space-y-2">
            <h2 className="text-3xl text-white font-bold">Daily Challenge Completed!</h2>
            <p className="text-white/60">You've completed today's {todayLanguage} challenge. Come back tomorrow for a new challenge!</p>
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

  // Show already completed message
  if (completedToday && !showCompleteMsg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-6">
          <CheckCircle2 className="w-16 h-16 text-green-400" />
          <div className="text-center space-y-2">
            <h2 className="text-3xl text-white font-bold">Daily Challenge Completed!</h2>
            <p className="text-white/60">You've already completed today's challenge. Come back tomorrow!</p>
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

  if (submittedChallenges.length === challenges.length && challenges.length > 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <Trophy className="w-16 h-16 mb-4" style={{ color: '#C0C0C0' }} />
          <div className="text-white/80 text-3xl font-bold text-center drop-shadow-lg" style={{ letterSpacing: '1px' }}>
            You've completed all daily challenges for today!<br />
            <span className="text-white/60 text-xl font-semibold">We'll meet again tomorrow for new challenges.</span>
          </div>
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
                <span className="text-white subtle-glow font-bold">DAILY_CHALLENGES.EXE</span>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-white/60" />
                <span className="text-white/60">DAY {new Date().getDate()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-white/60" />
                <span className="text-white/80">XP: {totalXP.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-white/60" />
                <span className="text-white/60">{completedChallenges.length}/{challenges.length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Language Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="text-4xl">{getLanguageIcon(todayLanguage)}</span>
            <h1 className="text-3xl font-bold text-white subtle-glow">{todayLanguage} CHALLENGE</h1>
            <span className="text-4xl">{getLanguageIcon(todayLanguage)}</span>
          </div>
          <p className="text-white/60 text-sm">DAILY CHALLENGES TO SHARPEN YOUR NEURAL PATHWAYS</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-40">
            <svg className="animate-spin h-8 w-8 text-green-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-white/80 text-lg">Loading daily challenges...</span>
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center text-white/80 text-lg mt-12">No daily challenges available today.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Challenge Card */}
            <div className="lg:col-span-2">
              <div className="black-glass p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-bold text-white subtle-glow">{challenge.title}</h2>
                    <span className={`px-2 py-1 text-xs font-bold border ${getDifficultyColor(challenge.difficulty)}`}>{challenge.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-white/60" />
                      <span className="text-white/80">{challenge.xpReward} XP</span>
                    </div>
                  </div>
                </div>
                <p className="text-white/80 mb-4">{challenge.description}</p>
                <p className="text-white mb-6">{challenge.question}</p>
                {/* Code Editor for Debug/Code Challenges */}
                {(challenge.type === 'debug' || challenge.type === 'code') && (
                  <div className="mb-6">
                    <div className="border border-white/20 bg-black/50">
                      <div className="border-b border-white/10 px-3 py-2 bg-white/5">
                        <span className="text-white/60 text-sm">CODE_EDITOR.JS</span>
                      </div>
                      <textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-full h-64 bg-transparent text-white font-mono text-sm p-4 resize-none outline-none"
                        disabled={!isActive && !showResult}
                        spellCheck={false}
                      />
                    </div>
                  </div>
                )}
                {/* Multiple Choice for Theory */}
                {challenge.type === 'theory' && challenge.options && (
                  <div className="mb-6 space-y-3">
                    {challenge.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedOption(index)}
                        disabled={!isActive}
                        className={`w-full text-left p-3 border transition-all ${
                          selectedOption === index
                            ? 'border-green-400/50 bg-green-400/10 text-white'
                            : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40'
                        } ${!isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className="text-green-400 mr-3">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </button>
                    ))}
                  </div>
                )}
                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {!isActive && !showResult && (
                    <button
                      onClick={startChallenge}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 border border-green-400/30 text-green-400 hover:bg-green-600/30 transition-all success-glow"
                    >
                      <Play className="w-4 h-4" />
                      <span>START CHALLENGE</span>
                    </button>
                  )}
                  {isActive && (
                    <>
                      <button
                        onClick={handleSubmit}
                        className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>SUBMIT</span>
                      </button>
                      <button
                        onClick={resetChallenge}
                        className="flex items-center space-x-2 px-3 py-2 bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition-all"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>RESET</span>
                      </button>
                    </>
                  )}
                  {showResult && currentChallenge < challenges.length - 1 && (
                    <button
                      onClick={nextChallenge}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>NEXT CHALLENGE</span>
                    </button>
                  )}
                </div>
                {/* Result Display */}
                {showResult && (
                  <div className={`mt-6 p-4 border ${
                    isCorrect 
                      ? 'border-green-400/30 bg-green-400/10 success-glow' 
                      : 'border-white/30 bg-white/10 error-glow'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-white" />
                      )}
                      <span className={`font-bold ${isCorrect ? 'text-green-400' : 'text-white'}`}>{isCorrect ? 'CORRECT!' : 'INCORRECT'}</span>
                      {isCorrect && (
                        <span className="text-white/60">+{challenge.xpReward} XP</span>
                      )}
                    </div>
                    <p className="text-white/80 text-sm">{challenge.explanation}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-6">
              {/* Progress Panel */}
              <div className="black-glass p-4">
                <h3 className="text-white font-bold mb-4 subtle-glow">TODAY'S PROGRESS</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">COMPLETED:</span>
                    <span className="text-white">{completedChallenges.length}/{challenges.length}</span>
                  </div>
                  <div className="w-full bg-white/10 h-2">
                    <div 
                      className="bg-green-400 h-2 transition-all duration-500"
                      style={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">XP EARNED:</span>
                    <span className="text-white font-bold">{totalXP}</span>
                  </div>
                </div>
              </div>
              {/* Challenge List */}
              <div className="black-glass p-4">
                <h3 className="text-white font-bold mb-4 subtle-glow">CHALLENGE LIST</h3>
                <div className="space-y-2">
                  {challenges.map((ch, index) => (
                    <div
                      key={ch.id}
                      className={`flex items-center justify-between p-2 border cursor-pointer transition-all ${
                        index === currentChallenge
                          ? 'border-green-400/50 bg-green-400/10'
                          : completedChallenges.includes(ch.id)
                          ? 'border-white/30 bg-white/5'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                      onClick={() => setCurrentChallenge(index)}
                    >
                      <div className="flex items-center space-x-2">
                        {completedChallenges.includes(ch.id) ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <HelpCircle className="w-4 h-4 text-white/40" />
                        )}
                        <span className="text-white/80 text-sm">{ch.title}</span>
                      </div>
                      <span className="text-white/60 text-xs">{ch.xpReward} XP</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Hint System */}
              <div className="black-glass p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-white/60" />
                  <h3 className="text-white font-bold subtle-glow">NEURAL HINT</h3>
                </div>
                <p className="text-white/60 text-sm">
                  {challenge.type === 'debug' && "Look for syntax errors like missing brackets, semicolons, or parentheses."}
                  {challenge.type === 'theory' && "Think about the fundamental concepts and how they apply to this scenario."}
                  {challenge.type === 'code' && "Break down the problem into smaller steps and consider built-in array methods."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyChallenges;