import React, { useState } from 'react';
import { Play, Star, Clock, Users, Heart, BookOpen } from 'lucide-react';

interface Stream {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  rating: number;
  instructor: {
    name: string;
    avatar: string;
    title: string;
  };
  tags: string[];
  description: string;
  chapters: {
    title: string;
    duration: string;
    preview: boolean;
  }[];
  reviews: {
    user: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

const streams: Stream[] = [
  {
    id: 'stream1',
    title: 'Advanced Photography Techniques',
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=400&fit=crop',
    duration: '4h 30m',
    views: 1250,
    rating: 4.8,
    instructor: {
      name: 'Vincent Gray',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      title: 'Master Photographer'
    },
    tags: ['Photography', 'Composition', 'Lighting'],
    description: 'Master the art of photography with advanced techniques in composition, lighting, and post-processing.',
    chapters: [
      { title: 'Understanding Light', duration: '45m', preview: true },
      { title: 'Composition Rules', duration: '1h', preview: true },
      { title: 'Advanced Techniques', duration: '1h 15m', preview: false },
      { title: 'Post-Processing', duration: '1h 30m', preview: false }
    ],
    reviews: [
      {
        user: 'Clara Night',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        rating: 5,
        comment: 'Incredibly detailed course with practical examples. Vincent\'s expertise shines through.',
        date: '2024-03-15'
      }
    ]
  },
  {
    id: 'stream2',
    title: 'Digital Art Fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&h=400&fit=crop',
    duration: '6h 15m',
    views: 980,
    rating: 4.7,
    instructor: {
      name: 'Nina Blake',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
      title: 'Digital Artist'
    },
    tags: ['Digital Art', 'Illustration', 'Design'],
    description: 'Learn the fundamentals of digital art, from basic tools to advanced illustration techniques.',
    chapters: [
      { title: 'Digital Tools Overview', duration: '1h', preview: true },
      { title: 'Basic Techniques', duration: '1h 30m', preview: true },
      { title: 'Color Theory', duration: '1h 15m', preview: false },
      { title: 'Advanced Illustration', duration: '2h 30m', preview: false }
    ],
    reviews: [
      {
        user: 'Marcus Stone',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 4,
        comment: 'Comprehensive course that helped me transition from traditional to digital art.',
        date: '2024-03-14'
      }
    ]
  }
];

export const StreamingLibrary = () => {
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'reviews'>('overview');

  return (
    <div className="space-y-8">
      {/* Featured Streams */}
      <div className="grid grid-cols-2 gap-6">
        {streams.map((stream) => (
          <div 
            key={stream.id}
            className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
            onClick={() => setSelectedStream(stream)}
          >
            <div className="relative aspect-video">
              <img 
                src={stream.thumbnail}
                alt={stream.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-12 h-12 text-white" />
              </div>
              <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/70 rounded text-sm text-white">
                {stream.duration}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <img 
                  src={stream.instructor.avatar}
                  alt={stream.instructor.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-zinc-200 font-medium">{stream.title}</h3>
                  <p className="text-zinc-400 text-sm">{stream.instructor.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-zinc-400">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span>{stream.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{stream.views}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {stream.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-zinc-800 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stream Details Modal */}
      {selectedStream && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8">
          <div className="bg-zinc-900 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="relative aspect-video">
              <img 
                src={selectedStream.thumbnail}
                alt={selectedStream.title}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedStream(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white"
              >
                ×
              </button>
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl text-zinc-200 mb-2">{selectedStream.title}</h2>
                  <div className="flex items-center space-x-4 text-zinc-400">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{selectedStream.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{selectedStream.views} viewers</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span>{selectedStream.rating}</span>
                    </div>
                  </div>
                </div>
                <button className="px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors">
                  Enroll Now
                </button>
              </div>

              <div className="flex space-x-4 border-b border-zinc-800 mb-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 -mb-px ${
                    activeTab === 'overview'
                      ? 'text-white border-b-2 border-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('chapters')}
                  className={`px-4 py-2 -mb-px ${
                    activeTab === 'chapters'
                      ? 'text-white border-b-2 border-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Chapters
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-4 py-2 -mb-px ${
                    activeTab === 'reviews'
                      ? 'text-white border-b-2 border-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Reviews
                </button>
              </div>

              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <p className="text-zinc-300">{selectedStream.description}</p>
                  <div>
                    <h3 className="text-lg text-zinc-200 mb-3">Instructor</h3>
                    <div className="flex items-center space-x-4">
                      <img 
                        src={selectedStream.instructor.avatar}
                        alt={selectedStream.instructor.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="text-zinc-200">{selectedStream.instructor.name}</div>
                        <div className="text-zinc-400">{selectedStream.instructor.title}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'chapters' && (
                <div className="space-y-4">
                  {selectedStream.chapters.map((chapter, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-5 h-5 text-zinc-400" />
                        <div>
                          <div className="text-zinc-200">{chapter.title}</div>
                          <div className="text-zinc-400 text-sm">{chapter.duration}</div>
                        </div>
                      </div>
                      {chapter.preview ? (
                        <button className="px-4 py-1 bg-zinc-700 text-zinc-200 rounded hover:bg-zinc-600 transition-colors">
                          Preview
                        </button>
                      ) : (
                        <div className="text-zinc-500">
                          Enrolled Only
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {selectedStream.reviews.map((review, index) => (
                    <div key={index} className="border-b border-zinc-800 pb-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <img 
                          src={review.avatar}
                          alt={review.user}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="text-zinc-200">{review.user}</div>
                          <div className="text-zinc-400 text-sm">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-500' : 'text-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-zinc-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};