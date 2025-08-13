/**
 * Location Service for Live Map Integration
 * Handles location-based features including nearby users, places, and location tagging
 */

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

export interface NearbyPlace {
  id: string;
  name: string;
  type: string;
  distance: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  address?: string;
  rating?: number;
  photo_url?: string;
  review?: string;
  open_now?: boolean;
}

export interface NearbyUser {
  id: string;
  name: string;
  avatar: string;
  distance: number;
  lastSeen: string;
  isOnline: boolean;
}

export interface LocationServiceResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class LocationService {
  private static readonly API_BASE_URL =
    "https://live-map-service-343916782787.us-central1.run.app";

  /**
   * Get user's current location
   */
  static async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          let errorMessage = "Unable to retrieve location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  /**
   * Find nearby places using the Live Map Service API
   */
  static async findNearbyPlaces(
    location: LocationData,
    placeType: string = "all",
    radius: number = 1000
  ): Promise<NearbyPlace[]> {
    try {
      // Map place types to match the live map service
      const typeMapping: { [key: string]: string } = {
        cafe: "cafe",
        library: "library",
        restaurant: "restaurant",
        pharmacy: "pharmacy",
        book_store: "book_store",
      };

      // For 'all', we need to make multiple requests since API doesn't support multiple types
      if (placeType === "all") {
        const allTypes = ["cafe", "restaurant", "library"];
        const allPlacesPromises = allTypes.map(async (type) => {
          try {
            const url = `${this.API_BASE_URL}/api/nearby_places?lat=${location.latitude}&lng=${location.longitude}&type=${type}`;
            const response = await fetch(url, {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            });

            if (!response.ok) {
              console.warn(`Failed to fetch ${type} places:`, response.status);
              return [];
            }

            const result = await response.json();
            const places = Array.isArray(result) ? result : [];

            return places.map((place: any) => ({
              id:
                place.place_id ||
                place.id ||
                `place_${type}_${Date.now()}_${Math.random()}`,
              name: place.name || place.title || "Unknown Place",
              type: place.types?.[0] || place.type || type,
              distance:
                place.distance ||
                this.calculateDistance(
                  location.latitude,
                  location.longitude,
                  place.lat || location.latitude,
                  place.lng || location.longitude
                ),
              coordinates: {
                lat: place.lat || location.latitude,
                lng: place.lng || location.longitude,
              },
              address:
                place.address ||
                place.formatted_address ||
                place.vicinity ||
                "",
              rating: place.rating || null,
              photo_url: place.photo_url || null,
              review: place.review || null,
              open_now: place.open_now !== undefined ? place.open_now : null,
            }));
          } catch (err) {
            console.warn(`Error fetching ${type} places:`, err);
            return [];
          }
        });

        const allPlacesArrays = await Promise.all(allPlacesPromises);
        const allPlaces = allPlacesArrays.flat();

        // Sort by distance and limit to reasonable number
        return allPlaces.sort((a, b) => a.distance - b.distance).slice(0, 15); // Limit to 15 places total
      }

      // Single place type request
      const mappedType = typeMapping[placeType] || "cafe";

      const url = `${this.API_BASE_URL}/api/nearby_places?lat=${location.latitude}&lng=${location.longitude}&type=${mappedType}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(
          `Failed to find nearby places. Status: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();

      // The API returns an array directly, not nested in results/places/data
      const places = Array.isArray(result)
        ? result
        : result.results || result.places || result.data || [];

      return places.map((place: any) => ({
        id:
          place.place_id || place.id || `place_${Date.now()}_${Math.random()}`,
        name: place.name || place.title || "Unknown Place",
        type: place.types?.[0] || place.type || mappedType,
        distance:
          place.distance ||
          this.calculateDistance(
            location.latitude,
            location.longitude,
            place.lat || location.latitude,
            place.lng || location.longitude
          ),
        coordinates: {
          lat: place.lat || location.latitude,
          lng: place.lng || location.longitude,
        },
        address:
          place.address || place.formatted_address || place.vicinity || "",
        rating: place.rating || null,
        photo_url: place.photo_url || null,
        review: place.review || null,
        open_now: place.open_now !== undefined ? place.open_now : null,
      }));
    } catch (error) {
      console.error("Error finding nearby places:", error);
      // Return mock data if API fails
      return this.getMockPlaces(location, placeType);
    }
  }

