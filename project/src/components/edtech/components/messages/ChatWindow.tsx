import React, { useState } from 'react';
import { Send, Image, Paperclip, MoreVertical } from 'lucide-react';

interface ChatWindowProps {
  chatId: string;
}

export const ChatWindow = ({ chatId }: ChatWindowProps) => {
  const [message, setMessage] = useState('');

  // Mock chat data
  const chat = {
    user: {
      name: 'Vincent Gray',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
      online: true
    },
    messages: [
      {
        id: '1',
        sender: 'them',
        text: 'The shadows tell stories...',
        time: '2:30 PM'
      },
      {
        id: '2',
        sender: 'me',
        text: 'Indeed they do. I've been capturing them all week.',
        time: '2:31 PM'
      },
      {
        id: '3',
        sender: 'them',
        text: 'Would love to see your latest work.',
        time: '2:32 PM'
      }
    ]
  };

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={chat.user.avatar}
              alt={chat.user.name}
              className="w-10 h-10 rounded-full grayscale hover:grayscale-0 transition-all"
            />
            {chat.user.online && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-900" />
            )}
          </div>
          <div>
            <h3 className="text-zinc-200 font-medium">{chat.user.name}</h3>
            <p className="text-xs text-zinc-500">
              {chat.user.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-zinc-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${msg.sender === 'me' ? 'bg-zinc-700' : 'bg-zinc-800'} rounded-lg p-3`}>
              <p className="text-zinc-200">{msg.text}</p>
              <p className="text-xs text-zinc-500 mt-1">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <Image className="w-5 h-5 text-zinc-400" />
          </button>
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-zinc-400" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};