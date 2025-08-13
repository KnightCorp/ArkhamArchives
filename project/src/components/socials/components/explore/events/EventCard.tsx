import React from 'react';
import { MapPin, Clock, Users } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  organizer: string;
  location: {
    name: string;
    distance: number;
    city: string;
  };
  categories: Record<string, number>;
  image: string;
  date: string;
  time: string;
  attendees: number;
}

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => (
  <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all">
    <div className="aspect-video relative">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
      />
    </div>
    <div className="p-4">
      <h3 className="text-zinc-200 font-medium mb-2">{event.title}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center text-zinc-400">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{event.location.name} • {event.location.distance}km</span>
        </div>
        <div className="flex items-center text-zinc-400">
          <Clock className="w-4 h-4 mr-2" />
          <span>{event.date} • {event.time}</span>
        </div>
        <div className="flex items-center text-zinc-400">
          <Users className="w-4 h-4 mr-2" />
          <span>{event.attendees} attending</span>
        </div>
      </div>
    </div>
  </div>
);