import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Twitter, Linkedin, Calendar, Trophy, BookOpen, Users } from 'lucide-react';
import { SocialPost } from '../types';

interface SocialFeedProps {
  posts: SocialPost[];
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string, platform: 'twitter' | 'linkedin') => void;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ posts, onLike, onComment, onShare }) => {
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  const handleComment = (postId: string) => {
    const comment = commentInputs[postId];
    if (comment?.trim()) {
      onComment(postId, comment);
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'announcement':
        return <BookOpen className="w-5 h-5 text-blue-400" />;
      case 'achievement':
        return <Users className="w-5 h-5 text-green-400" />;
      default:
        return <Calendar className="w-5 h-5 text-white/60" />;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-white text-xl font-bold subtle-glow mb-4">
        SOCIAL_FEED.<span className="text-green-400">LOG</span>
      </h2>

      {posts.map((post) => (
        <div key={post.id} className="black-glass white-glow p-4">
          {/* Post Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white/60" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">Teacher Name</span>
                {getPostIcon(post.type)}
                <span className="text-white/60 text-sm capitalize">{post.type}</span>
              </div>
              <div className="text-white/60 text-xs">
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <p className="text-white/80 leading-relaxed">{post.content}</p>
            
            {/* Attachments */}
            {post.attachments && post.attachments.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {post.attachments.map((attachment, index) => (
                  <div key={index} className="bg-white/10 p-3 border border-white/20">
                    <div className="text-white/60 text-xs">Attachment {index + 1}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onLike(post.id)}
                className="flex items-center gap-2 text-white/60 hover:text-red-400 transition-colors"
              >
                <Heart className={`w-4 h-4 ${post.likes.length > 0 ? 'fill-red-400 text-red-400' : ''}`} />
                <span className="text-xs">{post.likes.length}</span>
              </button>
              
              <button className="flex items-center gap-2 text-white/60 hover:text-blue-400 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">{post.comments.length}</span>
              </button>
              
              <button className="flex items-center gap-2 text-white/60 hover:text-green-400 transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-xs">Share</span>
              </button>
            </div>

            {/* Social Media Share */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onShare(post.id, 'twitter')}
                className={`p-1 transition-colors ${
                  post.sharedToSocial.twitter
                    ? 'text-blue-400'
                    : 'text-white/40 hover:text-blue-400'
                }`}
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => onShare(post.id, 'linkedin')}
                className={`p-1 transition-colors ${
                  post.sharedToSocial.linkedin
                    ? 'text-blue-600'
                    : 'text-white/40 hover:text-blue-600'
                }`}
              >
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Comments */}
          {post.comments.length > 0 && (
            <div className="mt-4 space-y-2">
              {post.comments.map((comment) => (
                <div key={comment.id} className="bg-black/30 p-2 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white/80 text-sm font-bold">User</span>
                    <span className="text-white/60 text-xs">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Comment Input */}
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={commentInputs[post.id] || ''}
              onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
              className="flex-1 bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
              placeholder="Add a comment..."
              onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
            />
            <button
              onClick={() => handleComment(post.id)}
              className="bg-green-400/20 text-green-400 px-3 py-2 text-sm border border-green-400/30 hover:bg-green-400/30 transition-colors"
            >
              POST
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialFeed;