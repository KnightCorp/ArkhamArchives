import React from "react";
import { EventCard } from "../events/EventCard";
import { events } from "../../data/events";

export const EventsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {events.map((event) => (
      <EventCard key={event.id} event={event} />
    ))}
  </div>
);
