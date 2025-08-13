import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Clock, BookOpen } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct_answer?: string;
  answer?: string;
  explanation?: string;
}

interface StudentQuizInterfaceProps {
  quiz: any;
  onComplete: (answers: string[], score: number) => void;
  onClose: () => void;
  studentId?: string;
  studentName?: string;
  classId?: string;
}

// Helper function to extract MCQ array from quiz field
function extractMCQArray(quizField: any): any[] | null {
  console.log('DEBUG: StudentQuizInterface - Extracting MCQ from:', quizField);
  
  if (!quizField) {
    console.log('DEBUG: No quiz field provided');
    return null;
  }

  // If it's already an array, return it
  if (Array.isArray(quizField)) {
    console.log('DEBUG: Quiz field is already an array');
    return quizField;
  }

  // If it's a string, try to parse it
  if (typeof quizField === 'string') {
    try {
      const parsed = JSON.parse(quizField);
      console.log('DEBUG: Parsed string to:', parsed);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // If it's an object with a quiz property
      if (parsed && typeof parsed === 'object' && parsed.quiz) {
        if (Array.isArray(parsed.quiz)) {
          return parsed.quiz;
        }
      }
    } catch (e) {
      console.log('DEBUG: Failed to parse string:', e);
    }
  }

  // If it's an object, check for quiz property
  if (quizField && typeof quizField === 'object') {
    if (quizField.quiz) {
      console.log('DEBUG: Found quiz property:', quizField.quiz);
      if (Array.isArray(quizField.quiz)) {
        return quizField.quiz;
      }
    }
    // If the object itself looks like a question array
    if (Array.isArray(quizField)) {
      return quizField;
    }
  }

  console.log('DEBUG: No valid MCQ array found');
  return null;
}

