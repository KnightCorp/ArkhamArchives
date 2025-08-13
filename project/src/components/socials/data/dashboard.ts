import type { AdCampaign, FollowerInsight, ContentInsight } from '../types/dashboard';

export const adCampaigns: AdCampaign[] = [
  {
    id: 'camp_1',
    name: 'Summer Collection Launch',
    status: 'active',
    budget: 1000,
    spent: 450,
    reach: 25000,
    engagement: 2800,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    targetAudience: {
      age: [18, 35],
      locations: ['New York', 'Los Angeles', 'Chicago'],
      interests: ['Fashion', 'Photography', 'Art']
    }
  },
  {
    id: 'camp_2',
    name: 'Artist Collaboration',
    status: 'paused',
    budget: 500,
    spent: 200,
    reach: 12000,
    engagement: 1500,
    startDate: '2024-02-15',
    endDate: '2024-03-15',
    targetAudience: {
      age: [21, 45],
      locations: ['San Francisco', 'Seattle', 'Portland'],
      interests: ['Digital Art', 'NFTs', 'Crypto']
    }
  }
];

export const followerInsights: FollowerInsight = {
  total: 25000,
  growth: 12.5,
  demographics: {
    age: {
      '18-24': 30,
      '25-34': 45,
      '35-44': 15,
      '45+': 10
    },
    location: {
      'United States': 45,
      'United Kingdom': 15,
      'Germany': 12,
      'France': 8,
      'Other': 20
    },
    interests: {
      'Art & Design': 40,
      'Technology': 25,
      'Fashion': 20,
      'Music': 15
    }
  },
  engagement: {
    rate: 4.8,
    trend: 0.5
  }
};

export const contentInsights: ContentInsight = {
  totalPosts: 156,
  avgEngagement: 8.2,
  topPerforming: [
    {
      id: 'post_1',
      type: 'image',
      engagement: 12.5,
      reach: 15000,
      thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400'
    },
    {
      id: 'post_2',
      type: 'video',
      engagement: 10.8,
      reach: 12000,
      thumbnail: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400'
    }
  ],
  performance: {
    views: 128000,
    likes: 45000,
    comments: 8900,
    shares: 3200
  }
};