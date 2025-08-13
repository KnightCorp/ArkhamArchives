import React, { useState } from 'react';
import { Newspaper, ArrowLeft, ArrowRight, Filter } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  bias: 'left' | 'center' | 'right';
  summary: string;
  image: string;
  perspectives: string[];
}

const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'New Economic Policy Sparks Debate',
    source: 'The Daily Observer',
    bias: 'center',
    summary: 'A comprehensive analysis of the recently proposed economic policy and its potential impacts.',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=400&fit=crop',
    perspectives: [
      'Policy could stimulate economic growth',
      'Concerns about long-term sustainability',
      'Impact on different socioeconomic groups'
    ]
  },
  {
    id: '2',
    title: 'Environmental Regulations Under Review',
    source: 'Metro Times',
    bias: 'left',
    summary: 'Discussion of proposed changes to environmental protection measures.',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&h=400&fit=crop',
    perspectives: [
      'Strengthening environmental protections',
      'Economic impact on industries',
      'Alternative policy proposals'
    ]
  }
];

export const Spectrum = () => {
  const [filter, setFilter] = useState<'all' | 'left' | 'center' | 'right'>('all');

  const filteredArticles = filter === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.bias === filter);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-white/60" />
            <span className="text-white">View Perspective</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('left')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'left'
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFilter('center')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'center'
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Newspaper className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFilter('right')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'right'
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-6">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-black/40 backdrop-blur-xl rounded-lg overflow-hidden border border-white/5">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl text-white">{article.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  article.bias === 'left'
                    ? 'bg-blue-500/10 text-blue-400'
                    : article.bias === 'right'
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-gray-500/10 text-gray-400'
                }`}>
                  {article.source}
                </span>
              </div>
              
              <p className="text-white/80 mb-4">{article.summary}</p>
              
              <div className="space-y-2">
                <h4 className="text-white/60">Key Perspectives</h4>
                {article.perspectives.map((perspective, index) => (
                  <p key={index} className="text-white/80 text-sm">• {perspective}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};