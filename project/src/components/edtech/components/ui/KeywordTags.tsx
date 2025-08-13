import React from 'react';
import { X } from 'lucide-react';

interface KeywordTagsProps {
  keywords: string[];
  onRemove: (keyword: string) => void;
}

export const KeywordTags = ({ keywords, onRemove }: KeywordTagsProps) => (
  <div className="flex flex-wrap gap-2">
    {keywords.map((keyword) => (
      <span
        key={keyword}
        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-zinc-800 text-zinc-200"
      >
        {keyword}
        <button
          onClick={() => onRemove(keyword)}
          className="ml-2 hover:text-white"
        >
          <X className="w-3 h-3" />
        </button>
      </span>
    ))}
  </div>
);