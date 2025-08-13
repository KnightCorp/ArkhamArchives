import React, { useState, useEffect } from 'react';

interface AnalyticsData {
  userGrowth: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  revenueData: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  referralData: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  topReferrers: Array<{
    name: string;
    referrals: number;
    earnings: number;
  }>;
  conversionRates: {
    signup_to_referral: number;
    referral_to_purchase: number;
    purchase_to_repeat: number;
  };
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3001/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to fetch analytics data');
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

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No analytics data available</p>
      </div>
    );
  }

  const MetricCard = ({ title, value, change, icon }: {
    title: string;
    value: string | number;
    change?: string;
    icon: string;
  }) => (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="text-2xl font-semibold text-zinc-200">{value}</p>
          {change && (
            <p className="text-sm text-zinc-500">{change}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-zinc-200">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          {(['daily', 'weekly', 'monthly'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                timeframe === period
                  ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-300'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="User Growth"
          value={`${analyticsData?.userGrowth?.[timeframe]?.reduce((a, b) => a + b, 0) || 0}`}
          change={`${timeframe} growth`}
          icon="📈"
        />
        <MetricCard
          title="Revenue"
          value={`$${(analyticsData?.revenueData?.[timeframe]?.reduce((a, b) => a + b, 0) || 0).toFixed(2)}`}
          change={`${timeframe} revenue`}
          icon="💰"
        />
        <MetricCard
          title="Referrals"
          value={`${analyticsData?.referralData?.[timeframe]?.reduce((a, b) => a + b, 0) || 0}`}
          change={`${timeframe} referrals`}
          icon="🔗"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${(typeof analyticsData?.conversionRates?.signup_to_referral === 'number' ? analyticsData.conversionRates.signup_to_referral.toFixed(1) : '0')}%`}
          change="Signup to referral"
          icon="🎯"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h3 className="text-lg font-medium text-zinc-200 mb-4">User Growth</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData?.userGrowth?.[timeframe]?.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-zinc-700 rounded-t"
                  style={{ height: `${Math.max((value / Math.max(...analyticsData.userGrowth[timeframe])) * 200, 4)}px` }}
                ></div>
                <span className="text-xs text-zinc-400 mt-2">{value}</span>
              </div>
            )) || Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-zinc-700 rounded-t" style={{ height: '4px' }}></div>
                <span className="text-xs text-zinc-400 mt-2">0</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h3 className="text-lg font-medium text-zinc-200 mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData?.revenueData?.[timeframe]?.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-zinc-700 rounded-t"
                  style={{ height: `${Math.max((value / Math.max(...analyticsData.revenueData[timeframe])) * 200, 4)}px` }}
                ></div>
                <span className="text-xs text-zinc-400 mt-2">${(typeof value === 'number' ? value.toFixed(2) : '0.00')}</span>
              </div>
            )) || Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-zinc-700 rounded-t" style={{ height: '4px' }}></div>
                <span className="text-xs text-zinc-400 mt-2">$0.00</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Referrers */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h3 className="text-lg font-medium text-zinc-200 mb-4">Top Referrers</h3>
        <div className="space-y-4">
          {analyticsData?.topReferrers?.map((referrer, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
              <div className="flex items-center">
                <span className="text-lg font-medium text-zinc-400 mr-3">#{index + 1}</span>
                <div>
                  <p className="font-medium text-zinc-200">{referrer.name}</p>
                  <p className="text-sm text-zinc-400">{referrer.referrals} referrals</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-zinc-200">${(typeof referrer.earnings === 'number' ? referrer.earnings.toFixed(2) : '0.00')}</p>
                <p className="text-sm text-zinc-400">earned</p>
              </div>
            </div>
          )) || (
            <div className="text-center py-8">
              <p className="text-zinc-400">No referral data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Conversion Rates */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h3 className="text-lg font-medium text-zinc-200 mb-4">Conversion Rates</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-zinc-200">
              {typeof analyticsData?.conversionRates?.signup_to_referral === 'number' ? analyticsData.conversionRates.signup_to_referral.toFixed(1) : '0'}%
            </div>
            <div className="text-sm text-zinc-400">Signup to Referral</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-zinc-200">
              {typeof analyticsData?.conversionRates?.referral_to_purchase === 'number' ? analyticsData.conversionRates.referral_to_purchase.toFixed(1) : '0'}%
            </div>
            <div className="text-sm text-zinc-400">Referral to Purchase</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-zinc-200">
              {typeof analyticsData?.conversionRates?.purchase_to_repeat === 'number' ? analyticsData.conversionRates.purchase_to_repeat.toFixed(1) : '0'}%
            </div>
            <div className="text-sm text-zinc-400">Repeat Purchases</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 