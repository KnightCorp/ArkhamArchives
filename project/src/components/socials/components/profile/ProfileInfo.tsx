import React, { useState, useRef } from "react";
import { Camera, Mail, AtSign, MapPin, Loader2 } from "lucide-react";
import type { Profile } from "../../lib/profileQueries";

interface ProfileInfoProps {
  profile: Profile | null;
  onProfileUpdate: (updates: Partial<Profile>) => Promise<void>;
  onAvatarUpload: (file: File) => Promise<void>;
  loading: boolean;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profile,
  onProfileUpdate,
  onAvatarUpload,
  loading,
}) => {
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || "",
    username: profile?.username || "",
    email: profile?.email || "",
    bio: profile?.bio || "",
    location: profile?.location || "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when profile changes
  React.useEffect(() => {
    if (profile) {
      const newFormData = {
        display_name: profile.display_name || "",
        username: profile.username || "",
        email: profile.email || "",
        bio: profile.bio || "",
        location: profile.location || "",
      };

      setFormData(newFormData);
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await onProfileUpdate(formData);

      console.log("ProfileInfo: Save completed successfully"); // Debug: Confirm save
    } catch (error) {
      console.error("ProfileInfo: Error saving profile:", error); // Debug: Check save errors
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      console.log("ProfileInfo: Starting avatar upload"); // Debug: Track upload start

      await onAvatarUpload(file);

      console.log("ProfileInfo: Avatar upload completed"); // Debug: Track upload completion
    } catch (error) {
      console.error("ProfileInfo: Error uploading avatar:", error); // Debug: Check upload errors
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-8">
        <div className="relative">
          <img
            src={
              profile?.avatar_url ||
              "https://images.unsplash.com/photo-1492288991661-058aa541ff43?w=150&h=150&fit=crop"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full grayscale hover:grayscale-0 transition-all object-cover"
          />
          <button
            onClick={handleAvatarClick}
            disabled={uploading}
            className="absolute bottom-0 right-0 p-2 bg-zinc-900 rounded-full metallic-shine hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={formData.display_name}
              onChange={(e) =>
                handleInputChange("display_name", e.target.value)
              }
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white w-full focus:border-zinc-600 focus:outline-none"
              placeholder="Your display name"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white w-full focus:border-zinc-600 focus:outline-none resize-none"
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
            {/* Debug info - remove this in production */}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white w-full focus:border-zinc-600 focus:outline-none"
            placeholder="your@email.com"
            style={{ color: formData.email ? "white" : "#9ca3af" }} // Force color for debugging
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            <AtSign className="w-4 h-4 inline mr-2" />
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white w-full focus:border-zinc-600 focus:outline-none"
            placeholder="@username"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            <MapPin className="w-4 h-4 inline mr-2" />
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white w-full focus:border-zinc-600 focus:outline-none"
            placeholder="Your location"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>

        {profile && (
          <div className="text-sm text-zinc-400">
            Last updated: {new Date(profile.updated_at).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};
