import React, { useState, useEffect, useRef } from "react";
import { Timer, CheckCircle, XCircle, Play, Users, Brain } from "lucide-react";
import {
  examService,
  FileInfo,
  Question,
} from "../../../../services/examService";
import { rankingService } from "../../../../services/rankingService";
import toast from "react-hot-toast";
import { supabase } from "../../../../lib/supabaseClient";
import { useAuth } from "../../../../context/AuthContext";

const QUESTION_COUNT = 5;
const QUESTION_TIME = 30;
const AI_ACCURACY = 0.7;
const AI_MIN_DELAY = 2000;
const AI_MAX_DELAY = 5000;

export const ExamArena = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [aiAnswer, setAiAnswer] = useState<number | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30);
  const [arenaStarted, setArenaStarted] = useState(false);
  const [arenaFinished, setArenaFinished] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const timerRef = useRef<number | null>(null);
  const aiTimeoutRef = useRef<number | null>(null);
  const scoreUpdatedRef = useRef<boolean>(false); // Use ref instead of state for immediate updates
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [aiAnswers, setAiAnswers] = useState<(number | null)[]>([]);
  const [userAnswered, setUserAnswered] = useState(false);
  const [aiAnswered, setAiAnswered] = useState(false);
  const [checkingAnswer, setCheckingAnswer] = useState(false);
  const [userCheckedResults, setUserCheckedResults] = useState<
    (boolean | null)[]
  >([]);
  const [aiCheckedResults, setAiCheckedResults] = useState<(boolean | null)[]>(
    []
  );
  const [showArenaSummary, setShowArenaSummary] = useState(false);
  const [aiCorrectIndices, setAiCorrectIndices] = useState<number[]>([]);
  const [userResults, setUserResults] = useState<(boolean | null)[]>([]);
  const [aiResults, setAiResults] = useState<(boolean | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState<string | null>(
    null
  );
  const [currentCorrectIndex, setCurrentCorrectIndex] = useState<number | null>(
    null
  );
  const [arenaComplete, setArenaComplete] = useState(false);
  const [userScoreFinal, setUserScoreFinal] = useState(0);
  const [aiScoreFinal, setAiScoreFinal] = useState(0);
  const [questionCount, setQuestionCount] = useState<number>(2); // Default to 2 questions for arena
  const [selectedFile, setSelectedFile] = useState<string>(""); // Track which file was selected
  const [totalTimeUsed, setTotalTimeUsed] = useState(0); // Track total time used across all questions
  // Real-time arena tracking state
  const [arenaTrackingActive, setArenaTrackingActive] = useState(false);
  const [arenaStartTime, setArenaStartTime] = useState<Date | null>(null);
  const [currentArenaTimeSpent, setCurrentArenaTimeSpent] = useState(0);

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const files = await examService.getFiles();
        setUploadedFiles(files);
      } catch (error) {
        toast.error("Failed to fetch uploaded files");
      }
    };
    fetchUploadedFiles();
  }, []);

  const startArena = async () => {
    console.log(
      "[startArena] Starting arena with user:",
      user ? "User available" : "No user"
    );
    if (!uploadedFiles || uploadedFiles.length === 0) {
      toast.error("Please upload some study materials first");
      return;
    }
    setArenaFinished(false);
    setUserScore(0);
    setAiScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAiAnswer(null);
    setAiThinking(false);
    setQuestionTimeLeft(30);
    setTotalTimeUsed(0);
    setArenaComplete(false);
    scoreUpdatedRef.current = false; // Reset score update flag
    setUserAnswers([]);
    setAiAnswers([]);
    setUserAnswered(false);
    setAiAnswered(false);
    setLoading(true);
    try {
      // Use the arena endpoint that selects from all uploaded files
      const response = await fetch(
        "http://localhost:8000/generate-arena-questions/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question_count: questionCount,
            prompt: `Generate ${questionCount} challenging questions from the selected study material. The questions should be comprehensive and test understanding of the content.`,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const qs = data.questions || [];
        setSelectedFile(data.selected_file || ""); // Store the selected file name

        if (!qs || qs.length === 0) {
          toast.error("No questions available.");
          setLoading(false);
          return;
        }
        setQuestions(qs);
        setArenaStarted(true);
        // Enforce AI accuracy: preselect which questions AI will get right (70%)
        const numCorrect = Math.round(qs.length * AI_ACCURACY); // Remove Math.max(3, ...) to get exact 70%
        const indices = Array.from({ length: qs.length }, (_, i) => i);
        const shuffled = indices.sort(() => Math.random() - 0.5);
        setAiCorrectIndices(shuffled.slice(0, numCorrect));
        console.log(
          `[startArena] AI will get ${numCorrect} out of ${
            qs.length
          } questions correct (${AI_ACCURACY * 100}% accuracy)`
        );
      } else {
        toast.error("Failed to generate questions");
      }
    } catch (e) {
      toast.error("Failed to fetch questions.");
    }
    setLoading(false);
  };

  // Add timer state and logic
  useEffect(() => {
    if (!arenaStarted || arenaComplete) return;
    setQuestionTimeLeft(30);
    if (showExplanation || selectedAnswer !== null) return; // Pause timer when explanation is shown or answer is selected
    const interval = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [
    arenaStarted,
    currentQuestion,
    showExplanation,
    arenaComplete,
    selectedAnswer,
  ]);

  // Timer to update displayed time spent in arena
  useEffect(() => {
    if (!arenaStartTime || !arenaStarted) return;

    const timer = setInterval(() => {
      const now = new Date();
      const timeSpentSeconds = Math.floor(
        (now.getTime() - arenaStartTime.getTime()) / 1000
      );
      setCurrentArenaTimeSpent(Math.max(60, timeSpentSeconds)); // Minimum 1 minute
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, [arenaStartTime, arenaStarted]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // On answer select, have AI answer as well
  const handleAnswer = async (index: number) => {
    console.log(
      "[handleAnswer] Called with index:",
      index,
      "arenaComplete:",
      arenaComplete,
      "selectedAnswer:",
      selectedAnswer
    );

    if (arenaComplete || selectedAnswer !== null) return;

    // Calculate time used for this question (30 - remaining time)
    const timeUsedForQuestion = 30 - questionTimeLeft;
    setTotalTimeUsed((prev) => prev + timeUsedForQuestion);

    setSelectedAnswer(index);
    const q = questions[currentQuestion];

    // User check - use local checking instead of backend service
    const userRes = isAnswerCorrect(q, index);
    console.log("[handleAnswer] User answer check:", {
      index,
      userRes,
      correctAnswer: q.correctAnswer,
      selectedOption: q.options[index],
    });

    setUserAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestion] = index;
      return updated;
    });
    setUserResults((prev) => {
      const updated = [...prev];
      updated[currentQuestion] = userRes;
      return updated;
    });

    // AI answer
    let aiIdx: number;
    const correctIdx = getCorrectAnswerIndex(q);
    const aiShouldBeCorrect = aiCorrectIndices.includes(currentQuestion);
    if (aiShouldBeCorrect && correctIdx !== -1) {
      aiIdx = correctIdx;
    } else {
      // Pick a random wrong answer
      const wrongOptions = q.options
        .map((_, idx) => idx)
        .filter((idx) => idx !== correctIdx);
      aiIdx =
        wrongOptions.length > 0
          ? wrongOptions[Math.floor(Math.random() * wrongOptions.length)]
          : 0;
    }
    setAiAnswer(aiIdx);
    setAiAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestion] = aiIdx;
      return updated;
    });
    setAiThinking(true);
    // AI thinking delay
    const delay = Math.random() * (AI_MAX_DELAY - AI_MIN_DELAY) + AI_MIN_DELAY;
    aiTimeoutRef.current = window.setTimeout(() => {
      setAiThinking(false);
      setAiAnswered(true);
      // Check AI answer
      const aiRes = aiShouldBeCorrect;
      console.log("[handleAnswer] AI answer check:", {
        aiIdx,
        aiShouldBeCorrect,
        aiRes,
        correctAnswer: q.correctAnswer,
        aiSelectedOption: q.options[aiIdx],
        currentQuestion,
        aiCorrectIndices,
      });
      setAiResults((prev) => {
        const updated = [...prev];
        updated[currentQuestion] = aiRes;
        return updated;
      });
      // Update scores
      if (userRes) {
        setUserScore((prev) => prev + 100);
        console.log("[handleAnswer] User score updated:", userRes);
      }
      if (aiRes) {
        setAiScore((prev) => prev + 100);
        console.log("[handleAnswer] AI score updated:", aiRes);
      }
      console.log(
        "[handleAnswer] Final scores - User:",
        userRes ? "correct (+100)" : "incorrect",
        "AI:",
        aiRes ? "correct (+100)" : "incorrect"
      );
      console.log("[handleAnswer] Setting showResult to true");
      setShowResult(true);
      setCurrentCorrectIndex(correctIdx);
      setCurrentExplanation(q.explanation || "No explanation available.");
    }, delay);
  };

  const handleTimeout = () => {
    if (selectedAnswer === null) {
      console.log("[handleTimeout] Timeout occurred, no answer selected");
      // Add full 30 seconds to total time used when timeout occurs
      setTotalTimeUsed((prev) => prev + 30);

      // Handle timeout as incorrect answer
      setSelectedAnswer(-1);
      const q = questions[currentQuestion];
      const userRes = false; // Timeout = incorrect

      setUserAnswers((prev) => {
        const updated = [...prev];
        updated[currentQuestion] = -1;
        return updated;
      });
      setUserResults((prev) => {
        const updated = [...prev];
        updated[currentQuestion] = userRes;
        return updated;
      });

      // AI answer for timeout case
      let aiIdx: number;
      const correctIdx = getCorrectAnswerIndex(q);
      const aiShouldBeCorrect = aiCorrectIndices.includes(currentQuestion);
      if (aiShouldBeCorrect && correctIdx !== -1) {
        aiIdx = correctIdx;
      } else {
        const wrongOptions = q.options
          .map((_, idx) => idx)
          .filter((idx) => idx !== correctIdx);
        aiIdx =
          wrongOptions.length > 0
            ? wrongOptions[Math.floor(Math.random() * wrongOptions.length)]
            : 0;
      }

      setAiAnswer(aiIdx);
      setAiAnswers((prev) => {
        const updated = [...prev];
        updated[currentQuestion] = aiIdx;
        return updated;
      });

      setAiThinking(true);
      const delay =
        Math.random() * (AI_MAX_DELAY - AI_MIN_DELAY) + AI_MIN_DELAY;
      aiTimeoutRef.current = window.setTimeout(() => {
        setAiThinking(false);
        setAiAnswered(true);
        const aiRes = aiShouldBeCorrect;
        console.log("[handleTimeout] AI answer check:", {
          aiIdx,
          aiShouldBeCorrect,
          aiRes,
          correctAnswer: q.correctAnswer,
          aiSelectedOption: q.options[aiIdx],
          currentQuestion,
          aiCorrectIndices,
        });
        setAiResults((prev) => {
          const updated = [...prev];
          updated[currentQuestion] = aiRes;
          return updated;
        });

        if (aiRes) {
          setAiScore((prev) => prev + 100);
          console.log("[handleTimeout] AI score updated:", aiRes);
        }
        console.log(
          "[handleTimeout] Final scores - User: incorrect (timeout)",
          "AI:",
          aiRes ? "correct (+100)" : "incorrect"
        );
        setShowResult(true);
        setCurrentCorrectIndex(correctIdx);
        setCurrentExplanation(q.explanation || "No explanation available.");
      }, delay);
    }
  };

  const handleNext = async () => {
    console.log(
      "[handleNext] Called with currentQuestion:",
      currentQuestion,
      "questions.length:",
      questions.length
    );

    if (currentQuestion < questions.length - 1) {
      console.log("[handleNext] Moving to next question");
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setAiAnswer(null);
      setAiThinking(false);
      setUserAnswered(false);
      setAiAnswered(false);
      setShowExplanation(false);
      setCurrentExplanation(null);
      setCurrentCorrectIndex(null);
    } else {
      console.log("[handleNext] Finishing arena - calling updateRankingScore");
      // Arena finished - show immediate results
      setArenaComplete(true);
      setUserScoreFinal(userScore);
      setAiScoreFinal(aiScore);

      // Show immediate XP toast
      const timeUsed = Math.max(60, totalTimeUsed || 60); // Minimum 1 minute
      const xpEarned = Math.floor(timeUsed / 60) * 5 + questions.length * 10;
      toast.success(
        `Arena completed! +${userScore || 0} points + ${xpEarned} XP earned!`
      );

      // IMMEDIATELY update session completion for external records
      console.log("[handleNext] Attempting to update session completion:", {
        hasUser: !!user,
        hasArenaStartTime: !!arenaStartTime,
        userId: user?.id,
      });

      if (user && arenaStartTime) {
        console.log("[handleNext] Updating session completion immediately");
        try {
          const correctAnswers = userResults.filter((r) => r === true).length;
          const accuracy =
            questions.length > 0 ? correctAnswers / questions.length : 0;

          await supabase.from("study_sessions").upsert(
            {
              user_id: user.id,
              session_type: "arena",
              start_time: arenaStartTime.toISOString(),
              last_update: new Date().toISOString(),
              time_spent: timeUsed,
              questions_asked: questions.length,
              status: "completed",
              metadata: {
                component: "ExamArena",
                activity_type: "arena_match",
                total_questions: questions.length,
                correct_answers: correctAnswers,
                user_score: userScore || 0,
                accuracy: accuracy,
                arena_completed: true,
                xp_earned: xpEarned,
              },
            },
            {
              onConflict: "user_id,session_type,start_time",
            }
          );
          console.log("[handleNext] Session completion updated successfully");
        } catch (error) {
          console.error(
            "[handleNext] Error updating session completion:",
            error
          );
        }
      } else {
        console.log(
          "[handleNext] Cannot update session - missing user or start time"
        );
        // Try to create a new session entry for external records
        if (user) {
          try {
            const correctAnswers = userResults.filter((r) => r === true).length;
            const accuracy =
              questions.length > 0 ? correctAnswers / questions.length : 0;

            await supabase.from("study_sessions").insert({
              user_id: user.id,
              session_type: "arena",
              start_time: new Date().toISOString(),
              last_update: new Date().toISOString(),
              time_spent: timeUsed,
              questions_asked: questions.length,
              status: "completed",
              metadata: {
                component: "ExamArena",
                activity_type: "arena_match",
                total_questions: questions.length,
                correct_answers: correctAnswers,
                user_score: userScore || 0,
                accuracy: accuracy,
                arena_completed: true,
                xp_earned: xpEarned,
              },
            });
            console.log(
              "[handleNext] New session entry created for external records"
            );
          } catch (error) {
            console.error(
              "[handleNext] Error creating new session entry:",
              error
            );
          }
        }
      }

      // Update ranking system
      scoreUpdatedRef.current = true; // Set flag to prevent timer from also calling updateRankingScore
      updateRankingScore();
      console.log("[handleNext] Setting showArenaSummary to true");
      setShowArenaSummary(true);
    }
  };

  const updateRankingScore = async () => {
    console.log(
      "[updateRankingScore] Called with scoreUpdated:",
      scoreUpdatedRef.current,
      "arenaComplete:",
      arenaComplete
    );

    if (scoreUpdatedRef.current) {
      console.log("[updateRankingScore] Score already updated, skipping...");
      return;
    }

    try {
      console.log("[updateRankingScore] Starting score update...");
      scoreUpdatedRef.current = true; // Set flag to prevent multiple calls

      // Calculate final stats
      const totalQuestions = questions.length;
      const correctAnswers = userResults.filter((r) => r === true).length;
      const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
      const timeUsed = Math.max(1, totalTimeUsed || 0); // Ensure minimum 1 second
      const scoreGained = Math.max(0, userScore || 0); // Ensure non-negative score

      console.log("[updateRankingScore] Stats:", {
        totalQuestions,
        correctAnswers,
        accuracy,
        timeUsed,
        scoreGained,
        totalTimeUsed,
      });

      // Update ranking system
      await rankingService.updateScore(
        "countdown_arena",
        scoreGained,
        accuracy,
        timeUsed,
        totalQuestions,
        correctAnswers
      );

      console.log("[updateRankingScore] Score update completed successfully");
      toast.success(
        `Arena completed! +${scoreGained} points earned (${Math.floor(
          timeUsed / 60
        )}m ${timeUsed % 60}s)`
      );

      // Also award XP for the arena completion
      console.log(
        "[updateRankingScore] Checking user for XP:",
        user ? "User found" : "No user"
      );
      if (user) {
        const xpEarned = Math.floor(timeUsed / 60) * 5 + totalQuestions * 10; // 5 XP per minute + 10 XP per question
        console.log("[updateRankingScore] Awarding XP:", xpEarned);
        toast.success(`Bonus: +${xpEarned} XP earned!`);
      } else {
        console.log("[updateRankingScore] No user found, cannot award XP");
        // Still show XP calculation even without user
        const xpEarned = Math.floor(timeUsed / 60) * 5 + totalQuestions * 10;
        toast.success(`Bonus: +${xpEarned} XP earned!`);
      }

      // Mark arena session as completed in real-time tracking
      console.log("[updateRankingScore] Updating session completion:", {
        user: !!user,
        arenaStartTime: !!arenaStartTime,
      });
      if (user && arenaStartTime) {
        try {
          await supabase.from("study_sessions").upsert(
            {
              user_id: user.id,
              session_type: "arena",
              start_time: arenaStartTime.toISOString(),
              last_update: new Date().toISOString(),
              time_spent: timeUsed,
              questions_asked: totalQuestions,
              status: "completed",
              metadata: {
                component: "ExamArena",
                activity_type: "arena_match",
                total_questions: totalQuestions,
                correct_answers: correctAnswers,
                user_score: scoreGained,
                accuracy: accuracy,
                arena_completed: true,
                xp_earned: Math.floor(timeUsed / 60) * 5 + totalQuestions * 10,
              },
            },
            {
              onConflict: "user_id,session_type,start_time",
            }
          );
        } catch (error) {
          console.error("Error updating arena session:", error);
        }
      }
    } catch (error) {
      console.error("Error updating ranking score:", error);
      toast.error("Failed to update ranking score");
      scoreUpdatedRef.current = false; // Reset flag on error so user can try again
    }
  };

  const restartArena = () => {
    setArenaStarted(false);
    setArenaFinished(false);
    setArenaComplete(false);
    setShowArenaSummary(false);
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setUserScore(0);
    setAiScore(0);
    setAiAnswer(null);
    setAiThinking(false);
    setQuestionTimeLeft(30);
    setTotalTimeUsed(0);
    scoreUpdatedRef.current = false; // Reset score update flag
    setUserAnswers([]);
    setAiAnswers([]);
    setUserAnswered(false);
    setAiAnswered(false);
    setUserResults([]);
    setAiResults([]);
    setShowExplanation(false);
    setCurrentExplanation(null);
    setCurrentCorrectIndex(null);
    setSelectedFile("");
  };

  // Auto-track arena matches in real-time
  useEffect(() => {
    if (!arenaTrackingActive || !user || !arenaStartTime) return;

    const interval = setInterval(async () => {
      const now = new Date();
      const timeSpentSeconds = Math.floor(
        (now.getTime() - arenaStartTime.getTime()) / 1000
      );
      const timeSpent = Math.max(60, timeSpentSeconds); // Minimum 1 minute (60 seconds)

      try {
        await supabase.from("study_sessions").upsert(
          {
            user_id: user.id,
            session_type: "arena",
            start_time: arenaStartTime.toISOString(),
            last_update: now.toISOString(),
            time_spent: timeSpent,
            questions_asked: currentQuestion + 1,
            status: arenaComplete ? "completed" : "active",
            metadata: {
              component: "ExamArena",
              activity_type: "arena_match",
              current_question: currentQuestion + 1,
              total_questions: questions.length,
              user_score: userScore,
              ai_score: aiScore,
              selected_file: selectedFile,
              match_type: "competitive",
            },
          },
          {
            onConflict: "user_id,session_type,start_time",
          }
        );
      } catch (error) {
        console.error("Error tracking arena activity:", error);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [
    arenaTrackingActive,
    user,
    arenaStartTime,
    currentQuestion,
    questions.length,
    userScore,
    aiScore,
    selectedFile,
    arenaComplete,
  ]);

  // Start tracking when arena match begins
  useEffect(() => {
    if (arenaStarted && user && !arenaTrackingActive) {
      setArenaTrackingActive(true);
      setArenaStartTime(new Date());
    } else if (!arenaStarted || arenaComplete) {
      setArenaTrackingActive(false);
    }
  }, [arenaStarted, user, arenaComplete, arenaTrackingActive]);

  function getActualCorrectAnswer(question: Question) {
    return question.correctAnswer;
  }

  function isAnswerCorrect(question: Question, answerIndex: number | null) {
    if (answerIndex === null || answerIndex === -1) return false;
    return question.options[answerIndex] === question.correctAnswer;
  }

  function getCorrectAnswerIndex(q: Question) {
    return q.options.findIndex((option) => option === q.correctAnswer);
  }

  function getOptionLetter(idx: number) {
    return String.fromCharCode(65 + idx);
  }

  // Arena Setup - Only show when arena not started
  if (!arenaStarted) {
    return (
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl text-matrix font-code mb-4">
              Countdown Arena
            </h3>
            <p className="text-matrix/70 font-code mb-6">
              Challenge yourself with questions from all your uploaded study
              materials!
            </p>
          </div>

          {/* Question Count Selector */}
          <div className="bg-black/50 border border-matrix/30 rounded-lg p-6">
            <h4 className="text-matrix font-code mb-4 text-center">
              Number of Questions
            </h4>
            <div className="flex justify-center space-x-4">
              {[2, 5, 10].map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`px-6 py-3 rounded-lg font-code transition-all ${
                    questionCount === count
                      ? "bg-matrix text-black"
                      : "bg-black/30 text-matrix border border-matrix/30 hover:bg-matrix/10"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Arena Info */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-black/50 border border-matrix/30 rounded-lg p-6 text-center">
              <Brain className="w-8 h-8 text-matrix/60 mx-auto mb-3" />
              <div className="text-matrix font-code">Mixed Topics</div>
              <div className="text-matrix/60 font-code text-sm">
                All Subjects
              </div>
            </div>
            <div className="bg-black/50 border border-matrix/30 rounded-lg p-6 text-center">
              <Timer className="w-8 h-8 text-matrix/60 mx-auto mb-3" />
              <div className="text-matrix font-code">30s per Question</div>
              <div className="text-matrix/60 font-code text-sm">Time Limit</div>
            </div>
            <div className="bg-black/50 border border-matrix/30 rounded-lg p-6 text-center">
              <Users className="w-8 h-8 text-matrix/60 mx-auto mb-3" />
              <div className="text-matrix font-code">AI Opponent</div>
              <div className="text-matrix/60 font-code text-sm">
                Competitive
              </div>
            </div>
          </div>

          {/* Start Arena Button */}
          <button
            onClick={startArena}
            disabled={loading}
            className="w-full px-6 py-4 bg-matrix text-matrix border border-matrix rounded-lg hover:bg-matrix/90 transition-all font-code disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-matrix"></div>
                <span className="text-matrix">Generating Questions...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span className="text-matrix">Enter Countdown Arena</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Arena Interface
  if (arenaStarted && questions.length > 0) {
    return (
      <div className="space-y-8">
        {/* Selected File Info */}
        {selectedFile && (
          <div className="bg-black/50 border border-matrix/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-matrix/70 font-code">
              <span>📄 Selected Material:</span>
              <span className="text-matrix font-code">{selectedFile}</span>
            </div>
          </div>
        )}

        {/* Match Info */}
        <div className="bg-black/50 border border-matrix/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-matrix font-code">
                <Users className="w-5 h-5" />
                <span>You vs AI</span>
              </div>
              <div className="flex items-center space-x-2 text-matrix font-code">
                <Timer className="w-5 h-5" />
                <span
                  className={
                    questionTimeLeft <= 60 ? "text-red-400 animate-pulse" : ""
                  }
                >
                  {Math.floor(questionTimeLeft / 60)}:
                  {(questionTimeLeft % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-matrix font-code">
              <span>You: {userScore}</span>
              <span>AI: {aiScore}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-lg font-bold text-matrix font-code">
                {formatTime(currentArenaTimeSpent)}
              </div>
              <div className="text-sm text-matrix/70 font-code">Time Spent</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-matrix font-code">
                {Math.floor(currentArenaTimeSpent / 60) * 5 +
                  (currentQuestion + 1) * 10}
              </div>
              <div className="text-sm text-matrix/70 font-code">
                Potential XP
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-matrix/70 font-code">
                Arena Active
              </span>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-black/50 border border-matrix/30 rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-matrix/60 font-code">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-matrix font-code">
              {Math.floor(questionTimeLeft / 60)}:
              {(questionTimeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>

          <h3 className="text-matrix font-code text-lg mb-8 leading-relaxed">
            {questions[currentQuestion]?.question}
          </h3>

          {/* Options */}
          <div className="space-y-4">
            {questions[currentQuestion]?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null || arenaComplete}
                className={`w-full p-4 text-left rounded-lg font-code transition-all ${
                  selectedAnswer === index
                    ? "bg-matrix text-black"
                    : "bg-black/30 text-matrix border border-matrix/30 hover:bg-matrix/10"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="mr-3 text-matrix/60">
                  {getOptionLetter(index)}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* AI Thinking Indicator */}
        {aiThinking && (
          <div className="bg-black/50 border border-matrix/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-matrix font-code">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-matrix"></div>
              <span>AI is thinking...</span>
            </div>
          </div>
        )}

        {/* Results */}
        {showResult && (
          <div className="bg-black/50 border border-matrix/30 rounded-lg p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="text-center">
                <h4 className="text-matrix font-code mb-2">Your Answer</h4>
                <div
                  className={`p-3 rounded-lg ${
                    userResults[currentQuestion]
                      ? "bg-green-500/20 border border-green-500/30"
                      : "bg-red-500/20 border border-red-500/30"
                  }`}
                >
                  <span className="text-matrix font-code">
                    {userAnswers[currentQuestion] !== null &&
                    userAnswers[currentQuestion] !== -1
                      ? getOptionLetter(userAnswers[currentQuestion]!)
                      : "No Answer"}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-matrix font-code mb-2">AI Answer</h4>
                <div
                  className={`p-3 rounded-lg ${
                    aiResults[currentQuestion]
                      ? "bg-green-500/20 border border-green-500/30"
                      : "bg-red-500/20 border border-red-500/30"
                  }`}
                >
                  <span className="text-matrix font-code">
                    {aiAnswers[currentQuestion] !== null
                      ? getOptionLetter(aiAnswers[currentQuestion]!)
                      : "Thinking..."}
                  </span>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="mb-6">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-matrix font-code hover:text-matrix/70 transition-colors"
              >
                {showExplanation ? "Hide" : "Show"} Explanation
              </button>
              {showExplanation && (
                <div className="mt-3 p-4 bg-black/30 border border-matrix/20 rounded-lg">
                  <p className="text-matrix/80 font-code">
                    {currentExplanation}
                  </p>
                </div>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => {
                console.log("[Finish Button] Clicked!");
                handleNext();
              }}
              className="w-full px-6 py-3 bg-matrix text-matrix border border-matrix rounded-lg hover:bg-matrix/90 transition-all font-code"
            >
              {currentQuestion < questions.length - 1
                ? "Next Question"
                : "Finish Arena"}
            </button>
          </div>
        )}

        {/* Arena Summary */}
        {showArenaSummary && (
          <div className="bg-black/50 border border-matrix/30 rounded-lg p-8">
            <h3 className="text-2xl text-matrix font-code mb-6 text-center">
              Arena Complete!
            </h3>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <h4 className="text-matrix font-code mb-4">Your Score</h4>
                <div className="text-3xl text-matrix font-code">
                  {userScoreFinal}
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-matrix font-code mb-4">AI Score</h4>
                <div className="text-3xl text-matrix font-code">
                  {aiScoreFinal}
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h4 className="text-xl text-matrix font-code mb-2">
                {userScoreFinal > aiScoreFinal
                  ? "🎉 You Won!"
                  : userScoreFinal < aiScoreFinal
                  ? "🤖 AI Wins!"
                  : "🤝 It's a Tie!"}
              </h4>
            </div>

            <button
              onClick={restartArena}
              className="w-full px-6 py-4 bg-matrix text-black border border-matrix rounded-lg hover:bg-matrix/90 transition-all font-code"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
};
