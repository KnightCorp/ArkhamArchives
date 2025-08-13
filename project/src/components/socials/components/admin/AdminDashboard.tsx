import React, { useState, useEffect } from 'react';
import Analytics from './Analytics';
import PayoutManagement from './PayoutManagement';
import RecentActivity from './RecentActivity';
import UserManagement from './UserManagement';
import { ChevronDown, ChevronUp, BarChart3, Users, DollarSign, Activity } from 'lucide-react';

interface PlatformStats {
  userStats: {
    total_users: number;
    total_influencers: number;
    total_admins: number;
    active_users_30d: number;
    active_users_7d: number;
  };
  referralStats: {
    total_referrals: number;
    unique_referrers: number;
    unique_referred: number;
  };
  purchaseStats: {
    total_purchases: number;
    total_revenue: number;
    total_packs_sold: number;
    avg_purchase_amount: number;
  };
  commissionStats: {
    total_commissions: number;
    total_paid_out: number;
    total_pending: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    analytics: true,
    payouts: true,
    activity: true,
    users: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const CollapsibleSection = ({ 
    id, 
    title, 
    icon: Icon, 
    children 
  }: { 
    id: string; 
    title: string; 
    icon: React.ComponentType<any>; 
    children: React.ReactNode; 
  }) => (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
      <button
        onClick={() => toggleSection(id)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-zinc-800 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-zinc-400" />
          <h3 className="text-lg font-medium text-zinc-200">{title}</h3>
        </div>
        {expandedSections[id] ? (
          <ChevronUp className="w-5 h-5 text-zinc-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-zinc-400" />
        )}
      </button>
      {expandedSections[id] && (
        <div className="border-t border-zinc-800">
          {children}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    fetchPlatformStats();
  }, []);

  const fetchPlatformStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3001/api/admin/stats/overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Failed to fetch platform statistics');
      }
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      setError('Failed to fetch platform statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-200"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800/30 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-200">Error</h3>
            <p className="text-sm text-red-300 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No data available</p>
      </div>
    );
  }

  const StatCard = ({ title, value, subtitle, icon, color }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
    color: string;
  }) => (
    <div className={`bg-zinc-900 overflow-hidden shadow rounded-lg border-l-4 ${color} border border-zinc-800`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-zinc-400 truncate">{title}</dt>
              <dd className="text-lg font-medium text-zinc-200">{value}</dd>
              {subtitle && (
                <dd className="text-sm text-zinc-500">{subtitle}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div>
        <h2 className="text-lg font-medium text-zinc-200 mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats?.userStats?.total_users?.toLocaleString() || '0'}
            subtitle={`${stats?.userStats?.active_users_30d || 0} active (30d)`}
            icon="👥"
            color="border-zinc-400"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats?.purchaseStats?.total_revenue?.toFixed(2) || '0.00'}`}
            subtitle={`${stats?.purchaseStats?.total_purchases || 0} purchases`}
            icon="💰"
            color="border-zinc-400"
          />
          <StatCard
            title="Total Referrals"
            value={stats?.referralStats?.total_referrals?.toLocaleString() || '0'}
            subtitle={`${stats?.referralStats?.unique_referrers || 0} referrers`}
            icon="🔗"
            color="border-zinc-400"
          />
          <StatCard
            title="Pending Payouts"
            value={`$${stats?.commissionStats?.total_pending?.toFixed(2) || '0.00'}`}
            subtitle={`$${stats?.commissionStats?.total_paid_out?.toFixed(2) || '0.00'} paid out`}
            icon="💸"
            color="border-zinc-400"
          />
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Statistics */}
        <div className="bg-zinc-900 shadow rounded-lg p-6 border border-zinc-800">
          <h3 className="text-lg font-medium text-zinc-200 mb-4">User Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Total Users</span>
              <span className="font-medium text-zinc-200">{stats?.userStats?.total_users?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Active Users (30 days)</span>
              <span className="font-medium text-zinc-200">{stats?.userStats?.active_users_30d?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Active Users (7 days)</span>
              <span className="font-medium text-zinc-200">{stats?.userStats?.active_users_7d?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Influencers</span>
              <span className="font-medium text-zinc-200">{stats?.userStats?.total_influencers?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Admins</span>
              <span className="font-medium text-zinc-200">{stats?.userStats?.total_admins?.toLocaleString() || '0'}</span>
            </div>
          </div>
        </div>

        {/* Financial Statistics */}
        <div className="bg-zinc-900 shadow rounded-lg p-6 border border-zinc-800">
          <h3 className="text-lg font-medium text-zinc-200 mb-4">Financial Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Total Revenue</span>
              <span className="font-medium text-zinc-200">${stats?.purchaseStats?.total_revenue?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Total Purchases</span>
              <span className="font-medium text-zinc-200">{stats?.purchaseStats?.total_purchases?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Average Purchase</span>
              <span className="font-medium text-zinc-200">${stats?.purchaseStats?.avg_purchase_amount?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Packs Sold</span>
              <span className="font-medium text-zinc-200">{stats?.purchaseStats?.total_packs_sold?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Total Commissions</span>
              <span className="font-medium text-zinc-200">${stats?.commissionStats?.total_commissions?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Statistics */}
      <div className="bg-zinc-900 shadow rounded-lg p-6 border border-zinc-800">
        <h3 className="text-lg font-medium text-zinc-200 mb-4">Referral Statistics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-200">{stats?.referralStats?.total_referrals?.toLocaleString() || '0'}</div>
            <div className="text-sm text-zinc-400">Total Referrals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-200">{stats?.referralStats?.unique_referrers?.toLocaleString() || '0'}</div>
            <div className="text-sm text-zinc-400">Unique Referrers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-200">{stats?.referralStats?.unique_referred?.toLocaleString() || '0'}</div>
            <div className="text-sm text-zinc-400">Referred Users</div>
          </div>
        </div>
      </div>

      {/* Admin Management Sections */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-zinc-200 mb-6">Admin Management</h2>
        
        {/* Analytics Section */}
        <CollapsibleSection
          id="analytics"
          title="Analytics & Reports"
          icon={BarChart3}
        >
          <div className="p-6">
            <Analytics />
          </div>
        </CollapsibleSection>

        {/* Payout Management Section */}
        <CollapsibleSection
          id="payouts"
          title="Payout Management"
          icon={DollarSign}
        >
          <div className="p-6">
            <PayoutManagement />
          </div>
        </CollapsibleSection>

        {/* Recent Activity Section */}
        <CollapsibleSection
          id="activity"
          title="Recent Activity"
          icon={Activity}
        >
          <div className="p-6">
            <RecentActivity />
          </div>
        </CollapsibleSection>

        {/* User Management Section */}
        <CollapsibleSection
          id="users"
          title="User Management"
          icon={Users}
        >
          <div className="p-6">
            <UserManagement />
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default AdminDashboard; 