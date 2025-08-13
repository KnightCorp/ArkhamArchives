import React from 'react';
import { Share2, Users, DollarSign, Award } from 'lucide-react';

const Referral = () => {
  return (
    <div className="max-w-4xl mx-auto font-cormorant">
      <h1 className="text-3xl text-zinc-200 mb-8 font-light tracking-wide">The Archives Referral Program</h1>
      
      {/* Program Overview */}
      <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800 mb-8">
        <h2 className="text-2xl text-zinc-200 mb-6 font-light tracking-wide">Earn While You Share</h2>
        <p className="text-zinc-400 mb-8 text-lg">
          Join our exclusive referral program and earn 5% commission on every successful referral. 
          Share the knowledge, expand The Archives network, and be rewarded for your contribution.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-800/50 rounded-lg">
            <Share2 className="w-8 h-8 text-white mb-4" />
            <h3 className="text-lg text-zinc-200 mb-2 font-light">Share</h3>
            <p className="text-zinc-400">Share your unique referral link with potential members</p>
          </div>
          
          <div className="p-6 bg-zinc-800/50 rounded-lg">
            <Users className="w-8 h-8 text-white mb-4" />
            <h3 className="text-lg text-zinc-200 mb-2 font-light">Connect</h3>
            <p className="text-zinc-400">New members join using your referral code</p>
          </div>
          
          <div className="p-6 bg-zinc-800/50 rounded-lg">
            <DollarSign className="w-8 h-8 text-white mb-4" />
            <h3 className="text-lg text-zinc-200 mb-2 font-light">Earn</h3>
            <p className="text-zinc-400">Receive 5% commission on their subscription</p>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800 mb-8">
        <h2 className="text-2xl text-zinc-200 mb-6 font-light tracking-wide">Your Referral Link</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            value="https://thearchives.noir/ref/YOUR_CODE"
            readOnly
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200"
          />
          <button className="px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors">
            Copy Link
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
        <h2 className="text-2xl text-zinc-200 mb-6 font-light tracking-wide">Your Referral Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-800/50 rounded-lg">
            <p className="text-3xl text-white mb-2 font-light">0</p>
            <p className="text-zinc-400">Total Referrals</p>
          </div>
          
          <div className="p-6 bg-zinc-800/50 rounded-lg">
            <p className="text-3xl text-white mb-2 font-light">$0.00</p>
            <p className="text-zinc-400">Total Earnings</p>
          </div>
          
          <div className="p-6 bg-zinc-800/50 rounded-lg">
            <p className="text-3xl text-white mb-2 font-light">$0.00</p>
            <p className="text-zinc-400">Available Balance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;