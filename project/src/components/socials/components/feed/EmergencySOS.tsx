import React, { useState, useEffect } from "react";
import {
  Phone,
  Camera,
  Mic,
  MessageSquare,
  AlertTriangle,
  X,
  MapPin,
  Clock,
  Loader2,
  CheckCircle,
  Send,
} from "lucide-react";
import {
  createEmergencyAlert,
  getActiveEmergencyAlerts,
  resolveEmergencyAlert,
  getCurrentUser,
} from "../../lib/socialMediaQueries";

interface EmergencyContact {
  name: string;
  number: string;
  type: "service" | "personal";
}

interface EmergencyAlertData {
  id: string;
  user_id: string;
  emergency_type: string;
  message: string | null;
  location_lat: number | null;
  location_lng: number | null;
  location_address: string | null;
  contact_number: string | null;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

interface EmergencySOSProps {
  currentUser: any;
}

export const EmergencySOS: React.FC<EmergencySOSProps> = ({ currentUser }) => {
  const [recording, setRecording] = useState(false);
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [emergencyType, setEmergencyType] = useState("medical");
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<EmergencyAlertData[]>([]);
  const [alertCreated, setAlertCreated] = useState(false);

  const emergencyContacts: EmergencyContact[] = [
    { name: "Emergency Services (Police)", number: "911", type: "service" },
    { name: "Fire Department", number: "911", type: "service" },
    { name: "Emergency Medical Services", number: "911", type: "service" },
    { name: "Poison Control", number: "1-800-222-1222", type: "service" },
    { name: "Crisis Helpline", number: "988", type: "service" },
    { name: "Emergency Contact 1", number: "+1234567890", type: "personal" },
    { name: "Emergency Contact 2", number: "+0987654321", type: "personal" },
  ];

  const emergencyTypes = [
    {
      value: "medical",
      label: "Medical Emergency",
      color: "bg-red-500/20 text-red-400",
    },
    {
      value: "fire",
      label: "Fire Emergency",
      color: "bg-orange-500/20 text-orange-400",
    },
    {
      value: "crime",
      label: "Crime/Safety",
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      value: "accident",
      label: "Accident",
      color: "bg-yellow-500/20 text-yellow-400",
    },
    {
      value: "other",
      label: "Other Emergency",
      color: "bg-purple-500/20 text-purple-400",
    },
  ];

  useEffect(() => {
    loadActiveAlerts();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const loadActiveAlerts = async () => {
    try {
      const { data, error } = await getActiveEmergencyAlerts();
      if (error) throw error;
      setActiveAlerts(
        (data || []).map((alert: any) => ({
          ...alert,
          profiles: alert.profiles
            ? {
                full_name: alert.profiles.full_name ?? "",
                avatar_url: alert.profiles.avatar_url ?? "",
              }
            : undefined,
        }))
      );
    } catch (err) {
      console.error("Error loading active alerts:", err);
    }
  };

  const handleCreateSOS = async () => {
    if (!currentUser || !location) return;

    setLoading(true);
    try {
      const { data, error } = await createEmergencyAlert(
        currentUser.id,
        emergencyType,
        message,
        location.lat,
        location.lng,
        location.address,
        contactNumber || currentUser.phone || ""
      );

      if (error) throw error;

      setAlertCreated(true);
      setShowCreateAlert(false);
      loadActiveAlerts();

      // Reset form
      setMessage("");
      setContactNumber("");
      setEmergencyType("medical");

      setTimeout(() => setAlertCreated(false), 5000);
    } catch (err) {
      console.error("Error creating SOS alert:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await resolveEmergencyAlert(alertId, currentUser.id);
      if (error) throw error;
      loadActiveAlerts();
    } catch (err) {
      console.error("Error resolving alert:", err);
    }
  };

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const startRecording = () => {
    setRecording(true);
    // Implement audio recording logic here
    setTimeout(() => setRecording(false), 5000); // Mock 5-second recording
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (!currentUser) {
    return (
      <div className="text-center py-8 text-white/60">
        Please log in to access emergency services.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      {alertCreated && (
        <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-emerald-400" />
          <div>
            <p className="text-emerald-400 font-medium">
              Emergency alert sent successfully!
            </p>
            <p className="text-emerald-400/80 text-sm">
              Emergency services and contacts have been notified.
            </p>
          </div>
        </div>
      )}

      {/* Emergency Banner */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
          <h2 className="text-xl text-white">Emergency SOS</h2>
        </div>
        <p className="text-white/70 mb-4">
          Use this feature in case of emergency. Your location and selected
          information will be sent to emergency services and your emergency
          contacts.
        </p>
        {location && (
          <div className="flex items-center space-x-2 text-white/60 text-sm">
            <MapPin className="w-4 h-4" />
            <span>Location detected: {location.address}</span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleCall("911")}
          className="flex items-center justify-center space-x-3 p-6 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all text-red-400"
        >
          <Phone className="w-6 h-6" />
          <span>Call 911</span>
        </button>

        <button
          onClick={() => setShowCreateAlert(true)}
          className="flex items-center justify-center space-x-3 p-6 bg-orange-500/20 border border-orange-500/30 rounded-lg hover:bg-orange-500/30 transition-all text-orange-400"
        >
          <Send className="w-6 h-6" />
          <span>Send SOS Alert</span>
        </button>

        <button
          className={`flex items-center justify-center space-x-3 p-6 border rounded-lg transition-all ${
            recording
              ? "bg-red-500/30 border-red-500/40 text-red-400"
              : "bg-black/20 border-white/20 hover:bg-black/40 text-white"
          }`}
          onClick={startRecording}
        >
          <Mic className={`w-6 h-6 ${recording ? "animate-pulse" : ""}`} />
          <span>{recording ? "Recording..." : "Voice Record"}</span>
        </button>

        <button
          className="flex items-center justify-center space-x-3 p-6 bg-black/20 border border-white/20 rounded-lg hover:bg-black/40 transition-all text-white"
          onClick={() => setShowEmergencyContacts(!showEmergencyContacts)}
        >
          <MessageSquare className="w-6 h-6" />
          <span>Contacts</span>
        </button>
      </div>

      {/* Active Emergency Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-white text-lg flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span>Active Emergency Alerts</span>
          </h3>
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-red-500/20 rounded-full text-red-400 text-xs capitalize">
                      {alert.emergency_type}
                    </span>
                    <div className="flex items-center space-x-1 text-white/60 text-sm">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(alert.created_at)}</span>
                    </div>
                  </div>
                  {alert.message && (
                    <p className="text-white/80 mb-2">{alert.message}</p>
                  )}
                  {alert.location_address && (
                    <div className="flex items-center space-x-1 text-white/60 text-sm">
                      <MapPin className="w-3 h-3" />
                      <span>{alert.location_address}</span>
                    </div>
                  )}
                </div>
                {alert.user_id === currentUser.id && (
                  <button
                    onClick={() => handleResolveAlert(alert.id)}
                    className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Emergency Contacts Modal */}
      {showEmergencyContacts && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-black/90 backdrop-blur-xl rounded-lg p-6 w-full max-w-md border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-white">Emergency Contacts</h3>
              <button onClick={() => setShowEmergencyContacts(false)}>
                <X className="w-5 h-5 text-white/60 hover:text-white" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {emergencyContacts.map((contact, index) => (
                <button
                  key={index}
                  onClick={() => handleCall(contact.number)}
                  className="w-full flex items-center justify-between p-4 bg-black/40 rounded-lg hover:bg-black/60 transition-colors border border-white/10"
                >
                  <div className="text-left">
                    <div className="text-white">{contact.name}</div>
                    <div className="text-white/60 text-sm">
                      {contact.number}
                    </div>
                  </div>
                  <Phone className="w-5 h-5 text-white/60" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create SOS Alert Modal */}
      {showCreateAlert && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-black/90 backdrop-blur-xl rounded-lg p-6 w-full max-w-md border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-white">Create Emergency Alert</h3>
              <button onClick={() => setShowCreateAlert(false)}>
                <X className="w-5 h-5 text-white/60 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Emergency Type */}
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Emergency Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {emergencyTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setEmergencyType(type.value)}
                      className={`p-3 rounded-lg border text-sm transition-colors ${
                        emergencyType === type.value
                          ? type.color + " border-current"
                          : "bg-black/40 border-white/20 text-white/60 hover:bg-black/60"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your emergency..."
                  className="w-full h-24 bg-black/40 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 resize-none focus:border-white/40 transition-colors"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Contact Number (Optional)
                </label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Your phone number"
                  className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 focus:border-white/40 transition-colors"
                />
              </div>

              {/* Location Info */}
              {location && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-2 text-white/60 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Location: {location.address}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleCreateSOS}
                disabled={loading}
                className="w-full py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending SOS...</span>
                  </div>
                ) : (
                  "Send Emergency Alert"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
