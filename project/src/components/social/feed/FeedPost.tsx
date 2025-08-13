import React from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Podcast,
  Network,
  Search,
  Wand2,
  Eye,
  Star,
} from "lucide-react";
import type { Post } from "../types/post";

interface FeedPostProps {
  post: Post;
}

export const FeedPost = ({ post }: FeedPostProps) => (
  <div className="bg-black/40 backdrop-blur-xl rounded-lg overflow-hidden mb-8 border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
    <div className="p-4 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-10 h-10 rounded-full grayscale hover:grayscale-0 transition-all ring-2 ring-white/20"
          />
          <div className="ml-3">
            <span className="text-white/90">{post.user.name}</span>
            <div className="flex items-center space-x-2 text-white/50 text-sm">
              <Star className="w-3 h-3" />
              <span>{post.user.karma || 0} karma</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-white/50">
          <Eye className="w-4 h-4" />
          <span>{post.impressions || 0}</span>
        </div>
      </div>
    </div>

    <img
      src={post.image}
      alt=""
      className="w-full grayscale hover:grayscale-0 transition-all"
    />

    <div className="p-4 bg-black/20 backdrop-blur-sm">
      <div className="flex items-center space-x-4 mb-3">
        <button className="group text-white/60 hover:text-white transition-colors">
          <Heart className="h-6 w-6 transform group-hover:scale-110 transition-transform" />
        </button>
        <button className="group text-white/60 hover:text-white transition-colors">
          <MessageCircle className="h-6 w-6 transform group-hover:scale-110 transition-transform" />
        </button>
        <button className="text-white/60 hover:text-white transition-colors ml-auto">
          <Share2 className="h-6 w-6" />
        </button>
      </div>

      <div className="text-white/90">{post.likes} admirers</div>
      <p className="mt-2 text-white/70">
        <span className="text-white/90 font-medium">{post.user.name}</span>{" "}
        {post.caption}
      </p>
      <button className="text-white/50 text-sm mt-1 hover:text-white transition-colors">
        View all whispers
      </button>

      {/* AI Tools */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
        <button className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm text-white/70 hover:text-white backdrop-blur-sm">
          <Network className="w-4 h-4" />
          <span>Generate Mindmap</span>
        </button>
        <button className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm text-white/70 hover:text-white backdrop-blur-sm">
          <Podcast className="w-4 h-4" />
          <span>Create Podcast</span>
        </button>
        <button className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm text-white/70 hover:text-white backdrop-blur-sm">
          <Search className="w-4 h-4" />
          <span>Quick Search</span>
        </button>
        <button className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm text-white/70 hover:text-white backdrop-blur-sm">
          <Wand2 className="w-4 h-4" />
          <span>AI Insights</span>
        </button>
      </div>
    </div>
  </div>
);
