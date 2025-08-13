import React from 'react';
import { Camera, Mail, AtSign, MapPin } from 'lucide-react';

export const ProfileInfo = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-8">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1492288991661-058aa541ff43?w=150&h=150&fit=crop"
            alt="Profile"
            className="w-32 h-32 rounded-full grayscale hover:grayscale-0 transition-all"
          />
          <button className="absolute bottom-0 right-0 p-2 bg-zinc-900 rounded-full metallic-shine">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Display Name</label>
            <input
              type="text"
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white w-full"
              placeholder="Your display name"
            />
          </div>
          
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Bio</label>
            <textarea
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white w-full"
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          <input
            type="email"
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            <AtSign className="w-4 h-4 inline mr-2" />
            Username
          </label>
          <input
            type="text"
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            <MapPin className="w-4 h-4 inline mr-2" />
            Location
          </label>
          <input
            type="text"
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white w-full"
          />
        </div>
      </div>

      <button className="px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors">
        Save Changes
      </button>
    </div>
  );
};