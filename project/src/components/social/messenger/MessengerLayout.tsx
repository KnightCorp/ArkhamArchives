import React, { useState } from 'react';
import { MessageList } from '../messages/MessageList';
import { ChatWindow } from '../messages/ChatWindow';
import { ServerList } from './ServerList';
import { Search, Plus, Link, Lock, Globe } from 'lucide-react';

export const MessengerLayout = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [serverPrivacy, setServerPrivacy] = useState<'public' | 'private'>('private');

  const generateInviteLink = () => {
    return `https://app.example.com/invite/${Math.random().toString(36).slice(2)}`;
  };

  return (
    <div className="h-[calc(100vh-2rem)] max-w-7xl mx-auto">
      <div className="flex h-full bg-[#1a0f0f]/90 rounded-lg border border-[#8B0000]/30 academia-border">
        {/* Servers Sidebar */}
        <div className="w-20 border-r border-[#8B0000]/30 p-2 space-y-4 bg-[#0a0505]/80">
          <ServerList />
          <div className="space-y-2">
            <button className="w-12 h-12 mx-auto flex items-center justify-center bg-[#8B0000]/10 hover:bg-[#8B0000]/20 rounded-full transition-colors border border-[#8B0000]/30">
              <Plus className="w-5 h-5 text-silver" />
            </button>
            <button 
              onClick={() => setShowInviteModal(true)}
              className="w-12 h-12 mx-auto flex items-center justify-center bg-[#8B0000]/10 hover:bg-[#8B0000]/20 rounded-full transition-colors border border-[#8B0000]/30"
            >
              <Link className="w-5 h-5 text-silver" />
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="w-64 border-r border-[#8B0000]/30 bg-[#0a0505]/80">
          <div className="p-4 border-b border-[#8B0000]/30">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setServerPrivacy(serverPrivacy === 'public' ? 'private' : 'public')}
                className="flex items-center space-x-2 px-3 py-2 bg-[#8B0000]/10 rounded-lg hover:bg-[#8B0000]/20 transition-colors border border-[#8B0000]/30"
              >
                {serverPrivacy === 'public' ? (
                  <Globe className="w-4 h-4 text-silver" />
                ) : (
                  <Lock className="w-4 h-4 text-silver" />
                )}
                <span className="text-silver text-sm capitalize academia-text">{serverPrivacy}</span>
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full bg-[#8B0000]/10 border border-[#8B0000]/30 rounded-lg pl-10 pr-4 py-2 text-silver placeholder-silver/40 academia-text"
              />
            </div>
          </div>
          <MessageList activeChat={activeChat} onChatSelect={setActiveChat} searchQuery={searchQuery} />
        </div>

        {/* Chat Window */}
        {activeChat ? (
          <ChatWindow chatId={activeChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-silver/40 bg-[#0a0505]/80 academia-text">
            Select a conversation to start messaging
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1a0f0f]/90 rounded-lg p-6 w-full max-w-md border border-[#8B0000]/30 academia-border">
            <h3 className="text-xl text-silver academia-text mb-4">Invite People</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={generateInviteLink()}
                readOnly
                className="flex-1 bg-[#8B0000]/10 border border-[#8B0000]/30 rounded-lg px-4 py-2 text-silver academia-text"
              />
              <button className="px-4 py-2 bg-[#8B0000]/20 text-silver border border-[#8B0000]/30 rounded-lg hover:bg-[#8B0000]/30 transition-colors academia-text">
                Copy
              </button>
            </div>
            <button
              onClick={() => setShowInviteModal(false)}
              className="mt-4 w-full px-4 py-2 bg-[#8B0000]/10 text-silver border border-[#8B0000]/30 rounded-lg hover:bg-[#8B0000]/20 transition-colors academia-text"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};