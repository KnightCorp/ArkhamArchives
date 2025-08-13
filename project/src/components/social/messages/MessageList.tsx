import React from 'react';
import { Check } from 'lucide-react';

interface MessageListProps {
  activeChat: string | null;
  onChatSelect: (chatId: string) => void;
  searchQuery: string;
}

export const MessageList = ({ activeChat, onChatSelect, searchQuery }: MessageListProps) => {
  const conversations = [
    {
      id: '1',
      user: {
        name: 'Vincent Gray',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
        online: true
      },
      lastMessage: {
        text: 'The shadows tell stories...',
        time: '2m ago',
        unread: true
      }
    },
    {
      id: '2',
      user: {
        name: 'Nina Blake',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
        online: false
      },
      lastMessage: {
        text: 'Jazz session tonight?',
        time: '1h ago',
        unread: false
      }
    }
  ].filter(conv => 
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onChatSelect(conv.id)}
          className={`w-full p-4 flex items-center space-x-3 hover:bg-zinc-800/50 transition-colors ${
            activeChat === conv.id ? 'bg-zinc-800' : ''
          }`}
        >
          <div className="relative">
            <img
              src={conv.user.avatar}
              alt={conv.user.name}
              className="w-12 h-12 rounded-full grayscale hover:grayscale-0 transition-all"
            />
            {conv.user.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-900" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline">
              <h3 className="text-zinc-200 font-medium truncate">{conv.user.name}</h3>
              <span className="text-xs text-zinc-500 whitespace-nowrap ml-2">
                {conv.lastMessage.time}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {!conv.lastMessage.unread && (
                <Check className="w-4 h-4 text-zinc-500" />
              )}
              <p className={`text-sm truncate ${
                conv.lastMessage.unread ? 'text-zinc-200' : 'text-zinc-500'
              }`}>
                {conv.lastMessage.text}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};