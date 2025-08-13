import React, { useState } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  ChevronLeft,
  Users,
  Target,
  Award,
  Timer,
  AlertCircle,
  Star,
  BookOpen,
  TrendingUp
} from "lucide-react";
import vastData from "./vastData.json";
import QuestionCard from "./QuestionCard";

const getQuestionsForMock = (interviewId: number) => {
  if (!vastData.mockInterviews || !vastData.mockInterviews.length) return [];
  const interview = vastData.mockInterviews.find((i: any) => i.id === interviewId);
  if (!interview) return [];
  const ids = interview.questions;
  return ids.map((id: number) => vastData.practiceQuestions.find((q: any) => q.id === id)).filter(Boolean);
};

const InterviewCard = ({ interview, onSelect, isSelected }: any) => (
  <div 
    className={`bg-black/60 border rounded-lg p-4 cursor-pointer transition-all hover:bg-black/80 ${
      isSelected 
        ? 'border-[#C0C0C0] bg-black/80' 
        : 'border-[#C0C0C0]/40 hover:border-[#C0C0C0]/60'
    }`}
    onClick={() => onSelect(interview.id)}
  >
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-white font-bold">{interview.title}</h3>
      <span className={`px-2 py-1 text-xs rounded ${
        interview.difficulty === 'easy' ? 'bg-green-600/20 text-green-400' :
        interview.difficulty === 'medium' ? 'bg-gray-600/20 text-gray-300' :
        'bg-white/20 text-white'
      }`}>
        {interview.difficulty}
      </span>
    </div>
    <p className="text-white/70 text-sm mb-2">{interview.description}</p>
    <div className="flex items-center gap-4 text-white/60 text-xs">
      <div className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>{interview.duration}</span>
      </div>
      <div className="flex items-center gap-1">
        <BookOpen className="w-3 h-3" />
        <span>{interview.questions.length} questions</span>
      </div>
    </div>
  </div>
);