export const StudentQuizInterface: React.FC<StudentQuizInterfaceProps> = ({
  quiz,
  onComplete,
  onClose,
  studentId = "student_1",
  studentName = "Student",
  classId = "class_1"
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes default
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [savingResult, setSavingResult] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [autoSubmitCountdown, setAutoSubmitCountdown] = useState(0);
  const [startTime, setStartTime] = useState<Date>(new Date());

  // Parse quiz questions using the helper function
  const questions: Question[] = extractMCQArray(quiz.quiz) || [];
  console.log('DEBUG: StudentQuizInterface - Parsed questions:', questions);

  // Auto-submit when all questions are answered
  useEffect(() => {
    const answeredCount = answers.filter(a => a).length;
    const totalQuestions = questions.length;
    
    console.log('DEBUG: Auto-submit check:', {
      answeredCount,
      totalQuestions,
      currentQuestionIndex,
      isSubmitted
    });
    
    // Auto-submit when all questions are answered and we're on the last question
    if (answeredCount === totalQuestions && 
        currentQuestionIndex === totalQuestions - 1 && 
        !isSubmitted && 
        !showResults) {
      console.log('DEBUG: Auto-submitting quiz - all questions answered');
      
      // Start countdown for auto-submit
      setAutoSubmitCountdown(3);
      const countdown = setInterval(() => {
        setAutoSubmitCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdown);
    } else {
      setAutoSubmitCountdown(0);
    }
  }, [answers, currentQuestionIndex, questions.length, isSubmitted, showResults]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
    
    console.log('DEBUG: Answer selected:', {
      questionIndex: currentQuestionIndex,
      answer,
      totalAnswered: newAnswers.filter(a => a).length,
      totalQuestions: questions.length
    });
    
    // Auto-advance to next question if not the last one
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 500);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const saveQuizResult = async (finalScore: number) => {
    setSavingResult(true);
    try {
      const endTime = new Date();
      const timeTaken = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      
      const resultData = {
        quiz_id: quiz.id,
        student_id: studentId,
        student_name: studentName,
        class_id: classId,
        answers: answers,
        score: finalScore,
        time_taken: timeTaken
      };

      const response = await fetch('http://localhost:8000/lms/quiz/result/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultData),
      });

      if (!response.ok) {
        throw new Error('Failed to save quiz result');
      }

      const result = await response.json();
      console.log('Quiz result saved:', result);
    } catch (error) {
      console.error('Error saving quiz result:', error);
      // Don't throw error to user, just log it
    } finally {
      setSavingResult(false);
    }
  };

  const handleSubmit = async () => {
    console.log('DEBUG: Submitting quiz with answers:', answers);
    console.log('DEBUG: Questions:', questions);
    
    setIsSubmitted(true);
    setShowResults(true);
    
    // Calculate score
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      const correctAnswer = question.correct_answer || question.answer;
      console.log(`DEBUG: Question ${index + 1}:`, {
        question: question.question,
        userAnswer: answers[index],
        correctAnswer: correctAnswer,
        isCorrect: answers[index] === correctAnswer
      });
      if (answers[index] === correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    console.log('DEBUG: Final score:', finalScore, `(${correctAnswers}/${questions.length} correct)`);
    setScore(finalScore);
    
    // Save result to backend
    await saveQuizResult(finalScore);
    
    onComplete(answers, finalScore);
  };

  const getQuestionStatus = (index: number) => {
    if (answers[index]) {
      return 'answered';
    }
    return 'unanswered';
  };

  const getQuestionStatusColor = (status: string) => {
    switch (status) {
      case 'answered':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Questions Available</h2>
            <p className="text-gray-400 mb-4">This quiz doesn't contain any valid questions.</p>
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-black border border-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-black border-b border-white p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white">Quiz: {quiz.fileName}</h2>
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-white mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-white rounded-full h-2">
              <div 
                className="bg-black h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="bg-black border-b border-white p-4 flex-shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-white text-black'
                    : getQuestionStatus(index) === 'answered'
                    ? 'bg-white text-black'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {getQuestionStatus(index) === 'answered' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {!showResults ? (
            <div>
              {/* Question */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium">
                    Question {currentQuestionIndex + 1}
                  </span>
                </div>
                <h3 className="text-lg text-white mb-4">
                  {questions[currentQuestionIndex].question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentQuestionIndex].options?.map((option: string, optionIndex: number) => (
                  <label
                    key={optionIndex}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-white/5 ${
                      answers[currentQuestionIndex] === option
                        ? 'border-white bg-white/10'
                        : 'border-white/30 hover:border-white/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={option}
                      checked={answers[currentQuestionIndex] === option}
                      onChange={() => handleAnswerSelect(option)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestionIndex] === option
                        ? 'border-white bg-white'
                        : 'border-white/50'
                    }`}>
                      {answers[currentQuestionIndex] === option && (
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                      )}
                    </div>
                    <span className="text-white flex-1">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="text-center">
              <div className="mb-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  score >= 70 ? 'bg-white text-black' : score >= 50 ? 'bg-white text-black' : 'bg-white text-black'
                }`}>
                  <span className="text-2xl font-bold">{score}%</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {score >= 70 ? 'Excellent!' : score >= 50 ? 'Good Job!' : 'Keep Practicing!'}
                </h3>
                <p className="text-white">
                  You answered {answers.filter(a => a).length} out of {questions.length} questions
                </p>
                {savingResult && (
                  <div className="mt-4 text-white">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving results...
                    </div>
                  </div>
                )}
              </div>

              {/* Question Review */}
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={index} className="bg-black border border-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-white">Question {index + 1}</span>
                      {answers[index] === (question.correct_answer || question.answer) ? (
                        <span className="text-white text-sm">✓ Correct</span>
                      ) : (
                        <span className="text-white text-sm">✗ Incorrect</span>
                      )}
                    </div>
                    <p className="text-white mb-2">{question.question}</p>
                    <div className="space-y-1">
                      {question.options?.map((option: string, optionIndex: number) => (
                        <div
                          key={optionIndex}
                          className={`text-sm p-2 rounded ${
                            option === (question.correct_answer || question.answer)
                              ? 'bg-white text-black'
                              : option === answers[index] && option !== (question.correct_answer || question.answer)
                              ? 'bg-white/20 text-white'
                              : 'text-white/60'
                          }`}
                        >
                          {option}
                          {option === (question.correct_answer || question.answer) && ' ✓'}
                          {option === answers[index] && option !== (question.correct_answer || question.answer) && ' ✗'}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="bg-black border-t border-white p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {!showResults ? (
                <>
                  {currentQuestionIndex === questions.length - 1 && (
                    <div className="flex items-center gap-2">
                      {autoSubmitCountdown > 0 ? (
                        <div className="text-white text-sm">
                          Auto-submitting in {autoSubmitCountdown}...
                        </div>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                        >
                          Submit Quiz ({answers.filter(a => a).length}/{questions.length} answered)
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 