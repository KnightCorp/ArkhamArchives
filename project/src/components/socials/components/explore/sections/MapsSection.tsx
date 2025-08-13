// MapsSection.tsx
import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Users,
  Calendar,
  Clock,
  Star,
  Filter,
} from "lucide-react";
import { profileQueries } from "../../../lib/exploreQueries";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  coordinates: any;
  distance: number | null;
  rating: number;
  image_url: string | null;
  open_hours: string | null;
  location_type: "venue" | "restaurant" | "cafe" | "park" | "gallery" | "club";
  related_interests: string[];
  amenities: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

interface Event {
  id: string;
  title: string;
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
}

export const MapsSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [filterType, setFilterType] = useState<string>("all");

  // Get current user ID (implement based on your auth system)
  const getCurrentUserId = () => {
    // Replace with your actual auth logic
    return "current-user-id";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getCurrentUserId();

        const [locationsResult, eventsResult] = await Promise.all([
          profileQueries.getPersonalizedLocations(userId, 15),
          profileQueries.getPersonalizedEvents(userId, 10),
        ]);

        if (locationsResult.error) {
          console.error("Error fetching locations:", locationsResult.error);
        } else {
          setLocations(locationsResult.data || []);
        }

        if (eventsResult.error) {
          console.error("Error fetching events:", eventsResult.error);
        } else {
          setEvents(eventsResult.data || []);
        }
      } catch (error) {
        console.error("Error fetching map data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.location_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === "all" || location.location_type === filterType;

    return matchesSearch && matchesType;
  });

  const getUpcomingEventsForLocation = (locationName: string) => {
    return events.filter((event) =>
      event.location_name?.toLowerCase().includes(locationName.toLowerCase())
    ).length;
  };

  const getLocationTypeColor = (type: string) => {
    const colors = {
      venue: "bg-blue-500",
      restaurant: "bg-orange-500",
      cafe: "bg-yellow-500",
      park: "bg-green-500",
      gallery: "bg-purple-500",
      club: "bg-pink-500",
    };
    return colors[type as keyof typeof colors] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-zinc-900 rounded-lg p-6 border border-zinc-800 animate-pulse">
          <div className="aspect-[16/10] bg-zinc-800 rounded-lg"></div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 animate-pulse">
          <div className="h-10 bg-zinc-800 rounded-lg mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-zinc-800 rounded-lg p-4">
                <div className="h-4 bg-zinc-700 rounded mb-2"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-zinc-700 rounded"></div>
                  <div className="h-3 bg-zinc-700 rounded"></div>
                  <div className="h-3 bg-zinc-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Map View */}
      <div className="col-span-2 bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-zinc-200 font-medium">Interactive Map</h3>
          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1 text-sm text-zinc-200"
            >
              <option value="all">All Types</option>
              <option value="venue">Venues</option>
              <option value="restaurant">Restaurants</option>
              <option value="cafe">Cafes</option>
              <option value="park">Parks</option>
              <option value="gallery">Galleries</option>
              <option value="club">Clubs</option>
            </select>
          </div>
        </div>

        <div className="aspect-[16/10] bg-zinc-800 rounded-lg relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&h=900&fit=crop"
            alt="Map"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/50" />

          {/* Location Markers */}
          {filteredLocations.slice(0, 12).map((location, index) => (
            <div
              key={location.id}
              className="absolute cursor-pointer group"
              style={{
                left: `${15 + (index % 4) * 20}%`,
                top: `${25 + Math.floor(index / 4) * 20}%`,
              }}
              onClick={() => setSelectedLocation(location)}
            >
              <div
                className={`w-4 h-4 ${getLocationTypeColor(
                  location.location_type
                )} rounded-full transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform shadow-lg border-2 border-white`}
              >
                <div
                  className={`absolute -top-1 -right-1 w-2 h-2 ${getLocationTypeColor(
                    location.location_type
                  )} rounded-full animate-ping opacity-75`}
                />
              </div>

              {/* Location Info Popup */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-zinc-800/95 backdrop-blur-sm text-zinc-200 px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-zinc-700">
                <div className="font-medium">{location.name}</div>
                <div className="text-zinc-400 text-xs flex items-center">
                  <span className="capitalize">{location.location_type}</span>
                  {location.distance && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{location.distance}km</span>
                    </>
                  )}
                  <span className="mx-1">•</span>
                  <span className="flex items-center">
                    <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                    {location.rating}
                  </span>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-zinc-800"></div>
              </div>
            </div>
          ))}

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-zinc-800/90 backdrop-blur-sm rounded-lg p-3 border border-zinc-700">
            <div className="text-xs text-zinc-300 mb-2 font-medium">
              Location Types
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { type: "venue", label: "Venues" },
                { type: "restaurant", label: "Restaurants" },
                { type: "cafe", label: "Cafes" },
                { type: "park", label: "Parks" },
                { type: "gallery", label: "Galleries" },
                { type: "club", label: "Clubs" },
              ].map(({ type, label }) => (
                <div key={type} className="flex items-center">
                  <div
                    className={`w-2 h-2 ${getLocationTypeColor(
                      type
                    )} rounded-full mr-2`}
                  ></div>
                  <span className="text-zinc-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Location Details */}
        {selectedLocation && (
          <div className="mt-4 bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-zinc-200 font-medium text-lg">
                  {selectedLocation.name}
                </h3>
                <div className="flex items-center text-sm text-zinc-400 mt-1">
                  <span className="capitalize">
                    {selectedLocation.location_type}
                  </span>
                  <span className="mx-2">•</span>
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                  <span>{selectedLocation.rating}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-zinc-400 hover:text-zinc-200 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-zinc-400">
              <div>
                <div className="flex items-start mb-2">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    {selectedLocation.address}, {selectedLocation.city}
                  </span>
                </div>
                {selectedLocation.open_hours && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{selectedLocation.open_hours}</span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>
                    {getUpcomingEventsForLocation(selectedLocation.name)}{" "}
                    upcoming events
                  </span>
                </div>
                {selectedLocation.distance && (
                  <div className="text-zinc-300">
                    📍 {selectedLocation.distance}km away
                  </div>
                )}
              </div>
            </div>

            {/* Related Interests */}
            {selectedLocation.related_interests &&
              selectedLocation.related_interests.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-zinc-400 mb-2">
                    Related Interests:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedLocation.related_interests
                      .slice(0, 4)
                      .map((interest, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-purple-900/30 border border-purple-800/30 text-purple-300 rounded"
                        >
                          {interest}
                        </span>
                      ))}
                  </div>
                </div>
              )}

            {/* Amenities */}
            {selectedLocation.amenities &&
              selectedLocation.amenities.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-zinc-400 mb-2">Amenities:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedLocation.amenities
                      .slice(0, 6)
                      .map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-zinc-700 text-zinc-300 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                    {selectedLocation.amenities.length > 6 && (
                      <span className="px-2 py-1 text-xs bg-zinc-700 text-zinc-400 rounded">
                        +{selectedLocation.amenities.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Locations List */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="text-xs text-zinc-400 mb-4">
          {filteredLocations.length} location
          {filteredLocations.length !== 1 ? "s" : ""} found
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              className={`bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700/50 transition-colors cursor-pointer border ${
                selectedLocation?.id === location.id
                  ? "border-purple-500 bg-zinc-700/30"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedLocation(location)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-zinc-200 font-medium">{location.name}</h3>
                <div className="flex items-center text-sm">
                  <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                  <span className="text-zinc-400">{location.rating}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-zinc-400">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    {location.address}, {location.city}
                    {location.distance && (
                      <span className="text-zinc-500">
                        {" "}
                        • {location.distance}km
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 ${getLocationTypeColor(
                      location.location_type
                    )} rounded-full mr-2`}
                  ></div>
                  <span className="capitalize">{location.location_type}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>
                    {getUpcomingEventsForLocation(location.name)} upcoming
                    events
                  </span>
                </div>
              </div>

              {location.related_interests &&
                location.related_interests.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {location.related_interests
                      .slice(0, 2)
                      .map((interest, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-zinc-700 text-zinc-300 rounded"
                        >
                          {interest}
                        </span>
                      ))}
                    {location.related_interests.length > 2 && (
                      <span className="px-2 py-1 text-xs bg-zinc-700 text-zinc-400 rounded">
                        +{location.related_interests.length - 2} more
                      </span>
                    )}
                  </div>
                )}
            </div>
          ))}

          {filteredLocations.length === 0 && (
            <div className="text-center text-zinc-400 py-8">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <div>No locations found matching your search.</div>
              <div className="text-sm mt-1">
                Try adjusting your search or filter.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
