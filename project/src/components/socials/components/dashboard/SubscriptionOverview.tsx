import React from 'react';
import { Shield, Clock, CheckCircle } from 'lucide-react';
import { currentSubscription } from '../../data/subscriptions';

export const SubscriptionOverview = () => (
  <div className="space-y-6">
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Shield className="w-8 h-8 text-zinc-400" />
          <div>
            <h2 className="text-xl text-zinc-200">{currentSubscription.tier.toUpperCase()} Plan</h2>
            <p className="text-zinc-400">
              ${currentSubscription.price}/month
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm">
          Active
        </span>
      </div>

      <div className="flex items-center space-x-6 text-sm text-zinc-400 mb-6">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          <span>Renews {new Date(currentSubscription.endDate).toLocaleDateString()}</span>
        </div>
        <div>
          {currentSubscription.autoRenew ? 'Auto-renewal enabled' : 'Auto-renewal disabled'}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-zinc-200 mb-4">Features Included</h3>
        {currentSubscription.features.map((feature) => (
          <div key={feature} className="flex items-center text-zinc-400">
            <CheckCircle className="w-4 h-4 mr-3 text-emerald-400" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);