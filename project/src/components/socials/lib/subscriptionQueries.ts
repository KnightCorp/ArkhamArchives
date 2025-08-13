import { supabase } from "../../../lib/supabaseClient"; // Adjust import path as needed

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  status: "active" | "cancelled" | "expired";
  tokens_granted: number;
  price_paid: number;
  currency: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  created_at: string;
  expires_at?: string;
  metadata?: Record<string, any>;
}

export interface TokenUsage {
  id: string;
  user_id: string;
  feature_used: string;
  tokens_consumed: number;
  success: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface UserProfile {
  tokens: number;
  subscription_plan: string;
  subscription_status: string;
  subscription_expires_at?: string;
  total_tokens_purchased: number;
  tokens_used: number;
}

class SubscriptionQueries {
  // Get user's current subscription details
  async getUserSubscription(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "tokens, subscription_plan, subscription_status, subscription_expires_at, total_tokens_purchased, tokens_used"
      )
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user subscription:", error);
      return null;
    }

    return data;
  }

  // Get user's subscription history
  async getSubscriptionHistory(userId: string): Promise<UserSubscription[]> {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching subscription history:", error);
      return [];
    }

    return data || [];
  }

  // Get user's token usage history
  async getTokenUsageHistory(
    userId: string,
    limit = 50
  ): Promise<TokenUsage[]> {
    const { data, error } = await supabase
      .from("token_usage")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching token usage history:", error);
      return [];
    }

    return data || [];
  }

  // Add tokens after successful payment
  async addTokensToUser(
    userId: string,
    tokens: number,
    planId: string,
    planName: string,
    pricePaid: number,
    paymentDetails: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }
  ): Promise<boolean> {
    try {
      // Call the stored function
      const { error: functionError } = await supabase.rpc(
        "add_tokens_to_user",
        {
          p_user_id: userId,
          p_tokens: tokens,
          p_plan_id: planId,
          p_plan_name: planName,
          p_price_paid: pricePaid,
        }
      );

      if (functionError) {
        console.error("Error adding tokens:", functionError);
        return false;
      }

      // Update the subscription record with payment details
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          razorpay_order_id: paymentDetails.razorpay_order_id,
          razorpay_payment_id: paymentDetails.razorpay_payment_id,
          razorpay_signature: paymentDetails.razorpay_signature,
        })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (updateError) {
        console.error("Error updating payment details:", updateError);
        // Don't return false here as tokens were already added
      }

      return true;
    } catch (error) {
      console.error("Error in addTokensToUser:", error);
      return false;
    }
  }

  // Consume tokens for a feature
  async consumeTokens(
    userId: string,
    feature: string,
    tokensRequired: number = 1
  ): Promise<{ success: boolean; remainingTokens?: number; error?: string }> {
    try {
      const { data, error } = await supabase.rpc("consume_tokens", {
        p_user_id: userId,
        p_feature: feature,
        p_tokens_required: tokensRequired,
      });

      if (error) {
        console.error("Error consuming tokens:", error);
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: "Insufficient tokens" };
      }

      // Get updated token count
      const userProfile = await this.getUserSubscription(userId);

      return {
        success: true,
        remainingTokens: userProfile?.tokens || 0,
      };
    } catch (error) {
      console.error("Error in consumeTokens:", error);
      return { success: false, error: "Failed to consume tokens" };
    }
  }

  // Check if user has enough tokens
  async hasEnoughTokens(
    userId: string,
    tokensRequired: number
  ): Promise<boolean> {
    const userProfile = await this.getUserSubscription(userId);
    return (userProfile?.tokens || 0) >= tokensRequired;
  }

  // Get token usage by feature
  async getTokenUsageByFeature(
    userId: string,
    feature: string
  ): Promise<TokenUsage[]> {
    const { data, error } = await supabase
      .from("token_usage")
      .select("*")
      .eq("user_id", userId)
      .eq("feature_used", feature)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching feature token usage:", error);
      return [];
    }

    return data || [];
  }

  // Check subscription status and update if expired
  async checkAndUpdateSubscriptionStatus(
    userId: string
  ): Promise<UserProfile | null> {
    const userProfile = await this.getUserSubscription(userId);

    if (!userProfile) return null;

    // Check if subscription has expired
    if (userProfile.subscription_expires_at) {
      const expiryDate = new Date(userProfile.subscription_expires_at);
      const now = new Date();

      if (now > expiryDate && userProfile.subscription_status === "active") {
        // Update subscription status to expired
        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status: "expired",
            subscription_plan: "free",
          })
          .eq("id", userId);

        if (error) {
          console.error("Error updating subscription status:", error);
        } else {
          userProfile.subscription_status = "expired";
          userProfile.subscription_plan = "free";
        }
      }
    }

    return userProfile;
  }

  // Real-time subscription to user profile changes
  subscribeToUserProfile(
    userId: string,
    callback: (profile: UserProfile) => void
  ) {
    return supabase
      .channel(`profile-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          const updatedProfile = payload.new as UserProfile;
          callback(updatedProfile);
        }
      )
      .subscribe();
  }
}

export default new SubscriptionQueries();
