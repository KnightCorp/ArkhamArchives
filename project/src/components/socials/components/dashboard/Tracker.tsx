import React from 'react';
import { Clock, MapPin, UserCheck, Bell } from 'lucide-react';
import { Timeline } from './tracker/Timeline';
import { PeopleTracker } from './tracker/PeopleTracker';
import { Triggers } from './tracker/Triggers';
import { LiveUpdates } from './tracker/LiveUpdates';

export const Tracker = () => (
  <div className="space-y-8">
    {/* Event Timeline */}
    <Timeline />
    
    {/* People Tracker */}
    <PeopleTracker />
    
    {/* Triggers */}
    <Triggers />
    
    {/* Live Updates */}
    <LiveUpdates />
  </div>
);