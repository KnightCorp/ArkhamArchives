import React, { useState, useEffect } from 'react';

interface Activity {
  id: number;
  type: 'user_registration' | 'referral' | 'purchase' | 'payout' | 'admin_action';
  description: string;
  user_name?: string;
  user_email?: string;
  amount?: number;
  created_at: string;
  metadata?: any;
}

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'user_registration' | 'referral' | 'purchase' | 'payout' | 'admin_action'>('all');

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3001/api/admin/activity', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      } else {
        setError('Failed to fetch recent activity');
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setError('Failed to fetch recent activity');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return '👤';
      case 'referral': return '🔗';
      case 'purchase': return '💰';
      case 'payout': return '💸';
      case 'admin_action': return '⚙️';
      default: return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_registration': return 'text-blue-200';
      case 'referral': return 'text-green-200';
      case 'purchase': return 'text-yellow-200';
      case 'payout': return 'text-purple-200';
      case 'admin_action': return 'text-red-200';
      default: return 'text-zinc-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const activityDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return activityDate.toLocaleDateString();
  };

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.type === filter
  );

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-zinc-200">Recent Activity</h2>
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
          >
            <option value="all">All Activities</option>
            <option value="user_registration">User Registrations</option>
            <option value="referral">Referrals</option>
            <option value="purchase">Purchases</option>
            <option value="payout">Payouts</option>
            <option value="admin_action">Admin Actions</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-zinc-200 mb-2">No Recent Activity</h3>
            <p className="text-zinc-400">No activities match the current filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-zinc-800 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                      <span className="text-lg">{getActivityIcon(activity.type)}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                        {activity.description}
                      </p>
                      <span className="text-xs text-zinc-400">
                        {formatTimeAgo(activity.created_at)}
                      </span>
                    </div>
                    {activity.user_name && (
                      <p className="text-sm text-zinc-400 mt-1">
                        User: {activity.user_name} {activity.user_email && `(${activity.user_email})`}
                      </p>
                    )}
                    {activity.amount && (
                      <p className="text-sm text-zinc-400 mt-1">
                        Amount: ${activity.amount.toFixed(2)}
                      </p>
                    )}
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="mt-2 text-xs text-zinc-500">
                        {Object.entries(activity.metadata).map(([key, value]) => (
                          <div key={key}>
                            {key}: {String(value)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Summary */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-200 mb-3">Activity Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-zinc-200">
              {activities.filter(a => a.type === 'user_registration').length}
            </div>
            <div className="text-xs text-zinc-400">Registrations</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-200">
              {activities.filter(a => a.type === 'referral').length}
            </div>
            <div className="text-xs text-zinc-400">Referrals</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-200">
              {activities.filter(a => a.type === 'purchase').length}
            </div>
            <div className="text-xs text-zinc-400">Purchases</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-200">
              {activities.filter(a => a.type === 'payout').length}
            </div>
            <div className="text-xs text-zinc-400">Payouts</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-200">
              {activities.filter(a => a.type === 'admin_action').length}
            </div>
            <div className="text-xs text-zinc-400">Admin Actions</div>
          </div>
        </div>
      </div>

      {/* Real-time Updates Info */}
      <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-200">Real-time Updates</h3>
            <p className="text-sm text-blue-300 mt-1">
              Activity feed updates automatically. New activities will appear at the top of the list.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity; 