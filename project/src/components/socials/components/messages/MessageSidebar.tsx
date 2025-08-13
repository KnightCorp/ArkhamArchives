import React, { useState } from 'react';
import { Search, Settings } from 'lucide-react';
import { MessageList } from './MessageList';

interface MessageSidebarProps {
  activeChat: string | null;
  onChatSelect: (chatId: string) => void;
}

export const MessageSidebar = ({ activeChat, onChatSelect }: MessageSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-80 border-r border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-zinc-200 font-typewriter">Messages</h2>
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
        </div>
      </div>

      {/* Message List */}
      <MessageList
        activeChat={activeChat}
        onChatSelect={onChatSelect}
        searchQuery={searchQuery}
      />
    </div>
  );
};