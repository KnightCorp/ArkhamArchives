import React from "react";
import {
  TrendingUp,
  Users,
  BarChart2,
  Eye,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { followerInsights, contentInsights } from "../data/dashboard";

export const Insights = () => (
  <div className="space-y-8">
    {/* Follower Insights */}
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-zinc-200">Follower Insights</h2>
        <div className="flex items-center text-emerald-400">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>+{followerInsights.growth}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm text-zinc-400 mb-4">Age Distribution</h3>
          {Object.entries(followerInsights.demographics.age).map(
            ([age, percentage]) => (
              <div key={age} className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-400">{age}</span>
                  <span className="text-zinc-200">{percentage}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          )}
        </div>

        <div>
          <h3 className="text-sm text-zinc-400 mb-4">Top Locations</h3>
          {Object.entries(followerInsights.demographics.location).map(
            ([location, percentage]) => (
              <div key={location} className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-400">{location}</span>
                  <span className="text-zinc-200">{percentage}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          )}
        </div>

        <div>
          <h3 className="text-sm text-zinc-400 mb-4">Interest Categories</h3>
          {Object.entries(followerInsights.demographics.interests).map(
            ([interest, percentage]) => (
              <div key={interest} className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-400">{interest}</span>
                  <span className="text-zinc-200">{percentage}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>

    {/* Content Performance */}
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h2 className="text-xl text-zinc-200 mb-6">Content Performance</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <div className="flex items-center text-zinc-400 mb-2">
            <Eye className="w-4 h-4 mr-2" />
            <span className="text-sm">Views</span>
          </div>
          <div className="text-zinc-200">
            {contentInsights.performance.views.toLocaleString()}
          </div>
        </div>

        <div className="bg-zinc-800/50 rounded-lg p-4">
          <div className="flex items-center text-zinc-400 mb-2">
            <Heart className="w-4 h-4 mr-2" />
            <span className="text-sm">Likes</span>
          </div>
          <div className="text-zinc-200">
            {contentInsights.performance.likes.toLocaleString()}
          </div>
        </div>

        <div className="bg-zinc-800/50 rounded-lg p-4">
          <div className="flex items-center text-zinc-400 mb-2">
            <MessageCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">Comments</span>
          </div>
          <div className="text-zinc-200">
            {contentInsights.performance.comments.toLocaleString()}
          </div>
        </div>

        <div className="bg-zinc-800/50 rounded-lg p-4">
          <div className="flex items-center text-zinc-400 mb-2">
            <Share2 className="w-4 h-4 mr-2" />
            <span className="text-sm">Shares</span>
          </div>
          <div className="text-zinc-200">
            {contentInsights.performance.shares.toLocaleString()}
          </div>
        </div>
      </div>

      <h3 className="text-lg text-zinc-200 mb-4">Top Performing Content</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contentInsights.topPerforming.map((post) => (
          <div
            key={post.id}
            className="bg-zinc-800/50 rounded-lg overflow-hidden"
          >
            <img
              src={post.thumbnail}
              alt=""
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 capitalize">{post.type}</span>
                <div className="flex items-center text-emerald-400">
                  <BarChart2 className="w-4 h-4 mr-1" />
                  <span>{post.engagement}% engagement</span>
                </div>
              </div>
              <div className="text-sm text-zinc-400">
                Reached {post.reach.toLocaleString()} people
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
