import React from 'react';
import { Send } from 'lucide-react';

const BatBrainIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 text-bat-red/70"
  >
    {/* Brain */}
    <path d="M9.5 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
    <path d="M14.5 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
    <path d="M3 9a2.5 2.5 0 0 1 5 0v1a2.5 2.5 0 1 1-5 0V9Z" />
    <path d="M16 9a2.5 2.5 0 0 1 5 0v1a2.5 2.5 0 1 1-5 0V9Z" />
    <path d="M9.5 7v3a2.5 2.5 0 1 1-5 0" />
    <path d="M14.5 7v3a2.5 2.5 0 1 0 5 0" />
    {/* Bat Wings */}
    <path d="M4 6c-2 2-3 4-3 6 3-2 6-2 9-1-2-2-4-4-6-5z" />
    <path d="M20 6c2 2 3 4 3 6-3-2-6-2-9-1 2-2 4-4 6-5z" />
  </svg>
);

export const DetectiveAI = () => (
  <div className="mt-8 bg-black/40 backdrop-blur-xl rounded-lg p-6 border-2 border-bat-red/30">
    <div className="flex items-center space-x-3 mb-6">
      <BatBrainIcon />
      <h2 className="text-xl text-white font-bold tracking-wider uppercase">DETECTIVE AI INTERFACE</h2>
    </div>
    
    <div className="flex space-x-4">
      <input
        type="text"
        placeholder="Ask the Detective AI for assistance..."
        className="flex-1 bg-black/60 backdrop-blur-xl border-2 border-bat-red/30 rounded-lg px-4 py-3 text-white placeholder-bat-red/30 focus:outline-none focus:border-bat-red/50 transition-colors font-bold tracking-wider uppercase"
      />
      <button className="px-6 py-3 bg-black/60 backdrop-blur-xl text-bat-red border-2 border-bat-red/30 rounded-lg hover:bg-bat-red/10 transition-colors font-bold tracking-wider uppercase flex items-center space-x-2">
        <Send className="w-4 h-4" />
        <span>QUERY</span>
      </button>
    </div>
  </div>
);