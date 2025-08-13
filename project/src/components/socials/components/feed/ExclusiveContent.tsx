import React, { useState } from 'react';
import { Crown, Lock, Star, Heart, MessageCircle, Share2, Settings, Search, Users } from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  avatar: string;
  subscriptionPrice: number;
  isSubscribed: boolean;
  exclusiveFollowers: number;
  tier?: 'basic' | 'premium' | 'vip';
}

interface ExclusivePost {
  id: string;
  creator: Creator;
  content: {
    image?: string;
    text: string;
  };
  likes: number;
  comments: number;
  timestamp: string;
}

const creators: Creator[] = [
  {
    id: '1',
    name: 'Vincent Gray',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    subscriptionPrice: 15.99,
    isSubscribed: true,
    exclusiveFollowers: 1247,
    tier: 'premium'
  },
  {
    id: '2',
    name: 'Nina Blake',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    subscriptionPrice: 8.99,
    isSubscribed: false,
    exclusiveFollowers: 892,
    tier: 'basic'
  },
  {
    id: '3',
    name: 'Marcus Stone',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop',
    subscriptionPrice: 22.50,
    isSubscribed: true,
    exclusiveFollowers: 2156,
    tier: 'vip'
  },
  {
    id: '4',
    name: 'Clara Night',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop',
    subscriptionPrice: 12.00,
    isSubscribed: false,
    exclusiveFollowers: 743,
    tier: 'basic'
  },
  {
    id: '5',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    subscriptionPrice: 18.99,
    isSubscribed: false,
    exclusiveFollowers: 1589,
    tier: 'premium'
  }
];

const exclusivePosts: ExclusivePost[] = [
  {
    id: '1',
    creator: creators[0],
    content: {
      image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800',
      text: 'Behind the scenes of my latest noir photography series. This exclusive shot was taken during the golden hour in the abandoned warehouse district.'
    },
    likes: 89,
    comments: 12,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    creator: creators[2],
    content: {
      text: 'Exclusive preview of my upcoming film project. Here\'s a snippet from the director\'s cut that won\'t be released publicly for another month.'
    },
    likes: 156,
    comments: 28,
    timestamp: '4 hours ago'
  }
];

export const ExclusiveContent = () => {
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [creatorList, setCreatorList] = useState(creators);
  const [searchQuery, setSearchQuery] = useState('');

  const subscribedCreators = creatorList.filter(c => c.isSubscribed);
  const availablePosts = exclusivePosts.filter(post => post.creator.isSubscribed);
  
  // Filter creators based on search query
  const filteredCreators = creatorList.filter(creator =>
    creator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubscribe = (creatorId: string) => {
    setCreatorList(prev => 
      prev.map(creator => 
        creator.id === creatorId 
          ? { ...creator, isSubscribed: !creator.isSubscribed }
          : creator
      )
    );
  };

  if (showSubscriptions) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-white">Manage Subscriptions</h2>
            <button
              onClick={() => setShowSubscriptions(false)}
              className="px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
              Back to Feed
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators..."
              className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </div>

        {/* Subscribed Creators */}
        <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
          <h3 className="text-lg text-white mb-4">Active Subscriptions</h3>
          {subscribedCreators.length > 0 ? (
            <div className="space-y-4">
              {subscribedCreators.map((creator) => (
                <div key={creator.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-3">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="text-white">{creator.name}</h4>
                      <p className="text-white/60 text-sm">${creator.subscriptionPrice}/month</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSubscribe(creator.id)}
                    className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Unsubscribe
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/60">No active subscriptions</p>
          )}
        </div>

        {/* Available Creators */}
        <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
          <h3 className="text-lg text-white mb-4">
            Available Creators {searchQuery && `(${filteredCreators.filter(c => !c.isSubscribed).length} results)`}
          </h3>
          <div className="space-y-4">
            {filteredCreators.filter(c => !c.isSubscribed).map((creator) => (
              <div key={creator.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="text-white">{creator.name}</h4>
                    <div className="flex items-center space-x-2">
                      <p className="text-white/60 text-sm">${creator.subscriptionPrice}/month</p>
                      {creator.tier && (
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          creator.tier === 'vip' ? 'bg-purple-500/20 text-purple-400' :
                          creator.tier === 'premium' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {creator.tier.toUpperCase()}
                        </span>
                      )}
                    </div>
                      <div className="flex items-center space-x-1 text-white/40 mt-1">
                        <Users className="w-3 h-3" />
                        <span>{creator.exclusiveFollowers.toLocaleString()} subscribers</span>
                      </div>
                    </div>
                  </div>
                <button
                  onClick={() => handleSubscribe(creator.id)}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            ))}
            {filteredCreators.filter(c => !c.isSubscribed).length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/60">
                  {searchQuery ? 'No creators found matching your search' : 'No available creators to subscribe to'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-white">Exclusive Content</h2>
          <p className="text-white/60">Content from your subscribed creators</p>
        </div>
        <button
          onClick={() => setShowSubscriptions(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Manage Subscriptions</span>
        </button>
      </div>

      {/* Subscription Summary */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="w-5 h-5 text-white/60" />
            <div>
              <h3 className="text-white">Active Subscriptions</h3>
              <p className="text-white/60 text-sm">{subscribedCreators.length} creators</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white">
              ${subscribedCreators.reduce((total, creator) => total + creator.subscriptionPrice, 0).toFixed(2)}
            </div>
            <p className="text-white/60 text-sm">per month</p>
          </div>
        </div>
      </div>

      {/* Exclusive Posts */}
      <div className="space-y-6">
        {availablePosts.length > 0 ? (
          availablePosts.map((post) => (
            <div key={post.id} className="bg-black/40 backdrop-blur-xl rounded-lg overflow-hidden border border-white/5">
              {/* Post Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.creator.avatar}
                      alt={post.creator.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white">{post.creator.name}</span>
                        <Star className="w-4 h-4 text-white/60" />
                      </div>
                      <p className="text-white/60 text-sm">{post.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    <Crown className="w-4 h-4 text-white/60" />
                    <span className="text-white/80 text-sm">Exclusive</span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              {post.content.image && (
                <img
                  src={post.content.image}
                  alt=""
                  className="w-full aspect-video object-cover"
                />
              )}
              <div className="p-4">
                <p className="text-white/90 mb-4">{post.content.text}</p>
                
                {/* Post Actions */}
                <div className="flex items-center space-x-4 mb-3">
                  <button className="text-white/60 hover:text-white transition-colors">
                    <Heart className="h-6 w-6" />
                  </button>
                  <button className="text-white/60 hover:text-white transition-colors">
                    <MessageCircle className="h-6 w-6" />
                  </button>
                  <button className="text-white/60 hover:text-white transition-colors ml-auto">
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="text-white/90">{post.likes} likes</div>
                <button className="text-white/50 text-sm mt-1 hover:text-white transition-colors">
                  View all {post.comments} comments
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Crown className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-white mb-2">No Exclusive Content</h3>
            <p className="text-white/60 mb-4">Subscribe to creators to see their exclusive posts here</p>
            <button
              onClick={() => setShowSubscriptions(true)}
              className="px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
            >
              Browse Creators
            </button>
          </div>
        )}
      </div>
    </div>
  );
};