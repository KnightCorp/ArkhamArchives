import React from 'react';
import { Clock, FileText, MapPin, Users } from 'lucide-react';

const events = [
  {
    id: 1,
    time: '10:30 AM',
    title: 'New Evidence Found',
    type: 'evidence',
    icon: FileText
  },
  {
    id: 2,
    time: '11:45 AM',
    title: 'Suspect Location Updated',
    type: 'location',
    icon: MapPin
  },
  {
    id: 3,
    time: '2:15 PM',
    title: 'Witness Statement Added',
    type: 'witness',
    icon: Users
  }
];

export const Timeline = () => (
  <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
    <div className="flex items-center space-x-3 mb-6">
      <Clock className="w-5 h-5 text-zinc-400" />
      <h2 className="text-lg text-zinc-200">EVENT TIMELINE</h2>
    </div>
    
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex items-start space-x-4">
          <div className="flex-none">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
              <event.icon className="w-5 h-5 text-zinc-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <p className="text-zinc-200">{event.title}</p>
              <span className="text-sm text-zinc-400">{event.time}</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);