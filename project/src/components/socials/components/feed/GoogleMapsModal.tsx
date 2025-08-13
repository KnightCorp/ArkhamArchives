import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Navigation,
  Loader2,
  AlertCircle,
  RefreshCw,
  Star,
  Clock,
  ExternalLink,
  X,
  Route,
  Eye,
} from "lucide-react";

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

// Google Maps Modal Component - Compact Version
interface GoogleMapsModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: {
    id: string;
    name: string;
    coordinates: { lat: number; lng: number };
    address?: string;
    rating?: number;
    distance: number;
    open_now?: boolean;
  };
  currentLocation: { latitude: number; longitude: number } | null;
}

const GoogleMapsModal: React.FC<GoogleMapsModalProps> = ({
  isOpen,
  onClose,
  destination,
  currentLocation,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const streetViewRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [streetView, setStreetView] = useState<any>(null);
  const [directionsService, setDirectionsService] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [streetViewAvailable, setStreetViewAvailable] = useState(true);
  const [activeView, setActiveView] = useState<"map" | "street">("map");
  const [error, setError] = useState<string | null>(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && currentLocation && destination) {
      initializeGoogleMaps();
    }
  }, [isOpen, currentLocation, destination]);

  const loadGoogleMapsScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        setGoogleMapsLoaded(true);
        resolve();
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      if (existingScript) {
        // Wait for existing script to load
        existingScript.addEventListener("load", () => {
          setGoogleMapsLoaded(true);
          resolve();
        });
        existingScript.addEventListener("error", () =>
          reject(new Error("Failed to load Google Maps"))
        );
        return;
      }

      // Load Google Maps script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setGoogleMapsLoaded(true);
        resolve();
      };

      script.onerror = () => {
        setError(
          "Failed to load Google Maps. Please check your internet connection."
        );
        reject(new Error("Failed to load Google Maps"));
      };

      document.head.appendChild(script);
    });
  };

  const initializeGoogleMaps = async () => {
    try {
      setLoading(true);
      setError(null);

      await loadGoogleMapsScript();

      // Small delay to ensure Google Maps is fully initialized
      setTimeout(() => {
        if (window.google && window.google.maps) {
          initMap();
        } else {
          setError("Google Maps failed to initialize properly.");
          setLoading(false);
        }
      }, 100);
    } catch (error) {
      console.error("Error loading Google Maps:", error);
      setError("Unable to load Google Maps. Please try again.");
      setLoading(false);
    }
  };

  const initMap = () => {
    if (!mapRef.current || !currentLocation || !window.google?.maps) {
      setError("Map container or location data not available.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Create map instance
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: {
          lat: currentLocation.latitude,
          lng: currentLocation.longitude,
        },
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: [
          {
            elementType: "geometry",
            stylers: [{ color: "#1d2c4d" }],
          },
          {
            elementType: "labels.text.fill",
            stylers: [{ color: "#8ec3b9" }],
          },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#1a3646" }],
          },
          {
            featureType: "administrative.country",
            elementType: "geometry.stroke",
            stylers: [{ color: "#4b6878" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#304a7d" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#0e1626" }],
          },
        ],
      });

      setMap(mapInstance);

      // Add current location marker
      const currentLocationMarker = new window.google.maps.Marker({
        position: {
          lat: currentLocation.latitude,
          lng: currentLocation.longitude,
        },
        map: mapInstance,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(30, 30),
        },
        title: "Your Location",
        animation: window.google.maps.Animation.DROP,
      });

      // Add destination marker
      const destinationMarker = new window.google.maps.Marker({
        position: {
          lat: destination.coordinates.lat,
          lng: destination.coordinates.lng,
        },
        map: mapInstance,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new window.google.maps.Size(30, 30),
        },
        title: destination.name,
        animation: window.google.maps.Animation.DROP,
      });

      // Add info window for destination
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="color: #333; max-width: 200px;">
            <h4 style="margin: 0 0 6px 0; color: #1f2937; font-size: 14px;">${
              destination.name
            }</h4>
            ${
              destination.address
                ? `<p style="margin: 0 0 3px 0; color: #666; font-size: 12px;">${destination.address}</p>`
                : ""
            }
            ${
              destination.rating
                ? `<p style="margin: 0; color: #666; font-size: 12px;">⭐ ${destination.rating}</p>`
                : ""
            }
          </div>
        `,
      });

      // Show info window when destination marker is clicked
      destinationMarker.addListener("click", () => {
        infoWindow.open(mapInstance, destinationMarker);
      });

      // Initialize directions
      const directionsServiceInstance =
        new window.google.maps.DirectionsService();
      const directionsRendererInstance =
        new window.google.maps.DirectionsRenderer({
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: "#3b82f6",
            strokeWeight: 4,
            strokeOpacity: 0.8,
          },
          markerOptions: {
            visible: false, // Hide default markers since we have custom ones
          },
        });

      directionsRendererInstance.setMap(mapInstance);
      setDirectionsService(directionsServiceInstance);
      setDirectionsRenderer(directionsRendererInstance);

      // Calculate and display route
      calculateRoute(directionsServiceInstance, directionsRendererInstance);

      // Initialize Street View
      initializeStreetView();

      setLoading(false);
    } catch (error) {
      console.error("Error initializing map:", error);
      setError("Failed to initialize map. Please try again.");
      setLoading(false);
    }
  };

  const calculateRoute = (directionsService: any, directionsRenderer: any) => {
    directionsService.route(
      {
        origin: {
          lat: currentLocation!.latitude,
          lng: currentLocation!.longitude,
        },
        destination: {
          lat: destination.coordinates.lat,
          lng: destination.coordinates.lng,
        },
        travelMode: window.google.maps.TravelMode.WALKING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      },
      (response: any, status: string) => {
        if (status === "OK" && response) {
          directionsRenderer.setDirections(response);
          const leg = response.routes[0].legs[0];
          setRouteInfo({
            distance: leg.distance?.text || "Unknown distance",
            duration: leg.duration?.text || "Unknown duration",
          });
        } else {
          console.warn("Directions request failed due to " + status);
          setRouteInfo({
            distance: "Unable to calculate",
            duration: "Unable to calculate",
          });
        }
      }
    );
  };

  const initializeStreetView = () => {
    if (!streetViewRef.current || !window.google?.maps) return;

    const streetViewService = new window.google.maps.StreetViewService();
    const radiusSteps = [50, 100, 250, 500];

    const tryStreetView = (index: number) => {
      if (index >= radiusSteps.length) {
        setStreetViewAvailable(false);
        return;
      }

      streetViewService.getPanorama(
        {
          location: {
            lat: destination.coordinates.lat,
            lng: destination.coordinates.lng,
          },
          radius: radiusSteps[index],
        },
        (data: any, status: string) => {
          if (status === "OK" && data) {
            const streetViewInstance =
              new window.google.maps.StreetViewPanorama(
                streetViewRef.current!,
                {
                  pano: data.location?.pano,
                  pov: { heading: 0, pitch: 10 },
                  zoom: 1,
                  addressControl: false,
                  linksControl: true,
                  panControl: true,
                  enableCloseButton: false,
                  fullscreenControl: false,
                  motionTracking: false,
                  motionTrackingControl: false,
                }
              );

            // Connect street view to map
            if (map) {
              map.setStreetView(streetViewInstance);
            }

            setStreetView(streetViewInstance);
            setStreetViewAvailable(true);
          } else {
            tryStreetView(index + 1);
          }
        }
      );
    };

    tryStreetView(0);
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation?.latitude},${currentLocation?.longitude}&destination=${destination.coordinates.lat},${destination.coordinates.lng}&travelmode=walking`;
    window.open(url, "_blank");
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    initializeGoogleMaps();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl h-[70vh] bg-black/95 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden ml-16">
        {/* Header - Compact */}
        <div className="flex items-center justify-between p-3 bg-black/70 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-white truncate">
                {destination.name}
              </h3>
              <p className="text-white/60 text-xs truncate">
                {destination.address}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {routeInfo && (
              <div className="text-right text-white/80 text-xs mr-2">
                <div>{routeInfo.distance}</div>
                <div>{routeInfo.duration}</div>
              </div>
            )}
            <button
              onClick={openInGoogleMaps}
              className="p-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
              title="Open in Google Maps"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Toggle - Compact */}
        <div className="flex bg-black/40 border-b border-white/5">
          <button
            onClick={() => setActiveView("map")}
            className={`flex-1 px-4 py-2 flex items-center justify-center space-x-2 transition-colors ${
              activeView === "map"
                ? "bg-blue-500/20 text-blue-400 border-b-2 border-blue-400"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Route className="w-4 h-4" />
            <span className="text-sm">Map</span>
          </button>
          <button
            onClick={() => setActiveView("street")}
            disabled={!streetViewAvailable}
            className={`flex-1 px-4 py-2 flex items-center justify-center space-x-2 transition-colors ${
              activeView === "street" && streetViewAvailable
                ? "bg-green-500/20 text-green-400 border-b-2 border-green-400"
                : streetViewAvailable
                ? "text-white/60 hover:text-white hover:bg-white/5"
                : "text-white/30 cursor-not-allowed"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm">
              Street {!streetViewAvailable && "(N/A)"}
            </span>
          </button>
        </div>

        {/* Content */}
        <div
          className="flex-1 relative"
          style={{ height: "calc(100% - 120px)" }}
        >
          {/* Loading State */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
              <div className="flex items-center space-x-3 text-white">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                <span>Loading Maps...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white z-10">
              <div className="text-center max-w-md mx-4">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                <h4 className="text-lg font-semibold mb-2">
                  Unable to Load Maps
                </h4>
                <p className="text-white/60 mb-4 text-sm">{error}</p>
                <div className="space-x-3">
                  <button
                    onClick={handleRetry}
                    className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                  >
                    <RefreshCw className="w-4 h-4 inline mr-1" />
                    Retry
                  </button>
                  <button
                    onClick={openInGoogleMaps}
                    className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4 inline mr-1" />
                    Open External
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Map View */}
          <div
            ref={mapRef}
            className={`absolute inset-0 transition-opacity duration-300 ${
              activeView === "map" && !loading && !error
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          />

          {/* Street View */}
          <div
            ref={streetViewRef}
            className={`absolute inset-0 transition-opacity duration-300 ${
              activeView === "street" &&
              streetViewAvailable &&
              !loading &&
              !error
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          />

          {/* No Street View Message */}
          {activeView === "street" &&
            !streetViewAvailable &&
            !loading &&
            !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-white/30" />
                  <h4 className="text-lg font-semibold mb-2">
                    Street View Unavailable
                  </h4>
                  <p className="text-white/60 max-w-md text-sm">
                    Street view imagery is not available for this location.
                  </p>
                </div>
              </div>
            )}
        </div>

        {/* Footer - Compact */}
        <div className="p-3 bg-black/70 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-white/60 text-xs">
              {destination.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span>{destination.rating}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{(destination.distance / 1000).toFixed(1)}km</span>
              </div>
              {destination.open_now !== null && (
                <div
                  className={`flex items-center space-x-1 ${
                    destination.open_now ? "text-green-400" : "text-red-400"
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>{destination.open_now ? "Open" : "Closed"}</span>
                </div>
              )}
            </div>
            <button
              onClick={openInGoogleMaps}
              className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center space-x-1 text-sm"
            >
              <Navigation className="w-3 h-3" />
              <span>Navigate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsModal;
