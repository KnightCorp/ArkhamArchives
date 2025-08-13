import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Users,
  Navigation,
  Coffee,
  Book,
  ShoppingBag,
  Loader2,
  AlertCircle,
  RefreshCw,
  User,
  Star,
  Clock,
  ExternalLink,
  MessageCircle,
  Send,
  Bot,
  X,
  TreePine,
  Activity,
  Cross,
  Pill,
  Coins,
  AlertTriangle,
  Lock,
  Sparkles,
} from "lucide-react";
import {
  LocationService,
  LocationData,
  NearbyPlace,
  NearbyUser,
} from "../../services/locationService";
import GoogleMapsModal from "./GoogleMapsModal";
import { getCurrentUser } from "../../lib/socialMediaQueries";
import subscriptionQueries from "../../lib/subscriptionQueries";

interface LiveMapProps {
  currentUser: any;
}

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface UserProfile {
  tokens: number;
  subscription_plan: string;
  subscription_status: string;
  subscription_expires_at?: string;
  total_tokens_purchased: number;
  tokens_used: number;
}

export const LiveMap: React.FC<LiveMapProps> = ({ currentUser }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"places" | "users">("places");
  const [selectedPlaceType, setSelectedPlaceType] = useState<string>("all");
  const [address, setAddress] = useState<string>("");
  const [isSearchFromChat, setIsSearchFromChat] = useState(false);

  // Tokenization states
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);

  // Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hi! I can help you find places nearby using AI-powered search. Just tell me what you're looking for - like 'find coffee shops', 'restaurants near me', 'playgrounds around me', or 'libraries around here'. Each AI search costs 2 tokens.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Google Maps Modal state
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<{
    id: string;
    name: string;
    coordinates: { lat: number; lng: number };
    address?: string;
    rating?: number;
    distance: number;
    open_now?: boolean;
  } | null>(null);

  // Updated placeTypes to include all the types that can be searched
  const placeTypes = [
    { key: "all", label: "All Places", icon: MapPin },
    { key: "cafe", label: "Cafes", icon: Coffee },
    { key: "library", label: "Libraries", icon: Book },
    { key: "restaurant", label: "Restaurants", icon: ShoppingBag },
    { key: "park", label: "Parks & Playgrounds", icon: TreePine },
    { key: "pharmacy", label: "Pharmacies", icon: Pill },
    { key: "hospital", label: "Healthcare", icon: Cross },
    { key: "gym", label: "Fitness", icon: Activity },
  ];

  useEffect(() => {
    if (currentUser) {
      initializeLocation();
      initializeUserData();
    }
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const initializeUserData = async () => {
    try {
      const { user, error: userError } = await getCurrentUser();
      if (userError) throw userError;

      if (user?.id) {
        await loadUserProfile(user.id);

        // Subscribe to real-time token updates
        const subscription = subscriptionQueries.subscribeToUserProfile(
          user.id,
          (profile) => {
            setUserProfile(profile);
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      }
    } catch (error) {
      console.error("Error initializing user data:", error);
      setError("Failed to load user profile. Some features may be limited.");
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const profile =
        await subscriptionQueries.checkAndUpdateSubscriptionStatus(userId);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeLocation = async () => {
    if (!LocationService.isLocationAvailable()) {
      setError("Location services are not available in this browser.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userLocation = await LocationService.getCurrentLocation();
      setLocation(userLocation);

      // Get address for the location
      const locationAddress = await LocationService.reverseGeocode(
        userLocation
      );
      setAddress(locationAddress);

      // Update user location on the server
      if (currentUser?.id) {
        await LocationService.updateUserLocation(currentUser.id, userLocation);
      }

      // Load nearby data automatically
      await loadNearbyData(userLocation);
    } catch (err: any) {
      console.error("Error initializing location:", err);
      setError(
        err.message ||
          "Failed to get location. Please enable location services."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyData = async (userLocation: LocationData) => {
    if (!currentUser?.id) return;

    try {
      // Load nearby places
      const places = await LocationService.findNearbyPlaces(
        userLocation,
        selectedPlaceType,
        1000 // 1km radius
      );
      setNearbyPlaces(places);

      // Load nearby users
      const users = await LocationService.findNearbyUsers(
        userLocation,
        currentUser.id,
        5000 // 5km radius
      );
      setNearbyUsers(users);
    } catch (err: any) {
      console.error("Error loading nearby data:", err);
      // Don't set error here as location was successful
      console.warn("Could not load nearby data:", err.message);
    }
  };

  const handleRefresh = () => {
    if (location) {
      loadNearbyData(location);
    } else {
      initializeLocation();
    }
  };

  const handlePlaceTypeChange = async (newType: string) => {
    setSelectedPlaceType(newType);
    setIsSearchFromChat(false); // Reset chat search indicator
    if (location) {
      setLoading(true);
      try {
        const places = await LocationService.findNearbyPlaces(
          location,
          newType,
          1000
        );
        setNearbyPlaces(places);
      } catch (err: any) {
        console.error("Error filtering places:", err);
        setError("Failed to load places. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const searchPlacesWithAI = async (query: string) => {
    if (!location) return [];

    try {
      // Extract place type from AI query
      const placeType = extractPlaceTypeFromQuery(query);
      console.log("Extracted place type:", placeType, "from query:", query);

      // Search for places using the existing API with the specific type
      const places = await LocationService.findNearbyPlaces(
        location,
        placeType,
        2000 // 2km radius for AI searches
      );

      // Enhanced filtering for better matching
      if (placeType !== "all") {
        const queryLower = query.toLowerCase();
        const filteredPlaces = places.filter((place) => {
          const placeName = place.name.toLowerCase();
          const placeType_lower = place.type.toLowerCase();

          // For playground specifically, also check if name contains playground-related keywords
          if (
            placeType === "park" &&
            (queryLower.includes("playground") || queryLower.includes("play"))
          ) {
            return (
              placeType_lower.includes("park") ||
              placeType_lower.includes("playground") ||
              placeName.includes("playground") ||
              placeName.includes("play") ||
              placeName.includes("park") ||
              placeName.includes("recreation")
            );
          }

          // General type matching
          return (
            placeType_lower.includes(placeType.toLowerCase()) ||
            placeName.includes(placeType.toLowerCase()) ||
            placeType_lower === placeType.toLowerCase()
          );
        });

        console.log(
          `Filtered ${places.length} places to ${filteredPlaces.length} for type: ${placeType}`
        );
        return filteredPlaces;
      }

      return places;
    } catch (error) {
      console.error("Error searching places:", error);
      return [];
    }
  };

  const extractPlaceTypeFromQuery = (query: string): string => {
    const queryLower = query.toLowerCase();

    if (
      queryLower.includes("coffee") ||
      queryLower.includes("cafe") ||
      queryLower.includes("starbucks") ||
      queryLower.includes("espresso") ||
      queryLower.includes("latte")
    ) {
      return "cafe";
    } else if (
      queryLower.includes("restaurant") ||
      queryLower.includes("food") ||
      queryLower.includes("eat") ||
      queryLower.includes("dinner") ||
      queryLower.includes("lunch") ||
      queryLower.includes("dining") ||
      queryLower.includes("meal")
    ) {
      return "restaurant";
    } else if (
      queryLower.includes("library") ||
      queryLower.includes("book") ||
      queryLower.includes("study") ||
      queryLower.includes("libraries")
    ) {
      return "library";
    } else if (
      queryLower.includes("pharmacy") ||
      queryLower.includes("medicine") ||
      queryLower.includes("drug") ||
      queryLower.includes("medical") ||
      queryLower.includes("chemist")
    ) {
      return "pharmacy";
    } else if (
      queryLower.includes("park") ||
      queryLower.includes("parks") ||
      queryLower.includes("garden") ||
      queryLower.includes("green space") ||
      queryLower.includes("playground") ||
      queryLower.includes("playgrounds") ||
      queryLower.includes("play area") ||
      queryLower.includes("recreation")
    ) {
      return "park";
    } else if (
      queryLower.includes("hospital") ||
      queryLower.includes("clinic") ||
      queryLower.includes("health") ||
      queryLower.includes("medical center")
    ) {
      return "hospital";
    } else if (
      queryLower.includes("gym") ||
      queryLower.includes("fitness") ||
      queryLower.includes("workout") ||
      queryLower.includes("exercise")
    ) {
      return "gym";
    } else {
      return "all";
    }
  };

  const callDeepSeekAPI = async (userQuery: string): Promise<string> => {
    try {
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
      const apiUrl = import.meta.env.VITE_DEEPSEEK_API_URL;

      if (!apiKey || !apiUrl) {
        throw new Error("DeepSeek API configuration is missing");
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `You are a helpful location assistant. The user is asking about places near their location (${address}). Provide a brief, friendly response about what they're looking for. Keep responses under 100 words and focus on being helpful about local places.`,
            },
            {
              role: "user",
              content: userQuery,
            },
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return (
        data.choices[0]?.message?.content ||
        "I can help you find places nearby. What are you looking for?"
      );
    } catch (error) {
      console.error("DeepSeek API error:", error);
      return "I'm here to help you find places nearby! Just tell me what you're looking for.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Check if user is authenticated
    if (!currentUser?.id) {
      setError("Please log in to use AI-powered location search.");
      return;
    }

    // Check if user has enough tokens for AI search
    const tokensRequired = 2; // Set the cost for AI location search
    const hasEnoughTokens = await subscriptionQueries.hasEnoughTokens(
      currentUser.id,
      tokensRequired
    );

    if (!hasEnoughTokens) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `Insufficient tokens. You need ${tokensRequired} tokens to use AI-powered location search. Please purchase more tokens to continue. You can still use the manual filters above for free!`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsChatLoading(true);
    setTokenLoading(true);

    try {
      // First, consume the tokens
      const tokenResult = await subscriptionQueries.consumeTokens(
        currentUser.id,
        "location_search",
        tokensRequired
      );

      if (!tokenResult.success) {
        throw new Error(tokenResult.error || "Failed to consume tokens");
      }

      // Search for places based on user query
      const places = await searchPlacesWithAI(inputMessage);

      // Update the places list with search results
      setNearbyPlaces(places);

      // Reset the place type filter to show search results
      const extractedType = extractPlaceTypeFromQuery(inputMessage);
      setSelectedPlaceType(extractedType);
      setIsSearchFromChat(true); // Mark as chat search

      // Switch to places tab to show results
      setActiveTab("places");

      // Get AI response
      const aiResponse = await callDeepSeekAPI(inputMessage);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          places.length > 0
            ? `${aiResponse}\n\nI found ${places.length} places for you! I've updated the places list below. ${tokensRequired} tokens consumed. Remaining: ${tokenResult.remainingTokens}`
            : `${aiResponse}\n\nI couldn't find specific places matching your request. You can try a different search or use the filter buttons above for free. ${tokensRequired} tokens consumed. Remaining: ${tokenResult.remainingTokens}`,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, botMessage]);

      // Show success message briefly
      setTimeout(() => {
        setError(
          `AI search completed! Remaining tokens: ${tokenResult.remainingTokens}`
        );
        setTimeout(() => setError(null), 3000);
      }, 1000);
    } catch (error) {
      console.error("Error processing message:", error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          "I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
      setTokenLoading(false);
    }
  };

  const handleNavigateClick = (place: NearbyPlace) => {
    setSelectedDestination({
      id: place.id,
      name: place.name,
      coordinates: { lat: place.coordinates.lat, lng: place.coordinates.lng },
      address: place.address,
      rating: place.rating,
      distance: place.distance,
      open_now: place.open_now,
    });
    setIsMapModalOpen(true);
  };

  const closeMapModal = () => {
    setIsMapModalOpen(false);
    setSelectedDestination(null);
  };

  const TokenStatus = () => {
    if (!currentUser || !userProfile) return null;

    const getStatusColor = (status: string) => {
      switch (status) {
        case "active":
          return "text-green-400";
        case "expired":
          return "text-yellow-400";
        case "cancelled":
          return "text-red-400";
        default:
          return "text-gray-400";
      }
    };

    return (
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Coins className="w-5 h-5 text-white/60" />
            <div>
              <span className="text-white text-sm font-medium">
                {userProfile.tokens} Tokens Available
              </span>
              <div className="text-white/60 text-xs">
                Plan: {userProfile.subscription_plan.toUpperCase()} | Status:{" "}
                <span
                  className={getStatusColor(userProfile.subscription_status)}
                >
                  {userProfile.subscription_status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="text-white/60 text-sm">AI Search: 2 tokens each</div>
        </div>

        {userProfile.tokens < 2 && (
          <div className="mt-3 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/20 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm">
              Low tokens! You need 2 tokens for AI-powered location searches.
            </span>
          </div>
        )}

        {userProfile.subscription_status === "expired" && (
          <div className="mt-3 p-3 bg-red-500/20 rounded-lg border border-red-500/20 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm">
              Your subscription has expired. Purchase a new plan to get more
              tokens.
            </span>
          </div>
        )}
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="text-center py-8 text-white/60">
        Please log in to use location features.
      </div>
    );
  }

  if (loading && !location) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-white/60" />
        <span className="ml-2 text-white/60">Getting your location...</span>
      </div>
    );
  }

  if (error && !location) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={initializeLocation}
          className="px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 backdrop-blur-xl rounded-lg p-4 border border-red-500/20 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-300 hover:text-red-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Token Status */}
      <TokenStatus />

      {/* Location Header */}
      {location && (
        <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-white font-medium">Your Location</div>
                <div className="text-white/60 text-sm">
                  {address || "Loading address..."}
                </div>
                <div className="text-white/40 text-xs mt-1">
                  {location.latitude.toFixed(4)},{" "}
                  {location.longitude.toFixed(4)}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 text-white/60 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-black/20 backdrop-blur-xl rounded-lg p-1 border border-white/5">
        <button
          onClick={() => setActiveTab("places")}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "places"
              ? "bg-white/10 text-white shadow-sm"
              : "text-white/60 hover:text-white/80 hover:bg-white/5"
          }`}
        >
          <MapPin className="w-4 h-4 inline mr-2" />
          Places ({nearbyPlaces.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "users"
              ? "bg-white/10 text-white shadow-sm"
              : "text-white/60 hover:text-white/80 hover:bg-white/5"
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Users ({nearbyUsers.length})
        </button>
      </div>

      {/* Places Tab */}
      {activeTab === "places" && (
        <div className="space-y-4">
          {/* Search Results Indicator */}
          {isSearchFromChat && nearbyPlaces.length > 0 && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-blue-400 font-medium text-sm">
                  Showing AI Search Results ({nearbyPlaces.length} found)
                </p>
                <p className="text-blue-400/70 text-xs">
                  Use the filter buttons below for free searches, or ask the AI
                  assistant for smarter results
                </p>
              </div>
            </div>
          )}

          {/* Place Type Filters */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {placeTypes.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handlePlaceTypeChange(key)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedPlaceType === key
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Places List */}
          <div className="space-y-3">
            {loading && (
              <div className="text-center py-4">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-white/60" />
                <p className="text-white/60 text-sm mt-2">
                  Searching places...
                </p>
              </div>
            )}
            {!loading && nearbyPlaces.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-white/30" />
                <p>No nearby places found.</p>
                <p className="text-sm mt-2">
                  Try using the AI chatbot for smarter searches or the filter
                  buttons above for free browsing.
                </p>
              </div>
            ) : (
              !loading &&
              nearbyPlaces.map((place) => (
                <div
                  key={place.id}
                  className="bg-black/40 backdrop-blur-xl rounded-lg overflow-hidden border border-white/5 hover:border-white/10 transition-colors"
                >
                  {place.photo_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={place.photo_url}
                        alt={place.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-white font-medium text-lg">
                            {place.name}
                          </h3>
                          {place.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-yellow-400 text-sm font-medium">
                                ({place.rating}⭐)
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="text-white/60 text-sm mb-2">
                          📍 {place.address}
                        </p>

                        <p className="text-white/60 text-xs mb-2">
                          📍 Coordinates: {place.coordinates.lat.toFixed(4)},{" "}
                          {place.coordinates.lng.toFixed(4)}
                        </p>

                        {place.open_now !== null && (
                          <div className="flex items-center space-x-1 mb-2">
                            <Clock className="w-4 h-4" />
                            <span
                              className={`text-sm font-medium ${
                                place.open_now
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {place.open_now ? "🟢 Open now" : "🔴 Closed"}
                            </span>
                          </div>
                        )}

                        {place.review && (
                          <div className="mb-3">
                            <p className="text-white/80 text-sm italic">
                              📝 Review: {place.review}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-3">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                              {place.type}
                            </span>
                            <span className="text-white/60 text-sm">
                              {LocationService.formatDistance(place.distance)}
                            </span>
                          </div>

                          <button
                            onClick={() => handleNavigateClick(place)}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
                          >
                            <Navigation className="w-4 h-4" />
                            <span>Navigate</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-3">
          {nearbyUsers.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <User className="w-12 h-12 mx-auto mb-4 text-white/30" />
              <p>No nearby users found.</p>
            </div>
          ) : (
            nearbyUsers.map((user) => (
              <div
                key={user.id}
                className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{user.name}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-white/60 text-sm">
                        {LocationService.formatDistance(user.distance)} away
                      </span>
                      <span
                        className={`text-xs ${
                          user.isOnline ? "text-green-400" : "text-white/60"
                        }`}
                      >
                        {user.isOnline ? "Online" : "Last seen recently"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center z-40 transition-all duration-300 hover:scale-110 group"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        {userProfile && userProfile.tokens < 2 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <Lock className="w-3 h-3 text-white" />
          </div>
        )}
      </button>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          <div className="bg-black/90 backdrop-blur-xl rounded-lg border border-white/10 w-96 h-96 flex flex-col shadow-2xl">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-white font-medium">
                    AI Location Assistant
                  </h3>
                  {userProfile && (
                    <div className="flex items-center space-x-2 text-xs">
                      <Coins className="w-3 h-3 text-white/60" />
                      <span className="text-white/60">
                        {userProfile.tokens} tokens | 2 per search
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* Token Warning in Chat */}
            {userProfile && userProfile.tokens < 2 && (
              <div className="p-3 bg-red-500/20 border-b border-red-500/20 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-300 text-xs">
                  Insufficient tokens for AI search. Use manual filters above
                  for free!
                </span>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white/10 text-white/90 border border-white/20"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 border border-white/20 px-3 py-2 rounded-lg flex items-center space-x-2">
                    {tokenLoading ? (
                      <>
                        <Coins className="w-4 h-4 text-blue-400" />
                        <Loader2 className="w-4 h-4 animate-spin text-white/60" />
                        <span className="text-xs text-white/60">
                          Consuming tokens...
                        </span>
                      </>
                    ) : (
                      <Loader2 className="w-4 h-4 animate-spin text-white/60" />
                    )}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={
                    userProfile && userProfile.tokens < 2
                      ? "Insufficient tokens - use filters above"
                      : "Ask me to find places... (2 tokens)"
                  }
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-500 text-sm"
                  // disabled={
                  //   (userProfile ? userProfile.tokens < 2 : false) ||
                  //   !inputMessage.trim() ||
                  //   !currentUser
                  // }
                />
                <button
                  onClick={handleSendMessage}
                  disabled={
                    !inputMessage.trim() ||
                    isChatLoading ||
                    !currentUser ||
                    !!(userProfile && userProfile.tokens < 2)
                  }
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-lg transition-colors flex items-center space-x-1"
                >
                  {userProfile && userProfile.tokens < 2 ? (
                    <Lock className="w-4 h-4 text-white" />
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
              {userProfile && (
                <div className="flex items-center justify-between mt-2 text-xs text-white/60">
                  <span>AI searches cost 2 tokens each</span>
                  <span className="flex items-center space-x-1">
                    <Coins className="w-3 h-3" />
                    <span>{userProfile.tokens} available</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Google Maps Modal */}
      {selectedDestination && (
        <GoogleMapsModal
          isOpen={isMapModalOpen}
          onClose={closeMapModal}
          destination={selectedDestination}
          currentLocation={location}
        />
      )}
    </div>
  );
};
