import React from 'react';
import { CreatePost } from '../components/create/CreatePost';
import { CreatorRow } from '../components/creator/CreatorRow';
import { FeedHeader } from '../components/feed/FeedHeader';
import { FeedPost } from '../components/feed/FeedPost';

const Feed = () => {
  const posts = [
    {
      id: 1,
      user: {
        name: 'Vincent Gray',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
      },
      image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800',
      likes: 234,
      caption: 'Shadows and light in the concrete jungle 🌃',
      comments: 12,
    },
    {
      id: 2,
      user: {
        name: 'Nina Blake',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      },
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
      likes: 456,
      caption: 'Late night jazz session at The Blue Room 🎷',
      comments: 23,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto dark-academia-gradient min-h-screen p-8 rounded-lg">
      <FeedHeader />
      <CreatorRow />
      <div className="mb-8">
        <CreatePost />
      </div>
      {posts.map((post) => (
        <FeedPost key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;