const TimerDisplay = ({ timeLeft, totalTime }: any) => {
  const percentage = (timeLeft / totalTime) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  return (
    <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-[#C0C0C0]" />
          <span className="text-white font-bold">Time Remaining</span>
        </div>
        <span className={`text-lg font-bold ${
          percentage > 50 ? 'text-green-400' : 
          percentage > 25 ? 'text-gray-300' : 'text-white'
        }`}>
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all ${
            percentage > 50 ? 'bg-green-400' : 
            percentage > 25 ? 'bg-gray-300' : 'bg-white'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const ProgressIndicator = ({ current, total }: any) => (
  <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-4 mb-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-white font-medium">Progress</span>
      <span className="text-[#C0C0C0] font-bold">{current} / {total}</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div 
        className="h-2 rounded-full bg-[#C0C0C0] transition-all"
        style={{ width: `${(current / total) * 100}%` }}
      ></div>
    </div>
  </div>
);

const MockInterviewSession = () => {
  const [selectedInterview, setSelectedInterview] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [score, setScore] = useState(0);
  
  const questions = selectedInterview ? getQuestionsForMock(selectedInterview) : [];
  const finished = started && current >= questions.length;
  const interview = selectedInterview ? vastData.mockInterviews.find((i: any) => i.id === selectedInterview) : null;

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (started && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up, end the interview
            setStarted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [started, isPaused, timeLeft]);

  const startInterview = () => {
    if (!selectedInterview) return;
    setStarted(true);
    setCurrent(0);
    setShowHint(false);
    setShowSolution(false);
    setAnswers({});
    setScore(0);
    // Set time based on interview duration (convert to seconds)
    const duration = interview?.duration || "45 minutes";
    const minutes = parseInt(duration.split(' ')[0]);
    setTimeLeft(minutes * 60);
    setIsPaused(false);
  };

  const pauseInterview = () => {
    setIsPaused(!isPaused);
  };

  const resetInterview = () => {
    setStarted(false);
    setCurrent(0);
    setShowHint(false);
    setShowSolution(false);
    setAnswers({});
    setScore(0);
    setTimeLeft(0);
    setIsPaused(false);
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(prev => prev + 1);
      setShowHint(false);
      setShowSolution(false);
    }
  };

  const prevQuestion = () => {
    if (current > 0) {
      setCurrent(prev => prev - 1);
      setShowHint(false);
      setShowSolution(false);
    }
  };

  const finishInterview = () => {
    setCurrent(questions.length);
    setStarted(false);
  };

  const saveAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  if (!selectedInterview) {
    return (
      <div className="text-white py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#C0C0C0] mb-4">Mock Interviews</h2>
          <p className="text-white/70 mb-6">Practice with realistic interview scenarios tailored to different roles and experience levels.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vastData.mockInterviews.map((interview: any) => (
            <InterviewCard 
              key={interview.id} 
              interview={interview} 
              onSelect={setSelectedInterview}
              isSelected={false}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="text-white py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#C0C0C0] mb-4">{interview?.title}</h2>
          <p className="text-white/70 mb-6">{interview?.description}</p>
        </div>
        
        <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#C0C0C0]" />
              <span className="text-white">Duration: {interview?.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#C0C0C0]" />
              <span className="text-white">{questions.length} Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#C0C0C0]" />
              <span className="text-white">Difficulty: {interview?.difficulty}</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={startInterview}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
            >
              <Play className="w-4 h-4" />
              Start Interview
            </button>
            <button
              onClick={() => setSelectedInterview(null)}
              className="px-6 py-3 bg-black/40 text-white border border-[#C0C0C0]/40 rounded-lg hover:bg-black/60 transition-all"
            >
              Back to Interviews
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    
    return (
      <div className="text-white py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#C0C0C0] mb-4">Interview Complete!</h2>
          <p className="text-white/70 mb-6">Great job completing the mock interview. Here's your performance summary.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#C0C0C0] mb-2">{score}/{questions.length}</div>
            <div className="text-white/70">Questions Correct</div>
          </div>
          <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#C0C0C0] mb-2">{accuracy}%</div>
            <div className="text-white/70">Accuracy</div>
          </div>
          <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#C0C0C0] mb-2">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
            <div className="text-white/70">Time Remaining</div>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={resetInterview}
            className="flex items-center gap-2 px-6 py-3 bg-[#C0C0C0] text-black rounded-lg hover:bg-[#C0C0C0]/80 transition-all font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Interview
          </button>
          <button
            onClick={() => setSelectedInterview(null)}
            className="px-6 py-3 bg-black/40 text-white border border-[#C0C0C0]/40 rounded-lg hover:bg-black/60 transition-all"
          >
            Back to Interviews
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  
  return (
    <div className="text-white py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#C0C0C0] mb-2">{interview?.title}</h2>
        <p className="text-white/70">Question {current + 1} of {questions.length}</p>
      </div>
      
      <TimerDisplay timeLeft={timeLeft} totalTime={interview?.duration ? parseInt(interview.duration.split(' ')[0]) * 60 : 2700} />
      <ProgressIndicator current={current + 1} total={questions.length} />
      
      <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-6 mb-6">
        <QuestionCard question={q} />
        
        <div className="flex gap-4 mt-6">
          {q.hint && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gray-600/20 text-gray-300 border border-gray-300/30 rounded hover:bg-gray-600/30 transition-all"
              onClick={() => setShowHint(!showHint)}
            >
              <AlertCircle className="w-4 h-4" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          )}
          {q.solution && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-400/30 rounded hover:bg-green-600/30 transition-all"
              onClick={() => setShowSolution(!showSolution)}
            >
              <CheckCircle className="w-4 h-4" />
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>
          )}
        </div>
        
        {showHint && q.hint && (
          <div className="mt-4 p-4 bg-gray-600/10 border border-gray-300/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-gray-300" />
              <span className="text-gray-300 font-medium">Hint</span>
            </div>
            <p className="text-white/90">{q.hint}</p>
          </div>
        )}
        
        {showSolution && q.solution && (
          <div className="mt-4 p-4 bg-green-600/10 border border-green-400/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">Solution</span>
            </div>
            <p className="text-white/90">{q.solution}</p>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={prevQuestion}
            disabled={current === 0}
            className="flex items-center gap-2 px-4 py-2 bg-black/40 text-white border border-[#C0C0C0]/40 rounded hover:bg-black/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={nextQuestion}
            disabled={current === questions.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-black/40 text-white border border-[#C0C0C0]/40 rounded hover:bg-black/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={pauseInterview}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-400/30 rounded hover:bg-blue-600/30 transition-all"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={finishInterview}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all font-medium"
          >
            <Award className="w-4 h-4" />
            Finish Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockInterviewSession; 