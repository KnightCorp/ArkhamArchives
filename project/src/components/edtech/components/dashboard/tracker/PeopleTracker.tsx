import React from 'react';
import { Users, MapPin } from 'lucide-react';

const people = [
  {
    id: 1,
    name: 'John Doe',
    status: 'Active',
    location: 'Downtown'
  },
  {
    id: 2,
    name: 'Jane Smith',
    status: 'Inactive',
    location: 'Unknown'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    status: 'Active',
    location: 'Suburbs'
  }
];

export const PeopleTracker = () => (
  <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
    <div className="flex items-center space-x-3 mb-6">
      <Users className="w-5 h-5 text-zinc-400" />
      <h2 className="text-lg text-zinc-200">PEOPLE TRACKER</h2>
    </div>
    
    <div className="space-y-4">
      {people.map((person) => (
        <div key={person.id} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
          <div>
            <p className="text-zinc-200">{person.name}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-block w-2 h-2 rounded-full ${
                person.status === 'Active' ? 'bg-emerald-500' : 'bg-zinc-500'
              }`} />
              <span className="text-sm text-zinc-400">{person.status}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-zinc-400">
            <MapPin className="w-4 h-4" />
            <span>{person.location}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);