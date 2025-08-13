import React, { useState } from 'react';
import { Send, Image, Paperclip, MoreVertical, Eye, Users, Lock } from 'lucide-react';

interface ChatWindowProps {
  chatId: string;
  isGroup?: boolean;
}

export const ChatWindow = ({ chatId, isGroup }: ChatWindowProps) => {
  const [message, setMessage] = useState('');
  const [isHiddenMessage, setIsHiddenMessage] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Mock chat data
  const chat = {
    user: {
      name: 'Court Member',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
      online: true
    },
    messages: [
      {
        id: '1',
        sender: 'them',
        text: 'The shadows tell stories...',
        time: '2:30 PM',
        isHidden: false,
        seenBy: ['user1', 'user2']
      },
      {
        id: '2',
        sender: 'me',
        text: 'Indeed they do. I\'ve been capturing them all week.',
        time: '2:31 PM',
        isHidden: true,
        seenBy: ['user1']
      },
      {
        id: '3',
        sender: 'them',
        text: 'Would love to see your latest work.',
        time: '2:32 PM',
        isHidden: false,
        seenBy: []
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
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={chat.user.avatar}
              alt={chat.user.name}
              className="w-10 h-10 rounded-full grayscale hover:grayscale-0 transition-all"
            />
            {chat.user.online && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-zinc-900" />
            )}
          </div>
          <div>
            <h3 className="text-zinc-200 font-medium">{chat.user.name}</h3>
            <p className="text-xs text-zinc-500">
              {chat.user.online ? 'Watching' : 'Away'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isGroup && (
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <Users className="w-5 h-5 text-amber-500/70" />
            </button>
          )}
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-amber-500/70" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1920&h=1080&auto=format&fit=crop&q=80')] bg-cover bg-center">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${
              msg.sender === 'me' 
                ? 'bg-amber-500/10 border border-amber-500/20' 
                : 'bg-zinc-800/90'
              } rounded-lg p-3`}
            >
              {msg.isHidden && (
                <div className="flex items-center space-x-1 mb-1 text-amber-500/70">
                  <Lock className="w-3 h-3" />
                  <span className="text-xs">Hidden Message</span>
                </div>
              )}
              <p className="text-zinc-200">{msg.text}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-zinc-500">{msg.time}</p>
                {msg.seenBy.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-amber-500/70" />
                    <span className="text-xs text-amber-500/70">{msg.seenBy.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/90">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsHiddenMessage(!isHiddenMessage)}
              className={`p-2 rounded-lg transition-colors ${
                isHiddenMessage ? 'bg-amber-500/20 text-amber-500' : 'hover:bg-zinc-800 text-zinc-400'
              }`}
            >
              <Lock className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`p-2 rounded-lg transition-colors ${
                isAnonymous ? 'bg-amber-500/20 text-amber-500' : 'hover:bg-zinc-800 text-zinc-400'
              }`}
            >
              <Users className="w-5 h-5" />
            </button>
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`${isAnonymous ? 'Send anonymous message...' : 'Type a message...'}`}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2 bg-amber-500/20 text-amber-500 rounded-lg hover:bg-amber-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};