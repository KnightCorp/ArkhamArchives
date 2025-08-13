import React, { useState } from 'react';
import { Timer, CheckCircle, XCircle } from 'lucide-react';

export const ExamArena = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const mockQuestion = {
    question: 'What is the primary purpose of the useEffect hook in React?',
    options: [
      'To handle side effects in functional components',
      'To create new React components',
      'To style React components',
      'To define component props'
    ],
    correctAnswer: 0
  };

  return (
    <div className="space-y-8">
      {/* Match Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-matrix font-code">
            <Timer className="w-5 h-5" />
            <span>02:45</span>
          </div>
          <div className="text-matrix/60 font-code">vs Player_2048</div>
        </div>
        <div className="flex items-center space-x-4 text-matrix font-code">
          <span>Score: 120</span>
          <span>Question 3/10</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-black/50 border border-matrix/30 rounded-lg p-6">
        <h3 className="text-xl text-matrix mb-6 font-code">{mockQuestion.question}</h3>
        
        <div className="space-y-4">
          {mockQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(index)}
              className={`w-full text-left p-4 rounded-lg font-code transition-all ${
                selectedAnswer === index
                  ? 'bg-matrix/20 text-matrix border border-matrix/50'
                  : 'bg-black/30 text-matrix/70 border border-matrix/20 hover:bg-matrix/10 hover:text-matrix'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/50 border border-matrix/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-code">Correct</span>
          </div>
          <div className="text-2xl text-matrix font-code">4</div>
        </div>
        <div className="bg-black/50 border border-matrix/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-400 mb-2">
            <XCircle className="w-5 h-5" />
            <span className="font-code">Incorrect</span>
          </div>
          <div className="text-2xl text-matrix font-code">1</div>
        </div>
      </div>
    </div>
  );
};