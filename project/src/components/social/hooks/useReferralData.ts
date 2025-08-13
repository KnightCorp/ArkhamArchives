import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface ReferralStats {
  totalUsers: number;
  activeUsers: number;
  packsBought: number;
  revenueGenerated: number;
}

interface RecentReferral {
  id: number;
  name: string;
  joinDate: string;
  status: string;
  packsPurchased: number;
  revenue: number;
}

interface CommissionStats {
  totalEarned: number;
  totalPaid: number;
  availableBalance: number;
}

interface ReferralData {
  stats: ReferralStats;
  recentReferrals: RecentReferral[];
  commissions: CommissionStats;
  referralLink: string;
  commissionRate: number;
}

export const useReferralData = () => {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiService.isAuthenticated()) {
        setError('Please login to view referral data');
        return;
      }

      const response = await apiService.getReferralDashboard();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch referral data');
      console.error('Referral data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const copyReferralLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      return true;
    } catch (err) {
      console.error('Failed to copy referral link:', err);
      return false;
    }
  };

  const shareReferralLink = async (link: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on this platform!',
          text: 'Check out this amazing platform and get started with my referral link.',
          url: link
        });
        return true;
      } catch (err) {
        console.error('Failed to share referral link:', err);
        return false;
      }
    } else {
      // Fallback to copying
      return copyReferralLink(link);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchReferralData,
    copyReferralLink,
    shareReferralLink
  };
};
