import React from 'react';
import { Clock } from 'lucide-react';

const Timeline = () => {
  const timelineEvents = [
    {
      id: 1,
      date: '2024-03-15',
      time: '15:30',
      type: 'post',
      content: {
        image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800',
        caption: 'Shadows and light in the concrete jungle 🌃'
      }
    },
    {
      id: 2,
      date: '2024-03-14',
      time: '20:15',
      type: 'achievement',
      content: {
        title: 'Photography Master',
        description: 'Completed 100 noir-style photographs'
      }
    },
    {
      id: 3,
      date: '2024-03-13',
      time: '18:45',
      type: 'post',
      content: {
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
        caption: 'Late night jazz session at The Blue Room 🎷'
      }
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <Clock className="w-8 h-8 text-zinc-400" />
        <h1 className="text-3xl font-typewriter text-zinc-200">Your Timeline</h1>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-zinc-800" />

        {/* Timeline events */}
        <div className="space-y-12">
          {timelineEvents.map((event) => (
            <div key={event.id} className="relative pl-24">
              {/* Time marker */}
              <div className="absolute left-6 -translate-x-1/2 bg-zinc-900 border-2 border-zinc-800 rounded-full w-5 h-5" />
              
              {/* Time */}
              <div className="absolute left-0 top-1 text-sm text-zinc-500 font-mono">
                {event.time}
              </div>

              {/* Content */}
              <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
                <div className="text-sm text-zinc-400 mb-4 font-mono">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>

                {event.type === 'post' ? (
                  <div>
                    <img
                      src={event.content.image}
                      alt=""
                      className="w-full rounded-lg mb-4 grayscale hover:grayscale-0 transition-all"
                    />
                    <p className="text-zinc-300">{event.content.caption}</p>
                  </div>
                ) : event.type === 'achievement' ? (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-zinc-400" />
                    </div>
                    <div>
                      <h3 className="text-zinc-200 font-medium">{event.content.title}</h3>
                      <p className="text-zinc-400">{event.content.description}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;