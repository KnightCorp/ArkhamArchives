import React, { useState } from 'react';
import { Video, Mic, Settings, Users } from 'lucide-react';

export const LiveStream = () => {
  const [isLive, setIsLive] = useState(false);
  const [title, setTitle] = useState('');

  return (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl text-white">Go Live</h3>
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-zinc-500'}`} />
          <span className="text-sm text-zinc-400">{isLive ? 'Live' : 'Offline'}</span>
        </div>
      </div>

      {!isLive ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Stream title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-800 rounded-lg px-4 py-2 text-white placeholder-zinc-500 border border-zinc-700 focus:border-white/20 focus:ring-0"
          />

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
              <Video className="w-5 h-5 text-zinc-400" />
              <span className="text-zinc-400">Test Video</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
              <Mic className="w-5 h-5 text-zinc-400" />
              <span className="text-zinc-400">Test Audio</span>
            </button>
          </div>

          <button
            onClick={() => setIsLive(true)}
            disabled={!title}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Streaming
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="aspect-video bg-zinc-800 rounded-lg flex items-center justify-center">
            <span className="text-zinc-500">Live Preview</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                <Settings className="w-5 h-5 text-zinc-400" />
              </button>
              <div className="flex items-center space-x-2 text-zinc-400">
                <Users className="w-5 h-5" />
                <span>0 viewers</span>
              </div>
            </div>
            <button
              onClick={() => setIsLive(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              End Stream
            </button>
          </div>
        </div>
      )}
    </div>
  );
};