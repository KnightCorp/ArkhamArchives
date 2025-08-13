// LocationsSection.tsx
import React, { useState, useEffect } from "react";
import { MapPin, Clock, Star, Filter, Search } from "lucide-react";
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

const LocationCard = ({ location }: { location: Location }) => (
  <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-300 group">
    <div className="relative overflow-hidden">
      <img
        src={
          location.image_url ||
          getDefaultImageForLocationType(location.location_type)
        }
        alt={location.name}
        className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
      />
      <div className="absolute top-3 right-3">
        <span className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center">
          <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
          {location.rating}
        </span>
      </div>
      {location.featured && (
        <div className="absolute top-3 left-3">
          <span className="bg-purple-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </span>
        </div>
      )}
    </div>

    <div className="p-4">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl text-zinc-200 font-medium group-hover:text-white transition-colors">
          {location.name}
        </h3>
        <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded capitalize">
          {location.location_type}
        </span>
      </div>

      <div className="space-y-2 text-zinc-400 mb-3">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">
            {location.address}, {location.city}
            {location.distance && (
              <span className="text-zinc-500"> • {location.distance}km</span>
            )}
          </span>
        </div>
        {location.open_hours && (
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{location.open_hours}</span>
          </div>
        )}
      </div>

      {/* Related Interests */}
      {location.related_interests && location.related_interests.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {location.related_interests.slice(0, 3).map((interest, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 transition-colors"
            >
              {interest}
            </span>
          ))}
          {location.related_interests.length > 3 && (
            <span className="px-2 py-1 text-xs bg-zinc-800 text-zinc-400 rounded">
              +{location.related_interests.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Amenities */}
      {location.amenities && location.amenities.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {location.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-purple-900/30 border border-purple-800/30 text-purple-300 rounded"
            >
              {amenity}
            </span>
          ))}
          {location.amenities.length > 3 && (
            <span className="px-2 py-1 text-xs bg-purple-900/20 border border-purple-800/20 text-purple-400 rounded">
              +{location.amenities.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  </div>
);

// Helper function to get default images based on location type
const getDefaultImageForLocationType = (type: string) => {
  const imageMap = {
    venue:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop",
    restaurant:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    cafe: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
    park: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    gallery:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    club: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop",
  };
  return imageMap[type as keyof typeof imageMap] || imageMap.venue;
};

export const LocationsSection = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "name">(
    "rating"
  );

  // Get current user ID (you'll need to implement this based on your auth system)
  const getCurrentUserId = () => {
    // Replace with your actual auth logic
    return "current-user-id";
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const userId = getCurrentUserId();
        const { data, error } = await profileQueries.getPersonalizedLocations(
          userId,
          20
        );

        if (error) {
          console.error("Error fetching personalized locations:", error);
          // Fallback: you could implement a general getAllLocations function
          return;
        }

        setLocations(data || []);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Filter and sort locations
  const filteredAndSortedLocations = React.useMemo(() => {
    let filtered = locations.filter((location) => {
      const matchesSearch =
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === "all" || location.location_type === selectedType;

      return matchesSearch && matchesType;
    });

    // Sort locations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "distance":
          return (a.distance || 0) - (b.distance || 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [locations, searchQuery, selectedType, sortBy]);

  const locationTypes = [
    { value: "all", label: "All Types" },
    { value: "venue", label: "Venues" },
    { value: "restaurant", label: "Restaurants" },
    { value: "cafe", label: "Cafes" },
    { value: "park", label: "Parks" },
    { value: "gallery", label: "Galleries" },
    { value: "club", label: "Clubs" },
  ];

  if (loading) {
    return (
      <div>
        {/* Loading skeleton for filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 h-10 bg-zinc-800 rounded-lg animate-pulse"></div>
          <div className="w-40 h-10 bg-zinc-800 rounded-lg animate-pulse"></div>
          <div className="w-32 h-10 bg-zinc-800 rounded-lg animate-pulse"></div>
        </div>

        {/* Loading skeleton for cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-zinc-900 rounded-lg overflow-hidden animate-pulse border border-zinc-800"
            >
              <div className="h-48 bg-zinc-800"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-zinc-800 rounded"></div>
                <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-zinc-800 rounded"></div>
                  <div className="h-3 bg-zinc-800 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-zinc-800 rounded w-16"></div>
                  <div className="h-6 bg-zinc-800 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {locationTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "rating" | "distance" | "name")
          }
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="rating">By Rating</option>
          <option value="distance">By Distance</option>
          <option value="name">By Name</option>
        </select>
      </div>

      {/* Results count */}
      <div className="text-zinc-400 text-sm mb-4">
        Showing {filteredAndSortedLocations.length} location
        {filteredAndSortedLocations.length !== 1 ? "s" : ""}
        {searchQuery && ` for "${searchQuery}"`}
      </div>

      {/* Locations Grid */}
      {filteredAndSortedLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      ) : (
        <div className="text-center text-zinc-400 py-12">
          <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg mb-2">No locations found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};
