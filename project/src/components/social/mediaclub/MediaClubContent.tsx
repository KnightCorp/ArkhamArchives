import React from 'react';
import { Lock, Terminal } from 'lucide-react';

interface MediaClubContentProps {
  activeTab: string;
  mode: 'detective' | 'gossip';
}

export const MediaClubContent = ({ activeTab, mode }: MediaClubContentProps) => {
  const renderPlaceholder = (title: string) => (
    <div className={`${
      mode === 'detective'
        ? 'bg-black/80 border border-[#00ff00]/30'
        : 'bg-[#1a0f0f]/90 border border-[#8B0000]/30'
    } rounded-lg p-8`}>
      {mode === 'detective' ? (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-[#00ff00]" />
            <span className="text-[#00ff00]/70 font-mono">
              system@archives:~$ accessing_{title.toLowerCase()}_module
            </span>
          </div>
          <div className="border border-[#00ff00]/20 rounded-lg p-6 text-center">
            <Lock className="w-12 h-12 text-[#00ff00]/50 mx-auto mb-4" />
            <p className="text-[#00ff00] font-mono">
              ACCESS DENIED: SECURITY CLEARANCE REQUIRED
            </p>
            <p className="text-[#00ff00]/50 font-mono mt-2">
              Module: {title.toUpperCase()}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#1a0f0f] flex items-center justify-center border border-[#8B0000]/30">
            <Lock className="w-8 h-8 text-[#8B0000]" />
          </div>
          <h2 className="text-2xl text-[#8B0000]">{title}</h2>
          <p className="text-[#8B0000]/80 italic">
            "This content remains sealed in the archives..."
          </p>
        </div>
      )}
    </div>
  );

  const titles = {
    learning: 'Learning Modules',
    writing: 'Writing Studio',
    films: 'Film Workshop',
    news: 'News Room',
    competitions: 'Competitions',
    collaborations: 'Collaborations',
    featured: 'Featured Works',
    submissions: 'Submissions'
  };

  return renderPlaceholder(titles[activeTab as keyof typeof titles]);
};