  /**
   * Find nearby users using the Live Map Service API
   */
  static async findNearbyUsers(
    location: LocationData,
    userId: string,
    radius: number = 5000
  ): Promise<NearbyUser[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/nearby-users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          latitude: location.latitude,
          longitude: location.longitude,
          radius: radius,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(
          `Failed to find nearby users. Status: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();

      // Extract users from various possible response formats
      const users = result.users || result.data || result.results || [];

      return users.map((user: any) => ({
        id: user.id || user.user_id,
        name: user.name || user.username || user.display_name || "Unknown User",
        avatar:
          user.avatar ||
          user.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name || "User"
          )}&background=6366f1&color=ffffff&size=150`,
        distance: user.distance || 0,
        lastSeen: user.last_seen || user.lastSeen || new Date().toISOString(),
        isOnline: user.is_online || user.isOnline || false,
      }));
    } catch (error) {
      console.error("Error finding nearby users:", error);
      // Return mock users if API fails
      return this.getMockUsers(location, userId);
    }
  }

  /**
   * Update user's location on the live map
   */
  static async updateUserLocation(
    userId: string,
    location: LocationData
  ): Promise<LocationServiceResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/update-location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(
          `Failed to update location. Status: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Error updating user location:", error);
      return {
        success: false,
        error: `Could not update location: ${error}`,
      };
    }
  }

  /**
   * Get location-based posts/content
   */
  static async getLocationBasedContent(
    location: LocationData,
    radius: number = 10000
  ): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/location-content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          radius: radius,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(
          `Failed to get location content. Status: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();

      return result.content || result.data || result.posts || [];
    } catch (error) {
      console.error("Error getting location-based content:", error);
      throw new Error(`Could not get location content: ${error}`);
    }
  }

  /**
   * Reverse geocode coordinates to get address using OpenStreetMap Nominatim
   */
  static async reverseGeocode(location: LocationData): Promise<string> {
    try {
      // Use OpenStreetMap Nominatim for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "SocialApp/1.0",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed with status: ${response.status}`);
      }

      const result = await response.json();

      return (
        result.display_name ||
        result.address?.display_name ||
        "Unknown Location"
      );
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      return "Location unavailable";
    }
  }

  /**
   * Get mock places for fallback when API fails
   */
  private static getMockPlaces(
    location: LocationData,
    placeType: string
  ): NearbyPlace[] {
    const mockPlaces = [
      {
        id: "mock_cafe_1",
        name: "Local Coffee Shop",
        type: "cafe",
        distance: 150,
        coordinates: {
          lat: location.latitude + 0.001,
          lng: location.longitude + 0.001,
        },
        address: "Nearby Cafe",
      },
      {
        id: "mock_library_1",
        name: "Public Library",
        type: "library",
        distance: 300,
        coordinates: {
          lat: location.latitude - 0.002,
          lng: location.longitude + 0.002,
        },
        address: "Local Library",
      },
      {
        id: "mock_restaurant_1",
        name: "Restaurant",
        type: "restaurant",
        distance: 450,
        coordinates: {
          lat: location.latitude + 0.003,
          lng: location.longitude - 0.001,
        },
        address: "Local Restaurant",
      },
    ];

    if (placeType === "all") {
      return mockPlaces;
    }

    return mockPlaces.filter((place) => place.type === placeType);
  }

  /**
   * Get mock users for fallback when API fails
   */
  private static getMockUsers(
    location: LocationData,
    currentUserId: string
  ): NearbyUser[] {
    const mockUsers = [
      {
        id: "mock_user_1",
        name: "Alex Johnson",
        avatar:
          "https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=ffffff&size=150",
        distance: 200,
        lastSeen: new Date().toISOString(),
        isOnline: true,
      },
      {
        id: "mock_user_2",
        name: "Sarah Chen",
        avatar:
          "https://ui-avatars.com/api/?name=Sarah+Chen&background=8b5cf6&color=ffffff&size=150",
        distance: 800,
        lastSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        isOnline: false,
      },
      {
        id: "mock_user_3",
        name: "Mike Davis",
        avatar:
          "https://ui-avatars.com/api/?name=Mike+Davis&background=ec4899&color=ffffff&size=150",
        distance: 1200,
        lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        isOnline: true,
      },
    ];

    // Filter out current user
    return mockUsers.filter((user) => user.id !== currentUserId);
  }

  /**
   * Calculate distance between two points in meters
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  /**
   * Format distance for display
   */
  static formatDistance(distanceInMeters: number): string {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)}m`;
    } else {
      return `${(distanceInMeters / 1000).toFixed(1)}km`;
    }
  }

  /**
   * Check if location services are available
   */
  static isLocationAvailable(): boolean {
    return "geolocation" in navigator;
  }
}
