// Updated EventsSection.tsx with proper error handling and authentication
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  UserCheck,
  UserPlus,
} from "lucide-react";
import {
  profileQueries,
  attendEvent,
  unattendEvent,
} from "../../../lib/exploreQueries";
import { getCurrentUser } from "../../../lib/socialMediaQueries";

interface Event {
  id: string;
  title: string;
  organizer_id: string;
  organizer_name: string;
  location_name: string;
  location_distance: number | null;
  location_city: string | null;
  location_coordinates: any;
  event_interests: string[];
  event_aesthetics: string[];
  image_url: string | null;
  event_date: string;
  event_time: string;
  attendee_count: number;
  max_attendees: number | null;
  description: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
  isAttending?: boolean;
}

const EventCard = ({
  event,
  currentUserId,
  onAttendanceChange,
}: {
  event: Event;
  currentUserId: string;
  onAttendanceChange?: (eventId: string, isAttending: boolean) => void;
}) => {
  const [isAttending, setIsAttending] = useState(event.isAttending || false);
  const [attendeeCount, setAttendeeCount] = useState(event.attendee_count);
  const [isLoading, setIsLoading] = useState(false);

  const handleAttend = async () => {
    if (!currentUserId) return;

    setIsLoading(true);
    try {
      if (isAttending) {
        const { error } = await unattendEvent(currentUserId, event.id);
        if (!error) {
          setIsAttending(false);
          setAttendeeCount((prev) => prev - 1);
          onAttendanceChange?.(event.id, false);
        } else {
          console.error("Error unattending event:", error);
        }
      } else {
        const { error } = await attendEvent(currentUserId, event.id);
        if (!error) {
          setIsAttending(true);
          setAttendeeCount((prev) => prev + 1);
          onAttendanceChange?.(event.id, true);
        } else {
          console.error("Error attending event:", error);
        }
      }
    } catch (error) {
      console.error("Error in attend/unattend operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    return timeString.slice(0, 5); // HH:MM format
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg overflow-hidden transition-all duration-500 hover:transform hover:scale-[1.02] hover:border-purple-500/50">
      <div className="aspect-video relative">
        <img
          src={
            event.image_url ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format"
          }
          alt={event.title}
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        {/* Featured badge */}
        {event.featured && (
          <div className="absolute top-3 left-3 bg-purple-600/90 text-white px-2 py-1 rounded-lg text-xs font-medium">
            Featured
          </div>
        )}

        {/* Attendee count overlay */}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
          <Users className="w-4 h-4" />
          {attendeeCount}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-zinc-200 font-medium mb-1 tracking-wide text-lg">
              {event.title}
            </h3>
            <p className="text-zinc-400 text-sm">by {event.organizer_name}</p>
          </div>
        </div>

        {event.description && (
          <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center text-zinc-400">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {event.location_name}
              {event.location_distance && ` • ${event.location_distance}km`}
              {event.location_city && ` • ${event.location_city}`}
            </span>
          </div>

          <div className="flex items-center text-zinc-400">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{formatDate(event.event_date)}</span>
          </div>

          <div className="flex items-center text-zinc-400">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{formatTime(event.event_time)}</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Interest and Aesthetic Tags */}
          {(event.event_interests?.length > 0 ||
            event.event_aesthetics?.length > 0) && (
            <div className="space-y-2">
              {event.event_interests?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {event.event_interests.slice(0, 3).map((interest, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-900/30 text-blue-300 rounded border border-blue-700/30"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}

              {event.event_aesthetics?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {event.event_aesthetics
                    .slice(0, 2)
                    .map((aesthetic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-purple-900/30 text-purple-300 rounded border border-purple-700/30"
                      >
                        {aesthetic}
                      </span>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Attendance Information */}
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {attendeeCount} attending
            </span>
            {event.max_attendees && (
              <span>{event.max_attendees - attendeeCount} spots left</span>
            )}
          </div>

          {/* Attend Button */}
          <button
            onClick={handleAttend}
            disabled={
              Boolean(isLoading) ||
              (typeof event.max_attendees === "number" &&
                attendeeCount >= event.max_attendees &&
                !isAttending)
            }
            className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
              isAttending
                ? "bg-gradient-to-r from-green-900/50 to-green-800/50 text-green-300 hover:from-green-800/50 hover:to-green-700/50"
                : event.max_attendees && attendeeCount >= event.max_attendees
                ? "bg-zinc-800/50 text-zinc-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-900/50 to-blue-800/50 text-blue-300 hover:from-blue-800/50 hover:to-blue-700/50"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : isAttending ? (
              <>
                <UserCheck className="w-4 h-4" />
                Attending
              </>
            ) : event.max_attendees && attendeeCount >= event.max_attendees ? (
              <>Event Full</>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Attend
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { user, error: userError } = await getCurrentUser();
        if (userError || !user) {
          throw new Error("User not authenticated");
        }

        setCurrentUser(user);

        // Get personalized events
        const { data, error: eventsError } =
          await profileQueries.getPersonalizedEvents(user.id, 12);

        if (eventsError) {
          throw new Error("Failed to fetch events");
        }

        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleAttendanceChange = (eventId: string, isAttending: boolean) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              isAttending,
              attendee_count: event.attendee_count + (isAttending ? 1 : -1),
            }
          : event
      )
    );
  };

  // Authentication check
  if (!currentUser && !loading) {
    return (
      <div className="text-center py-8">
        <div className="text-white/60 mb-4">
          Please log in to view personalized events
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors text-red-300"
        >
          Retry
        </button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-zinc-900 rounded-lg overflow-hidden animate-pulse border border-zinc-800"
          >
            <div className="aspect-video bg-zinc-800"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-zinc-800 rounded"></div>
              <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-zinc-800 rounded"></div>
                <div className="h-3 bg-zinc-800 rounded"></div>
                <div className="h-3 bg-zinc-800 rounded"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 bg-zinc-800 rounded w-16"></div>
                <div className="h-6 bg-zinc-800 rounded w-20"></div>
              </div>
              <div className="h-8 bg-zinc-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-white/60 mb-4">
          No events found. Try updating your interest preferences to discover
          relevant events.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          currentUserId={currentUser?.id}
          onAttendanceChange={handleAttendanceChange}
        />
      ))}
    </div>
  );
};
