import React from 'react';
import { termsAndConditions } from '../../data/settings';

export const TermsAndConditions = () => (
  <div className="space-y-6">
    {termsAndConditions.map((section) => (
      <div key={section.title} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg text-zinc-200">{section.title}</h2>
          <span className="text-sm text-zinc-400">
            Last updated: {new Date(section.lastUpdated).toLocaleDateString()}
          </span>
        </div>
        <p className="text-zinc-400 whitespace-pre-line">{section.content}</p>
      </div>
    ))}
  </div>
);