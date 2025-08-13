import React, { useState } from 'react';
import { Send, Search, Book, Brain } from 'lucide-react';

export const ExamChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your exam prep assistant. What would you like to study today?' }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [
      ...prev,
      { role: 'user', content: message },
      { role: 'assistant', content: 'This is a mock response. In production, this would be connected to an AI service.' }
    ]);
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Resource Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-matrix/50" />
        <input
          type="text"
          placeholder="Search study resources..."
          className="w-full bg-black/50 border border-matrix/30 rounded-lg pl-12 pr-4 py-3 text-matrix placeholder-matrix/30 focus:outline-none focus:border-matrix/50 font-code"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code">
          <Book className="w-5 h-5" />
          <span>Study Materials</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code">
          <Brain className="w-5 h-5" />
          <span>Practice Tests</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="h-[400px] overflow-y-auto space-y-4 pr-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-lg ${
              msg.role === 'user'
                ? 'bg-matrix/10 text-matrix border border-matrix/30'
                : 'bg-black/50 text-matrix/90 border border-matrix/20'
            } font-code`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex space-x-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything about your studies..."
          className="flex-1 bg-black/50 border border-matrix/30 rounded-lg px-4 py-3 text-matrix placeholder-matrix/30 focus:outline-none focus:border-matrix/50 font-code"
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="px-6 py-3 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-code"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};