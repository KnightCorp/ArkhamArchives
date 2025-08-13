import React, { useState, useEffect } from 'react';
import { Send, Brain, History, TrendingUp, Clock, Terminal } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const Alfred = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello, I am Alfred, your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [searchHistory] = useState([
    'How does confirmation bias affect decision making?',
    'What are effective techniques for active listening?',
    'Explain cognitive behavioral therapy frameworks'
  ]);

  const patterns = [
    {
      title: 'Search Patterns',
      description: 'You frequently research psychology and cognitive science topics',
      percentage: 45
    },
    {
      title: 'Time Analysis',
      description: 'Most active search times: 8-10 PM',
      percentage: 30
    },
    {
      title: 'Topic Clusters',
      description: 'Common themes: behavior, therapy, communication',
      percentage: 25
    }
  ];

  const handleSend = () => {
    if (!query.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: query,
      timestamp: new Date()
    }]);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I understand your query about "${query}". Let me analyze that for you...`,
        timestamp: new Date()
      }]);
    }, 1000);

    setQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Chat Terminal */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
        <div className="flex items-center space-x-3 mb-4">
          <Terminal className="w-5 h-5 text-white/60" />
          <h3 className="text-lg text-white">AI Terminal</h3>
        </div>
        
        <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-white/10 text-white'
                  : 'bg-black/50 text-white/90'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  {msg.role === 'assistant' && <Brain className="w-4 h-4 text-white/60" />}
                  <span className="text-sm text-white/60">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 bg-black/20 rounded-lg px-4 py-3 text-white placeholder-white/30 border border-white/10 focus:border-white/20 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!query.trim()}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* Search Patterns */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-5 h-5 text-white/60" />
          <h3 className="text-lg text-white">Search Patterns</h3>
        </div>
        <div className="space-y-4">
          {patterns.map((pattern, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white">{pattern.title}</span>
                <span className="text-white/60">{pattern.percentage}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div 
                  className="h-full bg-white/20 rounded-full"
                  style={{ width: `${pattern.percentage}%` }}
                />
              </div>
              <p className="text-white/60 text-sm">{pattern.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
        <div className="flex items-center space-x-2 mb-4">
          <History className="w-5 h-5 text-white/60" />
          <h3 className="text-white">Recent Searches</h3>
        </div>
        <div className="space-y-2">
          {searchHistory.map((search, index) => (
            <button
              key={index}
              onClick={() => setQuery(search)}
              className="w-full text-left p-3 bg-black/20 rounded-lg text-white/80 hover:bg-black/30 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-white/40" />
                <span>{search}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};