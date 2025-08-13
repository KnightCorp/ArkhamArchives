import React, { useState } from 'react';
import { Users, UserCheck, Package, DollarSign, Link, Copy, Share2, TrendingUp } from 'lucide-react';
import { useReferralData } from '../../hooks/useReferralData';

export const Referrals = () => {
  const { data, loading, error, copyReferralLink, shareReferralLink } = useReferralData();
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleCopyLink = async () => {
    if (data?.referralLink) {
      const success = await copyReferralLink(data.referralLink);
      if (success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };

  const handleShareLink = async () => {
    if (data?.referralLink) {
      const success = await shareReferralLink(data.referralLink);
      if (success) {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Loading referral data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">No referral data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-6 h-6 text-zinc-400" />
            <h3 className="text-lg text-zinc-200">Total Users</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {data.stats.totalUsers.toLocaleString()}
          </div>
          <div className="flex items-center text-emerald-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+12% this month</span>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center space-x-3 mb-4">
            <UserCheck className="w-6 h-6 text-zinc-400" />
            <h3 className="text-lg text-zinc-200">Active Users</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {data.stats.activeUsers.toLocaleString()}
          </div>
          <div className="flex items-center text-emerald-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+8% this month</span>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center space-x-3 mb-4">
            <Package className="w-6 h-6 text-zinc-400" />
            <h3 className="text-lg text-zinc-200">Packs Bought</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {data.stats.packsBought.toLocaleString()}
          </div>
          <div className="flex items-center text-emerald-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+25% this month</span>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="w-6 h-6 text-zinc-400" />
            <h3 className="text-lg text-zinc-200">Revenue Generated</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            ${data.stats.revenueGenerated.toLocaleString()}
          </div>
          <div className="flex items-center text-emerald-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+18% this month</span>
          </div>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <div className="flex items-center space-x-3 mb-6">
          <Link className="w-6 h-6 text-zinc-400" />
          <h2 className="text-xl text-zinc-200">Your Unique Referral Link</h2>
        </div>
        
        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            value={data.referralLink}
            readOnly
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-200 font-mono"
          />
          <button
            onClick={handleCopyLink}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              copySuccess 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            <Copy className="w-5 h-5" />
            <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
          </button>
          <button 
            onClick={handleShareLink}
            className={`flex items-center space-x-2 px-6 py-3 border border-zinc-700 rounded-lg transition-colors ${
              shareSuccess
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
            }`}
          >
            <Share2 className="w-5 h-5" />
            <span>{shareSuccess ? 'Shared!' : 'Share'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-white mb-1">{data.commissionRate}%</div>
            <div className="text-zinc-400 text-sm">Commission Rate</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-white mb-1">30</div>
            <div className="text-zinc-400 text-sm">Days Cookie Duration</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-white mb-1">$25</div>
            <div className="text-zinc-400 text-sm">Minimum Payout</div>
          </div>
        </div>
      </div>

      {/* Commission Stats */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
        <h2 className="text-xl text-zinc-200 mb-6">Commission Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-white mb-1">${data.commissions.totalEarned.toFixed(2)}</div>
            <div className="text-zinc-400 text-sm">Total Earned</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-white mb-1">${data.commissions.totalPaid.toFixed(2)}</div>
            <div className="text-zinc-400 text-sm">Total Paid Out</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-white mb-1">${data.commissions.availableBalance.toFixed(2)}</div>
            <div className="text-zinc-400 text-sm">Available Balance</div>
            {data.commissions.availableBalance >= 25 && (
              <div className="text-emerald-400 text-xs mt-1">Eligible for payout!</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-xl text-zinc-200">Recent Referrals</h2>
        </div>
        <div className="divide-y divide-zinc-800">
          {data.recentReferrals.length > 0 ? (
            data.recentReferrals.map((referral) => (
              <div key={referral.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-zinc-200 font-medium">{referral.name}</p>
                    <p className="text-sm text-zinc-400">
                      Joined {new Date(referral.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-zinc-200">{referral.packsPurchased}</div>
                    <div className="text-xs text-zinc-400">Packs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-zinc-200">${referral.revenue.toFixed(2)}</div>
                    <div className="text-xs text-zinc-400">Revenue</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    referral.status === 'Active' 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {referral.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <div className="flex items-center space-x-4">
                <Users className="w-12 h-12 text-zinc-400 mx-auto" />
              </div>
              <p className="text-zinc-400 mt-4">No referrals yet</p>
              <p className="text-zinc-500 text-sm mt-2">Share your referral link to start earning commissions!</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl text-zinc-200 mb-6">Referral Performance</h2>
        <div className="h-64 bg-zinc-800/50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
            <p className="text-zinc-400">Performance chart visualization</p>
            <p className="text-zinc-500 text-sm">Track your referral growth over time</p>
          </div>
        </div>
      </div>
    </div>
  );
};