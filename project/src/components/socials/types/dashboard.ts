export interface AdCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  reach: number;
  engagement: number;
  startDate: string;
  endDate: string;
  targetAudience: {
    age: [number, number];
    locations: string[];
    interests: string[];
  };
}

export interface FollowerInsight {
  total: number;
  growth: number;
  demographics: {
    age: Record<string, number>;
    location: Record<string, number>;
    interests: Record<string, number>;
  };
  engagement: {
    rate: number;
    trend: number;
  };
}

export interface ContentInsight {
  totalPosts: number;
  avgEngagement: number;
  topPerforming: {
    id: string;
    type: 'image' | 'video' | 'text';
    engagement: number;
    reach: number;
    thumbnail?: string;
  }[];
  performance: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}