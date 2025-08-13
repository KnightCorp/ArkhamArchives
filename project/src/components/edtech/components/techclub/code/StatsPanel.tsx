import React from "react";

const StatsPanel = ({ attempted, accuracy, streak, xp }: {
  attempted: number,
  accuracy: number,
  streak: number,
  xp: number,
}) => (
  <div className="w-full max-w-2xl grid grid-cols-2 gap-6 mb-8">
    <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-6 text-center">
      <div className="text-2xl font-bold text-[#C0C0C0]">{attempted}</div>
      <div className="text-xs text-white/80 mt-1">Questions Attempted</div>
    </div>
    <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-6 text-center">
      <div className="text-2xl font-bold text-[#C0C0C0]">{accuracy}%</div>
      <div className="text-xs text-white/80 mt-1">Accuracy</div>
    </div>
    <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-6 text-center">
      <div className="text-2xl font-bold text-[#C0C0C0]">{streak}</div>
      <div className="text-xs text-white/80 mt-1">Current Streak</div>
    </div>
    <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-6 text-center">
      <div className="text-2xl font-bold text-[#C0C0C0]">{xp}</div>
      <div className="text-xs text-white/80 mt-1">XP</div>
    </div>
  </div>
);

export default StatsPanel; 