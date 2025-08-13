import React, { useState, useEffect, useCallback } from "react";
import { ProfileInfo } from "../components/profile/ProfileInfo";
import { PreferencesManager } from "../components/profile/PreferencesManager";
import { ProfileStats } from "../components/profile/ProfileStats";
import { ProfileInventory } from "../components/profile/ProfileInventory";
import { BrowserSettings } from "../components/profile/BrowserSettings";
import { Tabs } from "../components/ui/Tabs";
import { profileQueries } from "../lib/profileQueries";
import { supabase } from "../../../lib/supabaseClient";
import type {
  Profile,
  UserPreferences,
  InventoryItem,
  Achievement,
} from "../lib/profileQueries";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile Information" },
    { id: "preferences", label: "Preferences & Interests" },
    { id: "stats", label: "Stats" },
    { id: "inventory", label: "Inventory" },
    { id: "browser", label: "Browser & Search" },
  ];

  // Get current user helper
  const getCurrentUser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  // Load user data function
  const loadUserData = useCallback(
    async (userId: string) => {
      console.log("Loading profile data for user:", userId);
      console.log("Current user object:", currentUser); // Debug: Check full user object
      console.log("Current user email:", currentUser?.email); // Debug: Check email specifically
      console.log("User metadata:", currentUser?.user_metadata); // Debug: Check metadata

      try {
        setError(null);

        // Load profile first
        const profileResult = await profileQueries.getProfile(userId);
        if (profileResult.data && !profileResult.error) {
          setProfile(profileResult.data);
          console.log("Profile loaded successfully:", profileResult.data); // Debug: Check loaded profile
          console.log("Profile email:", profileResult.data.email); // Debug: Check profile email
        } else {
          console.log("No profile found, creating new one...");

          // Debug: Log what we're about to create
          const newProfileData = {
            id: userId,
            display_name:
              currentUser?.user_metadata?.full_name ||
              currentUser?.email?.split("@")[0] ||
              "User",
            email: currentUser?.email || "",
            username: null,
            bio: null,
            avatar_url: null,
            location: null,
            xp: 0,
            total_xp: 0,
            level: 1,
            karma: 0,
            current_streak: 0,
            longest_streak: 0,
            total_earnings: 0,
            is_verified: false,
            is_private: false,
          };

          console.log("Creating profile with data:", newProfileData); // Debug: Check creation data

          const createResult = await profileQueries.createProfile(
            newProfileData
          );

          if (createResult.data) {
            setProfile(createResult.data);
            console.log("New profile created:", createResult.data); // Debug: Check created profile
          } else {
            console.error("Profile creation failed:", createResult.error); // Debug: Check creation error
          }
        }

        // Load other data in parallel
        const [preferencesResult, inventoryResult, achievementsResult] =
          await Promise.allSettled([
            profileQueries.getUserPreferences(userId),
            profileQueries.getUserInventory(userId),
            profileQueries.getUserAchievements(userId),
          ]);

        // Handle preferences
        if (
          preferencesResult.status === "fulfilled" &&
          preferencesResult.value.data
        ) {
          setPreferences(preferencesResult.value.data);
        }

        // Handle inventory
        if (
          inventoryResult.status === "fulfilled" &&
          inventoryResult.value.data
        ) {
          setInventory(inventoryResult.value.data);
        } else {
          setInventory([]);
        }

        // Handle achievements
        if (
          achievementsResult.status === "fulfilled" &&
          achievementsResult.value.data
        ) {
          setAchievements(achievementsResult.value.data);
        } else {
          setAchievements([]);
          // Create default achievements if none exist
          try {
            await profileQueries.createDefaultAchievements(userId);
            const newAchievements = await profileQueries.getUserAchievements(
              userId
            );
            if (newAchievements.data) {
              setAchievements(newAchievements.data);
            }
          } catch (err) {
            console.warn("Could not create default achievements:", err);
          }
        }

        // Load stats
        try {
          const statsResult = await profileQueries.getProfileStats(userId);
          if (statsResult.data) {
            setStats(statsResult.data);
          }
        } catch (err) {
          console.warn("Could not load stats:", err);
        }

        console.log("Profile data loading completed");
      } catch (err) {
        console.error("Error loading profile data:", err);
        setError("Failed to load profile data. Please try again.");
      }
    },
    [currentUser]
  );

  // Initialize data
  const initializeData = useCallback(async () => {
    if (initialized) return; // Prevent multiple initializations

    console.log("Initializing profile data...");
    setLoading(true);

    try {
      // Get current user
      const { user, error: userError } = await getCurrentUser();
      if (userError) throw userError;

      if (user) {
        setCurrentUser(user);
        await loadUserData(user.id);
      } else {
        setError("Please log in to view your profile.");
      }
    } catch (err) {
      console.error("Error initializing profile:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [initialized, loadUserData]);

  // Initialize on mount
  useEffect(() => {
    initializeData();

    // Set up auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);

      if (event === "SIGNED_IN" && session?.user) {
        setCurrentUser(session.user);
        setError(null);
        if (initialized) {
          await loadUserData(session.user.id);
        }
      } else if (event === "SIGNED_OUT") {
        setCurrentUser(null);
        setProfile(null);
        setPreferences(null);
        setInventory([]);
        setAchievements([]);
        setStats(null);
        setError("Please log in to view your profile.");
        setInitialized(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeData, initialized, loadUserData]);

  // Handle profile updates
  const handleProfileUpdate = useCallback(
    async (updates: Partial<Profile>) => {
      if (!currentUser?.id) return;

      try {
        const result = await profileQueries.updateProfile(
          currentUser.id,
          updates
        );
        if (result.error) {
          throw result.error;
        }
        setProfile(result.data);
        setError(null);
      } catch (err) {
        console.error("Error updating profile:", err);
        setError("Failed to update profile. Please try again.");
      }
    },
    [currentUser]
  );

  // Handle preferences updates
  const handlePreferencesUpdate = useCallback(
    async (updates: Partial<UserPreferences>) => {
      if (!currentUser?.id) return;

      try {
        const result = await profileQueries.upsertUserPreferences(
          currentUser.id,
          updates
        );
        if (result.error) {
          throw result.error;
        }
        setPreferences(result.data);
        setError(null);
      } catch (err) {
        console.error("Error updating preferences:", err);
        setError("Failed to update preferences. Please try again.");
      }
    },
    [currentUser]
  );

  // Handle avatar upload
  const handleAvatarUpload = useCallback(
    async (file: File) => {
      if (!currentUser?.id) return;

      try {
        const result = await profileQueries.uploadAvatar(currentUser.id, file);
        if (result.error) {
          throw result.error;
        }

        if (profile) {
          setProfile({ ...profile, avatar_url: result.data });
        }
        setError(null);
      } catch (err) {
        console.error("Error uploading avatar:", err);
        setError("Failed to upload avatar. Please try again.");
      }
    },
    [currentUser, profile]
  );

  // Handle inventory updates
  const handleInventoryUpdate = useCallback((updatedItem: InventoryItem) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileInfo
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
            onAvatarUpload={handleAvatarUpload}
            loading={loading}
          />
        );
      case "preferences":
        return (
          <PreferencesManager
            preferences={preferences}
            onPreferencesUpdate={handlePreferencesUpdate}
            loading={loading}
          />
        );
      case "stats":
        return (
          <ProfileStats
            stats={stats}
            achievements={achievements}
            loading={loading}
          />
        );
      case "inventory":
        return (
          <ProfileInventory
            inventory={inventory}
            onInventoryUpdate={handleInventoryUpdate}
            loading={loading}
          />
        );
      case "browser":
        return <BrowserSettings />;
      default:
        return null;
    }
  };

  // Show loading state
  if (!initialized || (loading && !currentUser)) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-zinc-400">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if no user
  if (!currentUser && !loading) {
    return (
      <div className="max-w-2xl mx-auto min-h-screen p-8 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl mb-4">Please log in to continue</h2>
          <p className="text-white/60 mb-6">
            You need to be authenticated to view your profile.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-typewriter text-zinc-200">
          Profile Settings
        </h1>
        {currentUser && (
          <div className="text-sm text-zinc-400">{currentUser.email}</div>
        )}
      </div>

      {error && (
        <div className="bg-amber-900/20 border border-amber-500/50 rounded-lg p-4 mb-6">
          <p className="text-amber-400 text-sm">{error}</p>
          {currentUser && (
            <button
              onClick={() => loadUserData(currentUser.id)}
              className="text-amber-300 hover:text-amber-200 underline text-sm mt-2"
            >
              Try again
            </button>
          )}
        </div>
      )}

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-8">{renderContent()}</div>
    </div>
  );
};

export default Profile;
