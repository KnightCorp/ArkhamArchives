import React from "react";
import { Play, Pause, BarChart2, Users, Target } from "lucide-react";
import { adCampaigns } from "../data/dashboard";

export const AdCampaigns = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-xl text-zinc-200">Active Campaigns</h2>
      <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors">
        Create Campaign
      </button>
    </div>

    <div className="space-y-4">
      {adCampaigns.map((campaign) => (
        <div
          key={campaign.id}
          className="bg-zinc-900 rounded-lg p-6 border border-zinc-800"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg text-zinc-200">{campaign.name}</h3>
              <p className="text-sm text-zinc-400">
                {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                {new Date(campaign.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  campaign.status === "active"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : campaign.status === "paused"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-zinc-500/10 text-zinc-400"
                }`}
              >
                {campaign.status.charAt(0).toUpperCase() +
                  campaign.status.slice(1)}
              </span>
              <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                {campaign.status === "active" ? (
                  <Pause className="w-4 h-4 text-zinc-400" />
                ) : (
                  <Play className="w-4 h-4 text-zinc-400" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="flex items-center text-zinc-400 mb-2">
                <BarChart2 className="w-4 h-4 mr-2" />
                <span className="text-sm">Budget</span>
              </div>
              <div className="text-zinc-200">
                ${campaign.spent} / ${campaign.budget}
              </div>
              <div className="mt-2 h-1 bg-zinc-700 rounded-full">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${(campaign.spent / campaign.budget) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="flex items-center text-zinc-400 mb-2">
                <Users className="w-4 h-4 mr-2" />
                <span className="text-sm">Reach</span>
              </div>
              <div className="text-zinc-200">
                {campaign.reach.toLocaleString()}
              </div>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="flex items-center text-zinc-400 mb-2">
                <Target className="w-4 h-4 mr-2" />
                <span className="text-sm">Engagement</span>
              </div>
              <div className="text-zinc-200">
                {campaign.engagement.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <h4 className="text-sm text-zinc-400 mb-2">Target Audience</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400">
                Age: {campaign.targetAudience.age[0]}-
                {campaign.targetAudience.age[1]}
              </span>
              {campaign.targetAudience.locations.map((location) => (
                <span
                  key={location}
                  className="px-2 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400"
                >
                  {location}
                </span>
              ))}
              {campaign.targetAudience.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-2 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
