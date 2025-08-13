import React from "react";
import { EventPreferencesPanel } from "../events/EventPreferences";
import { EventCard } from "../events/EventCard";
import { events } from "../../../data/events";
import { EventPreferences } from "../events/EventPreferences";

interface EventsSectionProps {
  preferences: EventPreferences;
  onPreferenceChange: (key: string, value: number) => void;
}

export const EventsSection = ({
  preferences,
  onPreferenceChange,
}: EventsSectionProps) => (
  <div className="space-y-8">
    <EventPreferencesPanel
      preferences={preferences}
      onChange={onPreferenceChange}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  </div>
);
