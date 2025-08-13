import React, { useState } from 'react';
import { MessageList } from '../components/messages/MessageList';
import { ChatWindow } from '../components/messages/ChatWindow';
import { MessageSidebar } from '../components/messages/MessageSidebar';

const Messages = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);

  return (
    <div className="h-[calc(100vh-2rem)] max-w-7xl mx-auto">
      <div className="flex h-full bg-zinc-900/50 rounded-lg border border-zinc-800">
        <MessageSidebar activeChat={activeChat} onChatSelect={setActiveChat} />
        {activeChat ? (
          <ChatWindow chatId={activeChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;