import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  X,
  Shield,
  Image,
  X as XIcon,
  Paperclip,
  Filter,
  Search as SearchIcon,
  Users,
  MapPin,
  Loader2,
  MessageSquareOff,
  Clock,
} from "lucide-react";
import {
  createGossip,
  getGossips,
  uploadImage,
  validateImageFile,
  formatTimeAgo,
} from "../../lib/socialMediaQueries";

interface GossipsProps {
  currentUser: any;
}

interface Gossip {
  id: string;
  content: string;
  is_anonymous: boolean;
  likes_count: number;
  created_at: string;
  user_name?: string;
  user_avatar?: string;
  profiles?: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export const Gossips: React.FC<GossipsProps> = ({ currentUser }) => {
  const [newWhisper, setNewWhisper] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showAllWhispers, setShowAllWhispers] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [gossips, setGossips] = useState<Gossip[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Argentina",
    "Australia",
    "Austria",
    "Bangladesh",
    "Belgium",
    "Brazil",
    "Canada",
    "China",
    "Denmark",
    "Egypt",
    "France",
    "Germany",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Italy",
    "Japan",
    "Mexico",
    "Netherlands",
    "Nigeria",
    "Pakistan",
    "Russia",
    "Saudi Arabia",
    "South Africa",
    "Spain",
    "Turkey",
    "United Kingdom",
    "United States",
    "Other",
  ];

  useEffect(() => {
    loadGossips();
  }, []);

  const loadGossips = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await getGossips();
      if (error) throw error;
      setGossips(data || []);
    } catch (err) {
      console.error("Error loading gossips:", err);
      setError("Failed to load whispers");
    } finally {
      setLoading(false);
    }
  };

  const filteredGossips = gossips.filter((gossip) => {
    const matchesSearch =
      gossip.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (gossip.user_name &&
        gossip.user_name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];

    files.forEach((file) => {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        alert(validation.error);
      }
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitWhisper = async () => {
    if (!currentUser?.id || !newWhisper.trim()) return;

    setSubmitting(true);
    try {
      // For now, we'll create gossips without media since the database schema
      // doesn't include media fields. You can extend this later.
      const { data, error } = await createGossip(
        currentUser.id,
        newWhisper.trim(),
        isAnonymous
      );

      if (error) throw error;

      // Clear form
      setNewWhisper("");
      setSelectedFiles([]);

      // Reload gossips to show the new one
      await loadGossips();
    } catch (err) {
      console.error("Error creating gossip:", err);
      setError("Failed to create whisper");
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-white/60">
          <MessageSquareOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Please log in to view and create whispers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/20 border border-white/20 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-white" />
          <h2 className="text-xl text-white">Anonymous Whispers</h2>
        </div>
        <p className="text-white/70">
          Share and discover anonymous whispers about various happenings. All
          posts are encrypted and untraceable.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-black/20 border border-white/20 rounded-lg p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search whispers..."
            className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/30 focus:border-white/30 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-white/30 transition-colors"
          >
            <option value="all">All Locations</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <button
            onClick={loadGossips}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* New Whisper Input */}
      <div className="bg-black/20 border border-white/20 rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-black/40 text-white focus:ring-white/20"
            />
            <span className="text-white/70">Post anonymously</span>
          </label>
        </div>

        <textarea
          value={newWhisper}
          onChange={(e) => setNewWhisper(e.target.value)}
          placeholder="Share your whisper..."
          className="w-full h-32 bg-black/40 border border-white/20 rounded-lg p-4 text-white placeholder-white/40 resize-none focus:border-white/40 transition-colors"
        />

        {/* Media Preview */}
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="relative aspect-square bg-black/40 rounded-lg overflow-hidden"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white/60">
              <Shield className="w-4 h-4" />
              <span className="text-sm">End-to-end encrypted</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
            >
              <Paperclip className="w-4 h-4" />
              <span className="text-sm">Attach images</span>
            </button>
          </div>
          <button
            onClick={handleSubmitWhisper}
            disabled={!newWhisper.trim() || submitting}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Whisper</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-400 hover:text-red-300 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3 text-white/60">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading whispers...</span>
          </div>
        </div>
      )}

      {/* Whispers Timeline */}
      <div className="space-y-4">
        {!loading && filteredGossips.length === 0 && (
          <div className="text-center py-8 text-white/60">
            <MessageSquareOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No whispers found. Be the first to share something!</p>
          </div>
        )}

        {filteredGossips.map((gossip) => (
          <div
            key={gossip.id}
            className="bg-black/20 border border-white/20 rounded-lg p-6 hover:bg-black/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {gossip.is_anonymous ? (
                    <>
                      <Shield className="w-4 h-4 text-white/60" />
                      <span className="text-white/60 text-sm">Anonymous</span>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        {gossip.user_avatar ? (
                          <img
                            src={gossip.user_avatar}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <Users className="w-3 h-3 text-white/60" />
                        )}
                      </div>
                      <span className="text-white/60 text-sm">
                        {gossip.user_name || "User"}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 text-white/60 text-sm">
                <Clock className="w-4 h-4" />
                <span>{formatTimeAgo(gossip.created_at)}</span>
              </div>
            </div>

            <p className="text-white mb-4 leading-relaxed">{gossip.content}</p>

            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-white/60">
                <Users className="w-4 h-4" />
                <span>{gossip.likes_count || 0} reactions</span>
              </div>
              {/* You can add more interaction options here */}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button (if needed) */}
      {!loading && filteredGossips.length >= 50 && (
        <div className="text-center">
          <button
            onClick={loadGossips}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Load More Whispers
          </button>
        </div>
      )}
    </div>
  );
};
