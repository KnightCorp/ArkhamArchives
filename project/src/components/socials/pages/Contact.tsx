import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto font-cormorant">
      <h1 className="text-3xl text-zinc-200 mb-8 font-light tracking-wide">Contact The Archives</h1>
      
      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <Mail className="w-8 h-8 text-white mb-4" />
          <h3 className="text-lg text-zinc-200 mb-2 font-light">Email</h3>
          <p className="text-zinc-400">inquiries@thearchives.noir</p>
        </div>
        
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <Phone className="w-8 h-8 text-white mb-4" />
          <h3 className="text-lg text-zinc-200 mb-2 font-light">Phone</h3>
          <p className="text-zinc-400">+1 (555) 123-4567</p>
        </div>
        
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <Clock className="w-8 h-8 text-white mb-4" />
          <h3 className="text-lg text-zinc-200 mb-2 font-light">Hours</h3>
          <p className="text-zinc-400">24/7 Support Available</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
        <h2 className="text-2xl text-zinc-200 mb-6 font-light tracking-wide">Send Us a Message</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-zinc-400 mb-2">Name</label>
              <input
                type="text"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 focus:border-white/20 transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 focus:border-white/20 transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-zinc-400 mb-2">Subject</label>
            <input
              type="text"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 focus:border-white/20 transition-colors"
              placeholder="How can we help?"
            />
          </div>
          
          <div>
            <label className="block text-zinc-400 mb-2">Message</label>
            <textarea
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 focus:border-white/20 transition-colors h-32"
              placeholder="Your message here..."
            />
          </div>
          
          <button className="px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center space-x-2">
            <Send className="w-5 h-5" />
            <span>Send Message</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;