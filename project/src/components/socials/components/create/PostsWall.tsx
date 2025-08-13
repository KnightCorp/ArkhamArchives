import React from 'react';

const mockPosts = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=400&fit=crop',
    location: 'The Dark Room, New York'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=400&fit=crop',
    location: 'Noir Cafe, Brooklyn'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=400&fit=crop',
    location: 'Shadow Gallery, Manhattan'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop',
    location: 'Midnight Lounge, Queens'
  }
];

export const PostsWall = () => {
  return (
    <div>
      <h2 className="text-xl font-typewriter text-zinc-200 mb-4">Your Posts</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {mockPosts.map((post) => (
          <div key={post.id} className="relative aspect-square group">
            <img
              src={post.image}
              alt=""
              className="w-full h-full object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end p-4">
              <span className="text-white text-sm">{post.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};