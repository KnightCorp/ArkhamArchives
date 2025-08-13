import React, { useState } from 'react';
import { appSettings } from '../../data/settings';

export const PrivacySettings = () => {
  const [settings, setSettings] = useState(appSettings);

  const handleChange = (field: keyof typeof settings.privacy, value: any) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value
      }
    }));
  };

  return (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h2 className="text-lg text-zinc-200 mb-6">Privacy Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-zinc-200 mb-2">Profile Visibility</label>
          <select
            value={settings.privacy.profileVisibility}
            onChange={(e) => handleChange('profileVisibility', e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="followers">Followers Only</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-zinc-200">Activity Status</h3>
            <p className="text-sm text-zinc-400">Show when you're active</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.privacy.activityStatus}
              onChange={(e) => handleChange('activityStatus', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-zinc-200">Read Receipts</h3>
            <p className="text-sm text-zinc-400">Show when you've read messages</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.privacy.readReceipts}
              onChange={(e) => handleChange('readReceipts', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
          </label>
        </div>
      </div>
    </div>
  );
};