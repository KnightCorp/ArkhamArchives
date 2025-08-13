import React from 'react';
import { Copy, Play } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
}

export const CodeEditor = ({ value, onChange, onRun }: CodeEditorProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="bg-black/95 backdrop-blur-xl rounded-lg border border-emerald-500/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-emerald-500/20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
          <div className="w-3 h-3 rounded-full bg-green-500/20" />
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleCopy}
            className="p-2 text-emerald-400/60 hover:text-emerald-400 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onRun}
            className="flex items-center space-x-2 px-4 py-2 bg-black/50 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10 transition-all cyber-border font-code"
          >
            <Play className="w-4 h-4" />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <div className="absolute inset-0 cyber-grid opacity-5" />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-64 bg-transparent text-emerald-400 font-code p-4 resize-none focus:outline-none relative z-10"
          spellCheck="false"
          placeholder="// Write your code here..."
        />
      </div>
    </div>
  );
};