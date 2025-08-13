import React, { useState } from 'react';
import { KeywordSearch } from '../ui/KeywordSearch';
import { KeywordTags } from '../ui/KeywordTags';

interface PreferenceSectionProps {
  title: string;
  description: string;
  suggestions: string[];
  selectedKeywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
}

export const PreferenceSection = ({
  title,
  description,
  suggestions,
  selectedKeywords,
  onKeywordsChange,
}: PreferenceSectionProps) => {
  const handleSelect = (keyword: string) => {
    if (!selectedKeywords.includes(keyword)) {
      onKeywordsChange([...selectedKeywords, keyword]);
    }
  };

  const handleRemove = (keyword: string) => {
    onKeywordsChange(selectedKeywords.filter(k => k !== keyword));
  };

  return (
    <div className="metallic-shine p-6 rounded-lg">
      <h3 className="text-xl text-white mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm mb-4">{description}</p>
      
      <KeywordSearch
        suggestions={suggestions.filter(s => !selectedKeywords.includes(s))}
        onSelect={handleSelect}
        placeholder={`Search ${title.toLowerCase()}...`}
      />
      
      <div className="mt-4">
        <KeywordTags keywords={selectedKeywords} onRemove={handleRemove} />
      </div>
    </div>
  );
};