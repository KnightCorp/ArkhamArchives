import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, RefreshCw, Shield, Bookmark, X } from 'lucide-react';

export const WebBrowser = () => {
  const [url, setUrl] = useState('');
  const [tabs] = useState([
    { id: 1, title: 'Investigation Portal', url: 'https://investigation.noir/portal' },
    { id: 2, title: 'Evidence Database', url: 'https://evidence.noir/db' }
  ]);
  const [activeTab] = useState(1);

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-lg overflow-hidden">
      {/* Browser Controls */}
      <div className="p-2 border-b border-white/10 space-y-2">
        {/* Tabs */}
        <div className="flex items-center space-x-2">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <span className="font-mono text-sm truncate max-w-[150px]">{tab.title}</span>
              <button className="opacity-50 hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-2">
          <button className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg">
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* URL Bar */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-2 text-white/50">
              <Shield className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL or search query"
              className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Browser Content */}
      <div className="h-[600px] bg-black/30 p-8 flex items-center justify-center">
        <div className="text-center">
          <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 font-mono">Enter a URL to begin investigation</p>
        </div>
      </div>
    </div>
  );
};