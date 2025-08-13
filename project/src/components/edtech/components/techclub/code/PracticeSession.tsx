import React, { useState } from "react";
import vastData from "./vastData.json";
import QuestionCard from "./QuestionCard";

const getUnique = (arr, key) => Array.from(new Set(arr.map(q => q[key])));

const PracticeSession = () => {
  const allQuestions = vastData.practiceQuestions || [];
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState('');
  const [current, setCurrent] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [fade, setFade] = useState(true);

  // Filter questions
  const filtered = allQuestions.filter(q =>
    (!difficulty || q.difficulty === difficulty) &&
    (!topic || q.topic === topic)
  );

  // Reset current index if filter changes
  React.useEffect(() => { setCurrent(0); }, [difficulty, topic]);

  const currentQuestion = filtered[current];
  const difficulties = getUnique(allQuestions, 'difficulty');
  const topics = getUnique(allQuestions, 'topic');

  // Animate fade on question change
  React.useEffect(() => {
    setFade(false);
    const t = setTimeout(() => setFade(true), 100);
    return () => clearTimeout(t);
  }, [current, filtered.length]);

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full">
      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-8 mt-12 justify-center">
        <div>
          <label className="text-white mr-2">Difficulty:</label>
          <select
            className="px-3 py-1 rounded bg-zinc-800 text-white border border-[#C0C0C0]"
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
          >
            <option value="">All</option>
            {difficulties.map(d => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-white mr-2">Topic:</label>
          <select
            className="px-3 py-1 rounded bg-zinc-800 text-white border border-[#C0C0C0]"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          >
            <option value="">All</option>
            {topics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Progress Bar */}
      {filtered.length > 0 && (
        <div className="w-full max-w-lg mb-6">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Question {current + 1} of {filtered.length}</span>
            <span>{Math.round(((current + 1) / filtered.length) * 100)}%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-emerald-400 transition-all"
              style={{ width: `${((current + 1) / filtered.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      {/* Question and controls */}
      {filtered.length === 0 ? (
        <div className="text-white mt-12">No questions found for selected filters.</div>
      ) : (
        <div
          className={`w-full max-w-xl transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="bg-black/70 border border-[#C0C0C0] rounded-xl shadow-xl p-8 mb-6 flex flex-col items-center">
            {/* Badges */}
            <div className="flex gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-600/20 text-green-400 border border-green-400/30' :
                currentQuestion.difficulty === 'medium' ? 'bg-gray-600/20 text-gray-300 border border-gray-300/30' :
                'bg-white/20 text-white border border-white/30'
              }`}>
                {currentQuestion.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-gray-600/20 text-gray-300 border border-gray-300/30">
                {currentQuestion.topic}
              </span>
            </div>
            <QuestionCard question={currentQuestion} />
            <div className="flex gap-4 mt-4">
              {currentQuestion.hint && (
                <button
                  className={`px-4 py-2 rounded font-bold transition-all text-sm border border-gray-300/30 bg-gray-600/20 text-gray-300 hover:bg-gray-600/30 ${showHint ? 'ring-2 ring-gray-300/40' : ''}`}
                  onClick={() => setShowHint((v) => !v)}
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
              )}
              {currentQuestion.solution && (
                <button
                  className={`px-4 py-2 rounded font-bold transition-all text-sm border border-green-400/30 bg-green-600/20 text-green-300 hover:bg-green-600/30 ${showSolution ? 'ring-2 ring-green-400/40' : ''}`}
                  onClick={() => setShowSolution((v) => !v)}
                >
                  {showSolution ? 'Hide Solution' : 'Show Solution'}
                </button>
              )}
            </div>
            {showHint && currentQuestion.hint && (
              <div className="mt-6 mb-4 px-6 py-4 bg-gray-600/10 border border-gray-300/30 rounded text-gray-200 text-base leading-relaxed max-w-2xl w-full text-left">{currentQuestion.hint}</div>
            )}
            {showSolution && currentQuestion.solution && (
              <div className="mt-4 mb-4 px-6 py-4 bg-green-600/10 border border-green-400/30 rounded text-green-200 text-base leading-relaxed max-w-2xl w-full text-left">{currentQuestion.solution}</div>
            )}
            <div className="flex gap-4 mt-8 w-full justify-between">
              <button
                className="px-6 py-2 rounded bg-zinc-700 text-white font-bold disabled:opacity-50 transition-all border border-zinc-500/30 hover:bg-zinc-800"
                onClick={() => {
                  setShowHint(false); setShowSolution(false); setCurrent((prev) => Math.max(prev - 1, 0));
                }}
                disabled={current === 0}
              >
                Previous
              </button>
              <button
                className="px-6 py-2 rounded bg-emerald-600 text-white font-bold disabled:opacity-50 transition-all border border-emerald-400/30 hover:bg-emerald-700"
                onClick={() => {
                  setShowHint(false); setShowSolution(false); setCurrent((prev) => Math.min(prev + 1, filtered.length - 1));
                }}
                disabled={current === filtered.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeSession; 