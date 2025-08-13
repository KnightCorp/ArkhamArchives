import { useState, useEffect } from "react";
import {
  Coins,
  Zap,
  Crown,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { getCurrentUser } from "../../lib/socialMediaQueries"; // Adjust path as needed
import subscriptionQueries from "../../lib/subscriptionQueries"; // Adjust path as needed

// Type definitions
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface VerificationResult {
  verified: boolean;
  payment_id?: string;
  error?: string;
}

interface UserProfile {
  tokens: number;
  subscription_plan: string;
  subscription_status: string;
  subscription_expires_at?: string;
  total_tokens_purchased: number;
  tokens_used: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

// USD to INR conversion rate (you can make this dynamic by fetching from an API)
const USD_TO_INR_RATE = 84; // Current approximate rate

const plans = [
  {
    id: "basic",
    name: "Basic",
    priceUSD: 2,
    priceINR: 2 * USD_TO_INR_RATE,
    tokens: 100,
    features: [
      "Basic AI responses",
      "Standard chat features",
      "Public servers access",
      "10 Deepface tokens",
      "20 Text-to-Video tokens",
      "15 Text-to-Podcast tokens",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    priceUSD: 5,
    priceINR: 5 * USD_TO_INR_RATE,
    tokens: 300,
    features: [
      "Advanced AI capabilities",
      "Priority support",
      "Private servers access",
      "Custom themes",
      "30 Deepface tokens",
      "50 Text-to-Video tokens",
      "45 Text-to-Podcast tokens",
      "20 Text-to-Mindmap tokens",
    ],
  },
];

// Real token store hook using your authentication pattern
const useTokenStore = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    setLoading(true);
    try {
      // Get current user using your existing function
      const { user, error: userError } = await getCurrentUser();
      if (userError) throw userError;

      if (user?.id) {
        setCurrentUser(user);
        await loadUserProfile(user.id);

        // Subscribe to real-time updates
        const subscription = subscriptionQueries.subscribeToUserProfile(
          user.id,
          (profile) => {
            setUserProfile(profile);
          }
        );

        // Return cleanup function
        return () => {
          subscription.unsubscribe();
        };
      }
    } catch (error) {
      console.error("Error initializing user:", error);
    } finally {
      setLoading(false);
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

  const addTokens = async (amount: number) => {
    if (!currentUser?.id) return;

    // Reload the profile to get updated tokens
    await loadUserProfile(currentUser.id);
  };

  return {
    tokens: userProfile?.tokens || 0,
    addTokens,
    userProfile,
    loading,
    currentUser,
  };
};

// Subscription Status Component
const SubscriptionStatus = ({
  userProfile,
}: {
  userProfile: UserProfile | null;
}) => {
  if (!userProfile) return null;

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 border-green-500/20 bg-green-500/10";
      case "expired":
        return "text-yellow-400 border-yellow-500/20 bg-yellow-500/10";
      case "cancelled":
        return "text-red-400 border-red-500/20 bg-red-500/10";
      default:
        return "text-gray-400 border-gray-500/20 bg-gray-500/10";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-black rounded-lg p-6 border border-white/10 mb-6">
      <h2 className="text-xl text-white mb-4">Subscription Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getSubscriptionStatusColor(
              userProfile.subscription_status
            )}`}
          >
            {userProfile.subscription_status.toUpperCase()}
          </div>
          <p className="text-white/60 text-sm mt-2">Status</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {userProfile.subscription_plan.toUpperCase()}
          </div>
          <p className="text-white/60 text-sm mt-2">Plan</p>
        </div>
        <div className="text-center">
          <div className="text-lg text-white">
            {userProfile.subscription_expires_at
              ? formatDate(userProfile.subscription_expires_at)
              : "N/A"}
          </div>
          <p className="text-white/60 text-sm mt-2">Expires</p>
        </div>
      </div>
      {userProfile.subscription_status === "expired" && (
        <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/20">
          <p className="text-yellow-300 text-sm">
            ⚠️ Your subscription has expired. Purchase a new plan to continue
            using premium features.
          </p>
        </div>
      )}
    </div>
  );
};

export default function SubscriptionPlans() {
  const { tokens, addTokens, userProfile, loading, currentUser } =
    useTokenStore();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async (
    amount: number,
    planName: string
  ): Promise<RazorpayOrder> => {
    try {
      const response = await fetch(
        "https://arkhamrazorpay.onrender.com/api/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount,
            currency: "INR",
            receipt: `receipt_${planName}_${Date.now()}`,
            notes: {
              plan_name: planName,
              plan_id: selectedPlan,
              user_id: currentUser?.id,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Create order error:", errorData);
        throw new Error(
          `Failed to create order: ${response.status} ${errorData}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const verifyPayment = async (
    paymentData: RazorpayResponse
  ): Promise<VerificationResult> => {
    try {
      const response = await fetch(
        "https://arkhamrazorpay.onrender.com/api/verify-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_signature: paymentData.razorpay_signature,
          }),
        }
      );

      return await response.json();
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  };

  const loadUserProfile = async () => {
    if (!currentUser?.id) return;

    try {
      const profile =
        await subscriptionQueries.checkAndUpdateSubscriptionStatus(
          currentUser.id
        );
      // The profile will be updated via the real-time subscription
    } catch (error) {
      console.error("Error refreshing user profile:", error);
    }
  };

  const handleSubscribe = async (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan || !currentUser?.id) {
      console.error("Plan not found or user not authenticated");
      return;
    }

    setIsLoading(true);
    setSelectedPlan(planId);
    setPaymentStatus("");

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay script");
      }

      // Create order
      const order = await createOrder(plan.priceINR, plan.name);
      console.log("Order created:", order);
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      // Razorpay options
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "AI Token Subscription",
        description: `${plan.name} Plan - ${plan.tokens} tokens (₹${plan.priceINR})`,
        order_id: order.id,
        prefill: {
          name: currentUser.name || "Your Name",
          email: currentUser.email || "your.email@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#000000",
        },
        handler: async (response: RazorpayResponse) => {
          try {
            setPaymentStatus("verifying");

            // Verify payment
            const verificationResult = await verifyPayment(response);

            if (verificationResult.verified) {
              // Add tokens to user account in database
              const tokensAdded = await subscriptionQueries.addTokensToUser(
                currentUser.id,
                plan.tokens,
                plan.id,
                plan.name,
                plan.priceINR,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }
              );

              if (tokensAdded) {
                // Refresh user profile data
                await loadUserProfile();
                setPaymentStatus("success");

                // Reset after 3 seconds
                setTimeout(() => {
                  setPaymentStatus("");
                  setSelectedPlan("");
                }, 3000);
              } else {
                setPaymentStatus("failed");
              }
            } else {
              setPaymentStatus("failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setPaymentStatus("failed");
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            setSelectedPlan("");
            setPaymentStatus("cancelled");
            setTimeout(() => setPaymentStatus(""), 2000);
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        setPaymentStatus("failed");
        setIsLoading(false);
        setSelectedPlan("");
      });

      razorpay.open();
    } catch (error) {
      console.error("Subscription error:", error);
      setPaymentStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = (planId: string) => {
    if (isLoading && selectedPlan === planId) {
      return (
        <div className="flex items-center justify-center space-x-2">
          <Loader className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </div>
      );
    }

    if (paymentStatus === "verifying" && selectedPlan === planId) {
      return (
        <div className="flex items-center justify-center space-x-2">
          <Loader className="w-4 h-4 animate-spin" />
          <span>Verifying...</span>
        </div>
      );
    }

    if (paymentStatus === "success" && selectedPlan === planId) {
      return (
        <div className="flex items-center justify-center space-x-2 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>Success!</span>
        </div>
      );
    }

    return "Subscribe";
  };

  const getButtonDisabled = (planId: string) => {
    return (
      isLoading || (selectedPlan === planId && paymentStatus === "verifying")
    );
  };

  // Show loading state while initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader className="w-6 h-6 animate-spin text-white" />
          <span className="text-white">Loading subscription details...</span>
        </div>
      </div>
    );
  }

  // Show error if user not authenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl text-white mb-2">Authentication Required</h2>
          <p className="text-white/60">
            Please log in to view subscription plans.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Choose Your Plan
          </h1>
          <p className="text-white/60">
            Unlock premium AI features with our subscription plans
          </p>
        </div>

        {/* Payment Status Messages */}
        {paymentStatus === "failed" && (
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">
              Payment verification failed. Please try again.
            </span>
          </div>
        )}

        {paymentStatus === "cancelled" && (
          <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400">Payment was cancelled.</span>
          </div>
        )}

        {paymentStatus === "error" && (
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">
              An error occurred. Please try again.
            </span>
          </div>
        )}

        {/* Subscription Status */}
        <SubscriptionStatus userProfile={userProfile} />

        {/* Token Usage */}
        <div className="bg-black rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Coins className="w-6 h-6 text-white" />
              <h2 className="text-xl text-white">Your Tokens</h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-white">{tokens}</span>
              {userProfile && (
                <div className="text-sm text-white/60">
                  Used: {userProfile.tokens_used} | Purchased:{" "}
                  {userProfile.total_tokens_purchased}
                </div>
              )}
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${Math.min((tokens / 1000) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-black rounded-lg p-6 border transition-all ${
                selectedPlan === plan.id && paymentStatus === "success"
                  ? "border-green-500/50 bg-green-900/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-white">{plan.name}</h3>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className="text-2xl font-bold text-white">
                      ${plan.priceUSD}
                    </span>
                    <span className="text-white/40">/mo</span>
                  </div>
                  <div className="text-sm text-white/60">
                    ₹{plan.priceINR}/mo
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <Zap className="w-5 h-5 text-white" />
                <span className="text-white">{plan.tokens} tokens/month</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 text-white/60"
                  >
                    <Crown className="w-4 h-4 text-white" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={getButtonDisabled(plan.id)}
                className={`w-full py-3 rounded-lg transition-colors ${
                  selectedPlan === plan.id && paymentStatus === "success"
                    ? "bg-green-600 text-white"
                    : getButtonDisabled(plan.id)
                    ? "bg-white/20 text-white/40 cursor-not-allowed"
                    : "bg-white text-black hover:bg-white/90"
                }`}
              >
                {getButtonContent(plan.id)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
