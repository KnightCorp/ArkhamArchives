import React from 'react';
import { Activity, FileText, MapPin, Settings } from 'lucide-react';

const updates = [
  {
    id: 1,
    type: 'Evidence',
    time: '5m ago',
    message: 'New fingerprint analysis complete',
    icon: FileText
  },
  {
    id: 2,
    type: 'Location',
    time: '15m ago',
    message: 'Suspect spotted at Central Station',
    icon: MapPin
  },
  {
    id: 3,
    type: 'System',
    time: '1h ago',
    message: 'Database sync completed',
    icon: Settings
  }
];

export const LiveUpdates = () => (
  <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
    <div className="flex items-center space-x-3 mb-6">
      <Activity className="w-5 h-5 text-zinc-400" />
      <h2 className="text-lg text-zinc-200">LIVE UPDATES</h2>
    </div>
    
    <div className="space-y-4">
      {updates.map((update) => (
        <div key={update.id} className="flex items-start space-x-4">
          <div className="flex-none">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <update.icon className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-zinc-200">{update.type}</span>
              <span className="text-sm text-zinc-400">{update.time}</span>
            </div>
            <p className="text-zinc-400">{update.message}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);