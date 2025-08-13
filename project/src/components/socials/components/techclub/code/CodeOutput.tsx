import React from 'react';
import { Terminal } from 'lucide-react';

interface CodeOutputProps {
  output: string;
}

export const CodeOutput = ({ output }: CodeOutputProps) => (
  <div className="bg-black/95 backdrop-blur-xl rounded-lg border border-emerald-500/20 overflow-hidden mt-4">
    <div className="flex items-center space-x-2 p-4 border-b border-emerald-500/20">
      <Terminal className="w-4 h-4 text-emerald-400/60" />
      <span className="text-emerald-400/60 font-code">Output</span>
    </div>
    
    <div className="relative min-h-[100px] p-4">
      <div className="absolute inset-0 cyber-grid opacity-5" />
      <pre className="font-code text-emerald-400/80 whitespace-pre-wrap relative z-10">
        {output || 'No output yet. Run your code to see the results.'}
      </pre>
    </div>
  </div>
);