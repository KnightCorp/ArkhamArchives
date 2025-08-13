import React from 'react';
import { HelpCircle, Terminal, Lock } from 'lucide-react';
import { CodePlayground } from './code/CodePlayground';

interface TechClubContentProps {
  activeTab: string;
}

export const TechClubContent = ({ activeTab }: TechClubContentProps) => {
  if (activeTab === 'playground') {
    return (
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 p-8">
        <div className="relative">
          <div className="absolute inset-0 cyber-grid opacity-10" />
          <div className="relative">
            <CodePlayground />
          </div>
        </div>
      </div>
    );
  }

  const renderPlaceholder = (title: string) => (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5">
      <div className="relative p-8">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        
        <div className="relative space-y-8">
          {/* Terminal Header */}
          <div className="flex items-center space-x-2 border-b border-matrix/20 pb-4">
            <Terminal className="w-5 h-5 text-matrix" />
            <span className="text-matrix/70 font-code">system@techclub:~$</span>
            <span className="text-matrix font-code animate-pulse">_</span>
          </div>

          {/* Content */}
          <div className="text-center space-y-6">
            <div className="inline-block p-1 bg-black/50 backdrop-blur-sm rounded-2xl border border-matrix/20">
              <div className="w-24 h-24 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <HelpCircle className="w-12 h-12 text-matrix animate-pulse-slow" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl text-matrix mb-4 font-code">ENCRYPTED CONTENT</h2>
              <div className="flex items-center justify-center space-x-3 text-matrix/60 font-code">
                <Lock className="w-4 h-4" />
                <span>Access to {title} requires decryption</span>
              </div>
            </div>

            <div className="inline-block">
              <button className="px-8 py-3 bg-black/50 backdrop-blur-sm text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all cyber-border font-code">
                Initiate Decryption Sequence
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-black/60 backdrop-blur-sm border-t border-matrix/20 p-4">
        <div className="flex items-center justify-between text-sm text-matrix/40 font-code">
          <span>STATUS: ENCRYPTED</span>
          <span>CLEARANCE: REQUIRED</span>
          <span>ATTEMPTS: 0/3</span>
        </div>
      </div>
    </div>
  );

  const titles = {
    learning: 'Learning Paths',
    playground: 'Code Playground',
    riddles: 'Riddles & Challenges',
    arena: 'PvP Arena',
    projects: 'Projects',
    leaderboards: 'Leaderboards',
    groups: 'Group Projects',
    masters: 'Code Masters'
  };

  return renderPlaceholder(titles[activeTab as keyof typeof titles]);
};