import React from 'react';
import { currentSubscription } from '../../data/subscriptions';

export const SubscriptionSettings = () => (
  <div className="space-y-6">
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h2 className="text-lg text-zinc-200 mb-6">Auto-Renewal</h2>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-zinc-400">
            Your subscription will {currentSubscription.autoRenew ? '' : 'not'} automatically renew on{' '}
            {new Date(currentSubscription.endDate).toLocaleDateString()}
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={currentSubscription.autoRenew}
            className="sr-only peer"
            onChange={() => {}}
          />
          <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
      </div>
    </div>

    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h2 className="text-lg text-zinc-200 mb-6">Cancel Subscription</h2>
      <p className="text-zinc-400 mb-4">
        Your subscription will remain active until the end of your current billing period.
      </p>
      <button className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
        Cancel Subscription
      </button>
    </div>
  </div>
);