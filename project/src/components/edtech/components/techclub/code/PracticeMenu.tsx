import React from "react";

const options = [
  { key: "practice", label: "Practice" },
  { key: "mock", label: "Mock Interviews" },
  { key: "tips", label: "Tips" },
  { key: "resources", label: "Resources" },
];

const PracticeMenu = ({ onSelect }: { onSelect: (section: string) => void }) => (
  <div className="min-h-[80vh] flex flex-col justify-center items-center bg-gradient-to-br from-black via-zinc-900 to-black">
    <div className="w-full max-w-md mx-auto p-10 rounded-2xl border border-[#C0C0C0] bg-black/80 backdrop-blur-md shadow-xl flex flex-col items-center glassmorphism">
      <h2 className="text-2xl font-extrabold tracking-widest text-[#C0C0C0] uppercase mb-8">Interview Prep Menu</h2>
      <div className="flex flex-col gap-6 w-full">
        {options.map(opt => (
          <button
            key={opt.key}
            className="w-full px-8 py-4 rounded-lg bg-gradient-to-r from-zinc-700 via-zinc-800 to-black text-[#C0C0C0] text-lg font-bold shadow-md border border-[#C0C0C0]/40 hover:bg-zinc-700 hover:text-white transition-all duration-200"
            onClick={() => onSelect(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default PracticeMenu; 