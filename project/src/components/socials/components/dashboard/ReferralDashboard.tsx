import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Users, 
  DollarSign, 
  Award, 
  Copy, 
  Check, 
  TrendingUp, 
  Calendar,
  ExternalLink,
  User,
  Mail,
  Clock
} from 'lucide-react';
import { apiService } from '../../services/api';

interface ReferralStats {
  totalReferrals: number;
  totalEarnings: number;
  availableBalance: number;
  thisMonthReferrals: number;
  thisMonthEarnings: number;
  conversionRate: number;
}

interface ReferredUser {
  id: number;
  name: string;
  email: string;
  joinedAt: string;
  isActive: boolean;
  totalSpent: number;
  commissionEarned: number;
}

interface EarningsHistory {
  id: number;
  amount: number;
  date: string;
  referredUserName: string;
  description: string;
}

const ReferralDashboard = () => {
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralLink, setReferralLink] = useState<string>('');
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    totalEarnings: 0,
    availableBalance: 0,
    thisMonthReferrals: 0,
    thisMonthEarnings: 0,
    conversionRate: 0
  });
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [earningsHistory, setEarningsHistory] = useState<EarningsHistory[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'earnings'>('overview');

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated first
      if (!apiService.isAuthenticated()) {
        console.log('User not authenticated, showing login required message');
        // Set empty state and show login message
        setReferralCode('');
        setReferralLink('');
        setStats({
          totalReferrals: 0,
          totalEarnings: 0,
          availableBalance: 0,
          thisMonthReferrals: 0,
          thisMonthEarnings: 0,
          conversionRate: 0
        });
        return;
      }
      
      // Fetch referral code
      const codeResponse = await apiService.getReferralCode();
      if (codeResponse.code) {
        setReferralCode(codeResponse.code);
        setReferralLink(`${window.location.origin}/socials?ref=${codeResponse.code}`);
      }
      
      // Fetch referral stats
      const statsResponse = await apiService.getReferralStats();
      setStats(statsResponse);
      
      // Fetch referred users
      const usersResponse = await apiService.getReferredUsers();
      setReferredUsers(usersResponse);
      
      // Fetch earnings history
      const earningsResponse = await apiService.getEarningsHistory();
      setEarningsHistory(earningsResponse);
      
    } catch (error) {
      console.error('Error fetching referral data:', error);
      
      // Show error to user instead of fake data
      const user = apiService.getCurrentUser();
      if (user && user.referralCode) {
        setReferralCode(user.referralCode);
        setReferralLink(`${window.location.origin}/socials?ref=${user.referralCode}`);
      } else {
        // If no auth token, show message
        if (!apiService.isAuthenticated()) {
          setReferralCode('');
          setReferralLink('');
        } else {
          // Generate new referral code if user doesn't have one
          try {
            const newCodeResponse = await apiService.generateReferralCode();
            if (newCodeResponse.code) {
              setReferralCode(newCodeResponse.code);
              setReferralLink(`${window.location.origin}/socials?ref=${newCodeResponse.code}`);
            }
          } catch (generateError) {
            console.error('Error generating referral code:', generateError);
            // Set placeholder if everything fails
            setReferralCode('LOGIN_REQUIRED');
            setReferralLink('Please login to get your referral link');
          }
        }
      }
      
      // Set empty states instead of fake data
      setStats({
        totalReferrals: 0,
        totalEarnings: 0,
        availableBalance: 0,
        thisMonthReferrals: 0,
        thisMonthEarnings: 0,
        conversionRate: 0
      });
      
      setReferredUsers([]);
      setEarningsHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join The Archives',
          text: 'Join me on The Archives and get exclusive access to premium content!',
          url: referralLink
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard(referralLink);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-2xl text-zinc-200 mb-4 font-light tracking-wide">Your Referral Dashboard</h2>
        <p className="text-zinc-400">
          Share your unique link and earn 5% commission on every successful referral!
        </p>
      </div>

      {/* Referral Link Section */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h3 className="text-xl text-zinc-200 mb-4 font-light">Your Referral Link</h3>
        {!apiService.isAuthenticated() ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <Share2 className="w-12 h-12 text-zinc-600 mx-auto mb-2" />
              <p className="text-zinc-400 text-lg mb-2">Please login to access your referral link</p>
              <p className="text-zinc-500 text-sm">You need to be logged in to generate and share your unique referral link.</p>
            </div>
          </div>
        ) : referralCode ? (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex rounded-lg overflow-hidden border border-zinc-700">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-zinc-800 px-4 py-3 text-zinc-200 text-sm focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(referralLink)}
                  className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600 transition-colors text-zinc-200"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={shareReferralLink}
                className="flex items-center px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button
                onClick={() => copyToClipboard(referralCode)}
                className="flex items-center px-6 py-3 border border-zinc-600 text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <Copy className="w-4 h-4 mr-2" />
                Code: {referralCode}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mb-4">
              <Share2 className="w-12 h-12 text-zinc-600 mx-auto mb-2" />
              <p className="text-zinc-400 text-lg mb-2">Generating your referral link...</p>
              <p className="text-zinc-500 text-sm">Please wait while we create your unique referral code.</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-400" />
            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">Total</span>
          </div>
          <p className="text-3xl text-white mb-1 font-light">{stats.totalReferrals}</p>
          <p className="text-zinc-400 text-sm">Referrals</p>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-400" />
            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">Total</span>
          </div>
          <p className="text-3xl text-white mb-1 font-light">${stats.totalEarnings.toFixed(2)}</p>
          <p className="text-zinc-400 text-sm">Earnings</p>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-yellow-400" />
            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">Available</span>
          </div>
          <p className="text-3xl text-white mb-1 font-light">${stats.availableBalance.toFixed(2)}</p>
          <p className="text-zinc-400 text-sm">Balance</p>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">Rate</span>
          </div>
          <p className="text-3xl text-white mb-1 font-light">{stats.conversionRate}%</p>
          <p className="text-zinc-400 text-sm">Conversion</p>
        </div>
      </div>

      {/* This Month Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 text-blue-400 mr-3" />
            <h3 className="text-lg text-zinc-200 font-light">This Month</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-zinc-400">New Referrals:</span>
              <span className="text-white font-medium">{stats.thisMonthReferrals}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Earnings:</span>
              <span className="text-green-400 font-medium">${stats.thisMonthEarnings.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center mb-4">
            <ExternalLink className="w-6 h-6 text-purple-400 mr-3" />
            <h3 className="text-lg text-zinc-200 font-light">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <button 
              onClick={shareReferralLink}
              className="w-full text-left p-2 rounded hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white"
            >
              Share Referral Link
            </button>
            <button 
              onClick={() => copyToClipboard(referralCode)}
              className="w-full text-left p-2 rounded hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white"
            >
              Copy Referral Code
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800">
        <div className="flex border-b border-zinc-800">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'users', label: 'Referred Users', icon: Users },
            { id: 'earnings', label: 'Earnings History', icon: DollarSign }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center px-6 py-4 transition-colors ${
                activeTab === id 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg text-zinc-200 mb-4 font-light">Performance Overview</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-zinc-800/50 rounded-lg">
                    <p className="text-2xl text-white mb-1">{stats.totalReferrals}</p>
                    <p className="text-zinc-400 text-sm">Total Referrals</p>
                  </div>
                  <div className="p-4 bg-zinc-800/50 rounded-lg">
                    <p className="text-2xl text-green-400 mb-1">${stats.totalEarnings.toFixed(2)}</p>
                    <p className="text-zinc-400 text-sm">Total Earned</p>
                  </div>
                  <div className="p-4 bg-zinc-800/50 rounded-lg">
                    <p className="text-2xl text-purple-400 mb-1">{stats.conversionRate}%</p>
                    <p className="text-zinc-400 text-sm">Conversion Rate</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h4 className="text-lg text-zinc-200 mb-4 font-light">Your Referred Users</h4>
              {referredUsers.length > 0 ? (
                <div className="space-y-4">
                  {referredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center mr-4">
                          <User className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <h5 className="text-zinc-200 font-medium">{user.name}</h5>
                          <p className="text-zinc-400 text-sm flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </p>
                          <p className="text-zinc-500 text-xs flex items-center mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            Joined {new Date(user.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-zinc-200 font-medium">${user.commissionEarned.toFixed(2)}</p>
                        <p className="text-zinc-400 text-sm">Commission</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          user.isActive ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400">No referred users yet</p>
                  <p className="text-zinc-500 text-sm">Share your referral link to get started!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'earnings' && (
            <div>
              <h4 className="text-lg text-zinc-200 mb-4 font-light">Earnings History</h4>
              {earningsHistory.length > 0 ? (
                <div className="space-y-4">
                  {earningsHistory.map((earning) => (
                    <div key={earning.id} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-900 rounded-full flex items-center justify-center mr-4">
                          <DollarSign className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h5 className="text-zinc-200 font-medium">${earning.amount.toFixed(2)}</h5>
                          <p className="text-zinc-400 text-sm">{earning.description}</p>
                          <p className="text-zinc-500 text-xs">From: {earning.referredUserName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-zinc-400 text-sm">{new Date(earning.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400">No earnings yet</p>
                  <p className="text-zinc-500 text-sm">Start referring users to see your earnings here!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;
