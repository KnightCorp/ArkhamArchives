import React, { useState, useEffect } from "react";
import { PenTool, Brain, Calendar, Clock, Loader } from "lucide-react";
import {
  createJournalEntry,
  getUserJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
} from "../../lib/socialMediaQueries";

interface JournalEntry {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  mood: string | null;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  analysis?: {
    traits: string[];
    biases: string[];
    mood: string;
    insights: string[];
  };
}

interface JournalProps {
  currentUser: any;
}

export const Journal = ({ currentUser }: JournalProps) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mood, setMood] = useState("neutral");

  // Load journal entries when component mounts or user changes
  useEffect(() => {
    if (currentUser?.id) {
      loadJournalEntries();
    }
  }, [currentUser]);

  const loadJournalEntries = async () => {
    if (!currentUser?.id) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await getUserJournalEntries(currentUser.id);
      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error("Error loading journal entries:", err);
      setError("Failed to load journal entries");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!newEntry.trim() || !currentUser?.id) return;

    setSubmitting(true);
    setError(null);

    try {
      const { data, error } = await createJournalEntry(
        currentUser.id,
        "", // title can be empty for now
        newEntry,
        mood,
        true // is_private default to true
      );

      if (error) throw error;

      // Add the new entry to the beginning of the list
      if (data) {
        setEntries([data, ...entries]);
        setNewEntry("");
        setMood("neutral");
      }
    } catch (err) {
      console.error("Error creating journal entry:", err);
      setError("Failed to create journal entry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!currentUser?.id) return;

    try {
      const { error } = await deleteJournalEntry(entryId, currentUser.id);
      if (error) throw error;

      // Remove entry from state
      setEntries(entries.filter((entry) => entry.id !== entryId));
      setSelectedEntry(null);
    } catch (err) {
      console.error("Error deleting journal entry:", err);
      setError("Failed to delete journal entry");
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  // Mock AI analysis function (you can replace this with actual AI integration)
  const generateMockAnalysis = (content: string) => {
    const traits = ["Introspective", "Analytical", "Self-aware"];
    const biases = ["Confirmation bias", "Hindsight bias"];
    const insights = [
      "Your writing shows strong self-reflection capabilities",
      "Consider exploring alternative perspectives on this situation",
    ];

    return {
      traits: traits.slice(0, Math.floor(Math.random() * 3) + 1),
      biases: biases.slice(0, Math.floor(Math.random() * 2) + 1),
      mood: mood,
      insights,
    };
  };

  if (!currentUser) {
    return (
      <div className="text-center py-8 text-white/60">
        Please log in to access your journal.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Entry Input */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
        <div className="flex items-center space-x-2 mb-4">
          <PenTool className="w-5 h-5 text-white/60" />
          <h2 className="text-xl text-white">Write Your Thoughts</h2>
        </div>

        {/* Mood Selector */}
        <div className="mb-4">
          <label className="block text-white/60 text-sm mb-2">
            Current Mood
          </label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="bg-black/20 rounded-lg px-3 py-2 text-white border border-white/10 focus:border-white/20 focus:ring-0"
          >
            <option value="happy">😊 Happy</option>
            <option value="sad">😢 Sad</option>
            <option value="anxious">😰 Anxious</option>
            <option value="excited">🤩 Excited</option>
            <option value="neutral">😐 Neutral</option>
            <option value="frustrated">😤 Frustrated</option>
            <option value="grateful">🙏 Grateful</option>
            <option value="contemplative">🤔 Contemplative</option>
          </select>
        </div>

        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="What's on your mind? Share your thoughts, feelings, or experiences..."
          className="w-full h-32 bg-black/20 rounded-lg p-4 text-white placeholder-white/30 resize-none border border-white/10 focus:border-white/20 focus:ring-0 transition-colors"
          disabled={submitting}
        />

        {error && <div className="mt-2 text-red-400 text-sm">{error}</div>}

        <button
          onClick={handleAddEntry}
          disabled={!newEntry.trim() || submitting}
          className="mt-4 px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {submitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Add Entry</span>
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8 text-white/60">
          <Loader className="w-6 h-6 animate-spin mx-auto mb-2" />
          Loading your journal entries...
        </div>
      )}

      {/* Empty State */}
      {!loading && entries.length === 0 && (
        <div className="text-center py-8 text-white/60">
          <PenTool className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No journal entries yet. Start writing your first entry above!</p>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5 cursor-pointer hover:bg-black/50 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-4 text-white/60">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimeAgo(entry.created_at)}</span>
                </div>
                {entry.mood && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm bg-white/10 px-2 py-1 rounded">
                      {entry.mood}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-white/90 line-clamp-3">{entry.content}</p>
          </div>
        ))}
      </div>

      {/* Analysis Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center space-x-2 mb-6">
              <Brain className="w-5 h-5 text-white/60" />
              <h3 className="text-xl text-white">
                Journal Entry & AI Analysis
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white/60">
                    Entry from{" "}
                    {new Date(selectedEntry.created_at).toLocaleDateString()}
                  </h4>
                  <button
                    onClick={() => handleDeleteEntry(selectedEntry.id)}
                    className="text-red-400 hover:text-red-300 text-sm px-3 py-1 border border-red-400/20 rounded hover:bg-red-400/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-white bg-black/20 p-4 rounded-lg">
                  {selectedEntry.content}
                </p>
              </div>

              {selectedEntry.analysis ? (
                <>
                  <div>
                    <h4 className="text-white/60 mb-2">Behavioral Traits</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.analysis.traits.map((trait, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-white/5 rounded-full text-white/80"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white/60 mb-2">
                      Potential Cognitive Biases
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.analysis.biases.map((bias, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-white/5 rounded-full text-white/80"
                        >
                          {bias}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white/60 mb-2">AI Insights</h4>
                    <ul className="space-y-2">
                      {selectedEntry.analysis.insights.map((insight, i) => (
                        <li key={i} className="text-white/80">
                          • {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <button
                    onClick={() => {
                      const analysis = generateMockAnalysis(
                        selectedEntry.content
                      );
                      setSelectedEntry({
                        ...selectedEntry,
                        analysis,
                      });
                    }}
                    className="px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Generate AI Analysis
                  </button>
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
