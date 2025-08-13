import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface PreferenceSectionProps {
  title: string;
  description: string;
  suggestions: string[];
  selectedKeywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
}

export const PreferenceSection: React.FC<PreferenceSectionProps> = ({
  title,
  description,
  suggestions = [], // Default to empty array
  selectedKeywords = [], // Default to empty array
  onKeywordsChange,
}) => {
  const [customInput, setCustomInput] = useState("");

  const handleAddSuggestion = (suggestion: string) => {
    if (!selectedKeywords.includes(suggestion)) {
      onKeywordsChange([...selectedKeywords, suggestion]);
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    onKeywordsChange(selectedKeywords.filter((k) => k !== keyword));
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !selectedKeywords.includes(trimmed)) {
      onKeywordsChange([...selectedKeywords, trimmed]);
      setCustomInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom();
    }
  };

  return (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <div className="mb-4">
        <h3 className="text-lg text-white mb-2">{title}</h3>
        <p className="text-zinc-400 text-sm">{description}</p>
      </div>

      {/* Selected Keywords */}
      {selectedKeywords.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm text-zinc-300 mb-2">Selected:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map((keyword) => (
              <span
                key={keyword}
                className="flex items-center space-x-1 bg-emerald-600/20 text-emerald-300 px-3 py-1 rounded-full text-sm border border-emerald-500/30"
              >
                <span>{keyword}</span>
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="hover:text-emerald-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="mb-4">
        <h4 className="text-sm text-zinc-300 mb-2">Suggestions:</h4>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleAddSuggestion(suggestion)}
              disabled={selectedKeywords.includes(suggestion)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedKeywords.includes(suggestion)
                  ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add custom preference..."
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
        />
        <button
          onClick={handleAddCustom}
          disabled={
            !customInput.trim() || selectedKeywords.includes(customInput.trim())
          }
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};
