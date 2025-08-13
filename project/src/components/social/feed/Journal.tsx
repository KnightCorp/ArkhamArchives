import React, { useState } from 'react';
import { PenTool, Brain, Calendar, Clock } from 'lucide-react';

interface JournalEntry {
  id: string;
  content: string;
  timestamp: string;
  analysis?: {
    traits: string[];
    biases: string[];
    mood: string;
    insights: string[];
  };
}

export const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      content: "Today's meeting was particularly challenging. I found myself getting defensive when receiving feedback.",
      timestamp: new Date().toISOString(),
      analysis: {
        traits: ['Self-awareness', 'Defensive response pattern'],
        biases: ['Fundamental attribution error'],
        mood: 'Reflective',
        insights: [
          'Your response pattern indicates a growth opportunity in feedback reception',
          'Consider practicing active listening techniques'
        ]
      }
    }
  ]);
  const [newEntry, setNewEntry] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const handleAddEntry = () => {
    if (!newEntry.trim()) return;
    
    const entry: JournalEntry = {
      id: Date.now().toString(),
      content: newEntry,
      timestamp: new Date().toISOString()
    };
    
    setEntries([entry, ...entries]);
    setNewEntry('');
  };

  return (
    <div className="space-y-6">
      {/* Entry Input */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
        <div className="flex items-center space-x-2 mb-4">
          <PenTool className="w-5 h-5 text-white/60" />
          <h2 className="text-xl text-white">Write Your Thoughts</h2>
        </div>
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full h-32 bg-black/20 rounded-lg p-4 text-white placeholder-white/30 resize-none border border-white/10 focus:border-white/20 focus:ring-0 transition-colors"
        />
        <button
          onClick={handleAddEntry}
          className="mt-4 px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
        >
          Add Entry
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5 cursor-pointer hover:bg-black/50 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-white/60">
                <Calendar className="w-4 h-4" />
                <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-white/60">
                <Clock className="w-4 h-4" />
                <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
            <p className="text-white/90">{entry.content}</p>
          </div>
        ))}
      </div>

      {/* Analysis Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-2xl border border-white/10">
            <div className="flex items-center space-x-2 mb-6">
              <Brain className="w-5 h-5 text-white/60" />
              <h3 className="text-xl text-white">AI Analysis</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-white/60 mb-2">Original Entry</h4>
                <p className="text-white">{selectedEntry.content}</p>
              </div>

              {selectedEntry.analysis ? (
                <>
                  <div>
                    <h4 className="text-white/60 mb-2">Behavioral Traits</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.analysis.traits.map((trait, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-white/80">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white/60 mb-2">Cognitive Biases</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.analysis.biases.map((bias, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-white/80">
                          {bias}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white/60 mb-2">AI Insights</h4>
                    <ul className="space-y-2">
                      {selectedEntry.analysis.insights.map((insight, i) => (
                        <li key={i} className="text-white/80">• {insight}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-white/60">
                  Analysis in progress...
                </div>
              )}

              <button
                onClick={() => setSelectedEntry(null)}
                className="w-full mt-4 px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};