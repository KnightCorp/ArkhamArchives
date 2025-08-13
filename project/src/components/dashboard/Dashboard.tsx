import React, { useState, useEffect } from "react";
import QuickLaunch from "./QuickLaunch";
import ReferralStats from "./ReferralStats";
import supabase from "../../lib/supabaseClient";
import {
  getUsernameFromEmail,
  getUserDisplayName,
  initializeUserProfile,
} from "../../lib/userUtils";
import toast from "react-hot-toast";

interface UserProfile {
  id: string;
  display_name: string | null;
  referral_code: string | null;
  total_earnings: number;
  total_xp: number;
  level: number;
  created_at: string;
}

interface Referral {
  id: number;
  name: string;
  date: string;
  earnings: number;
  products: string[];
}

const Dashboard: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Fetch user profile from Supabase and ensure display name
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          id,
          display_name,
          referral_code,
          total_earnings,
          total_xp,
          level,
          created_at
        `
        )
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        // If profile doesn't exist, create one
        if (error.code === "PGRST116") {
          await initializeProfile(userId);
          return;
        }
        toast.error("Failed to load user profile");
        return;
      }

      // If display name is missing or empty, try to get/update it using the function
      if (!data.display_name || data.display_name.trim() === "") {
        try {
          const displayName = await getUserDisplayName(userId);
          if (displayName && displayName !== "User") {
            // Update the local data with the new display name
            data.display_name = displayName;
          }
        } catch (nameError) {
          console.warn("Could not update display name:", nameError);
          // Fallback to extracting from email
          data.display_name = getUsernameFromEmail(user?.email) || "User";
        }
      }

      setUserProfile(data);
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      toast.error("Failed to load user profile");
    }
  };

  // Initialize user profile if it doesn't exist
  const initializeProfile = async (userId: string) => {
    try {
      const referralCode = await initializeUserProfile(
        userId,
        user?.email || null,
        user?.user_metadata?.full_name || null
      );

      if (!referralCode) {
        toast.error("Failed to initialize user profile");
        return;
      }

      // Fetch the profile again after initialization
      await fetchUserProfile(userId);
      toast.success("Welcome! Your profile has been created.");
    } catch (error) {
      console.error("Error in initializeProfile:", error);
      toast.error("Failed to initialize user profile");
    }
  };

  // Fetch referrals data
  const fetchReferrals = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("referrals")
        .select(
          `
          id,
          earnings,
          products,
          created_at,
          referred_id
        `
        )
        .eq("referrer_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching referrals:", error);
        return;
      }

      // Transform the data to match the expected format
      const transformedReferrals: Referral[] = await Promise.all(
        (data || []).map(async (referral, index) => {
          // Get referred user's display name using the utility function
          let displayName = "Anonymous User";

          try {
            displayName = await getUserDisplayName(referral.referred_id);
          } catch (nameError) {
            console.warn(
              "Could not get display name for referred user:",
              nameError
            );
            // Fallback to querying profile directly
            const { data: referredUser } = await supabase
              .from("profiles")
              .select("display_name")
              .eq("id", referral.referred_id)
              .single();

            displayName = referredUser?.display_name || "Anonymous User";
          }

          return {
            id: index + 1,
            name: displayName,
            date: new Date(referral.created_at).toISOString().split("T")[0],
            earnings: referral.earnings || 0,
            products: referral.products || [],
          };
        })
      );

      setReferrals(transformedReferrals);
    } catch (error) {
      console.error("Error in fetchReferrals:", error);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error getting user:", error);
          setLoading(false);
          return;
        }

        if (!user) {
          console.log("No authenticated user found");
          setLoading(false);
          return;
        }

        setUser(user);
        await fetchUserProfile(user.id);
        await fetchReferrals(user.id);
      } catch (error) {
        console.error("Error initializing data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Prepare user data for components
  const userData = userProfile
    ? {
        name:
          userProfile.display_name ||
          getUsernameFromEmail(user?.email) ||
          "User",
        referralCode: userProfile.referral_code || "Loading...",
        totalEarnings: userProfile.total_earnings || 0,
        referrals: referrals,
      }
    : {
        name: "Loading...",
        referralCode: "Loading...",
        totalEarnings: 0,
        referrals: [],
      };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-gray-400">
            You need to be signed in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8 mt-24">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">
                Welcome, {userData.name}
              </h1>
              <p className="text-gray-400">
                Access your tools and track your referrals
              </p>
            </div>
            {userProfile && (
              <div className="text-right">
                <div className="text-white text-lg font-semibold">
                  Level {userProfile.level}
                </div>
                <div className="text-blue-400 text-sm">
                  {userProfile.total_xp} XP
                </div>
                <div className="text-green-400 text-sm">
                  ${userProfile.total_earnings.toFixed(2)} earned
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div>
            <QuickLaunch />
          </div>

          {/* <div className="lg:col-span-1">
            <ReferralStats userData={userData} />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
