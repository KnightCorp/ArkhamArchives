import React from 'react';
import { Bell, FileText, MapPin, Users } from 'lucide-react';

const triggers = [
  {
    id: 1,
    event: 'New Evidence Added',
    action: 'Send Notification',
    icon: FileText
  },
  {
    id: 2,
    event: 'Suspect Movement',
    action: 'Alert Team',
    icon: MapPin
  },
  {
    id: 3,
    event: 'Witness Update',
    action: 'Update Timeline',
    icon: Users
  }
];

export const Triggers = () => (
  <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
    <div className="flex items-center space-x-3 mb-6">
      <Bell className="w-5 h-5 text-zinc-400" />
      <h2 className="text-lg text-zinc-200">TRIGGERS</h2>
    </div>
    
    <div className="space-y-4">
      {triggers.map((trigger) => (
        <div key={trigger.id} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <trigger.icon className="w-5 h-5 text-zinc-400" />
            <div>
              <p className="text-zinc-200">{trigger.event}</p>
              <p className="text-sm text-zinc-400">{trigger.action}</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
      ))}
    </div>
  </div>
);