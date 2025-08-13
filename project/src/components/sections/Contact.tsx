import React, { useRef, useState } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', message: string}>>([
    {type: 'bot', message: 'Hello! How can I assist you today?'}
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSending(true);
    try {
      await emailjs.sendForm(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        formRef.current,
        'YOUR_PUBLIC_KEY'
      );
      alert('Message sent successfully!');
      formRef.current.reset();
    } catch (error) {
      alert('Failed to send message. Please try again.');
    }
    setIsSending(false);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setChatHistory(prev => [...prev, {type: 'user', message: chatMessage}]);
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        type: 'bot',
        message: "I'm an AI assistant. While I can provide basic information, for specific inquiries please use the contact form to reach out to the team directly."
      }]);
    }, 1000);

    setChatMessage('');
  };

  return (
    <div className="section-container" id="contact">
      <video className="video-bg" autoPlay loop muted playsInline>
        <source src="https://player.vimeo.com/external/474716890.sd.mp4?s=b5c5f05dd4a32b3c4157c991b5ce44561dac1551&profile_id=164" type="video/mp4" />
      </video>
      
      <div className="section-content max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="glass rounded-lg p-8">
            <div className="flex items-center mb-6">
              <Mail className="w-8 h-8 text-white mr-4" />
              <h2 className="text-3xl font-bold">Contact Us</h2>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="user_name"
                  required
                  className="w-full p-3 bg-black/50 border border-white/10 rounded-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="user_email"
                  required
                  className="w-full p-3 bg-black/50 border border-white/10 rounded-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full p-3 bg-black/50 border border-white/10 rounded-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSending}
                className="cta-button w-full"
              >
                {isSending ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
          
          {/* Chatbot */}
          <div className="glass rounded-lg p-8">
            <div className="flex items-center mb-6">
              <MessageSquare className="w-8 h-8 text-white mr-4" />
              <h2 className="text-3xl font-bold">Chat with Us</h2>
            </div>
            
            <div className="h-[400px] flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-none ${
                        msg.type === 'user'
                          ? 'bg-red-900/50 ml-auto'
                          : 'bg-black/50'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 bg-black/50 border border-white/10 rounded-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                <button type="submit" className="cta-button px-4">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;