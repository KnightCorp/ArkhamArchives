import React from 'react';
import { PostsWall } from '../components/create/PostsWall';

const Create = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-typewriter text-zinc-200 mb-8">
        Your Posts
      </h1>
      <PostsWall />
    </div>
  );
};

export default Create;