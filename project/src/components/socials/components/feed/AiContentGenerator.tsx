import React, { useState, useEffect } from "react";
import {
  ImagePlus,
  Music,
  Video,
  Mic,
  Wand2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Coins,
  Lock,
  AlertTriangle,
  User,
} from "lucide-react";
import {
  AIGenerationService,
  ContentType,
} from "../../services/aiGenerationService";
import { getCurrentUser } from "../../lib/socialMediaQueries";
import subscriptionQueries from "../../lib/subscriptionQueries";

interface AiContentGeneratorProps {
  onGenerate: (url: string, type: ContentType) => void;
  onClose: () => void;
  currentUser?: any;
}

interface UserProfile {
  tokens: number;
  subscription_plan: string;
  subscription_status: string;
  subscription_expires_at?: string;
  total_tokens_purchased: number;
  tokens_used: number;
}

export const AiContentGenerator = ({
  onGenerate,
  onClose,
  currentUser,
}: AiContentGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<ContentType>("image");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Token costs for each content type
  const tokenCosts: Record<ContentType, number> = {
    image: 5, // Images cost 5 tokens
    music: 10, // Music costs 10 tokens
    video: 15, // Video costs 15 tokens
    podcast: 8, // Podcast costs 8 tokens
  };

  const contentTypes = [
    { id: "image", label: "Image", icon: ImagePlus, cost: tokenCosts.image },
    { id: "music", label: "Music", icon: Music, cost: tokenCosts.music },
    { id: "video", label: "Video", icon: Video, cost: tokenCosts.video },
    { id: "podcast", label: "Podcast", icon: Mic, cost: tokenCosts.podcast },
  ] as const;

  const apiMap: Record<ContentType, string> = {
    image: "https://replicate-api-343916782787.us-central1.run.app",
    music: "https://replicate-music-api-343916782787.us-central1.run.app",
    video: "https://replicate-video-api-343916782787.us-central1.run.app",
    podcast: "https://replicate-music-api-343916782787.us-central1.run.app", // same as music
  };

  useEffect(() => {
    initializeUserData();
  }, [currentUser]);

  const initializeUserData = async () => {
    try {
      // Get current user from the service instead of relying on props only
      const { user, error: userError } = await getCurrentUser();
      if (userError) {
        console.warn("Error getting current user:", userError);
        // If there's an error getting user from service, try to use the passed currentUser
        if (currentUser?.id) {
          setAuthUser(currentUser);
          await loadUserProfile(currentUser.id);
        }
      } else if (user?.id) {
        setAuthUser(user);
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
      } else if (currentUser?.id) {
        // Fallback to currentUser prop if service doesn't return user
        setAuthUser(currentUser);
        await loadUserProfile(currentUser.id);
      }
    } catch (error) {
      console.error("Error initializing user data:", error);
      // Try fallback to currentUser prop
      if (currentUser?.id) {
        setAuthUser(currentUser);
        await loadUserProfile(currentUser.id);
      } else {
        setError("Failed to load user profile. Please try logging in again.");
      }
    } finally {
      setAuthLoading(false);
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

  const canAffordGeneration = (contentType: ContentType): boolean => {
    if (!userProfile) return false;
    return userProfile.tokens >= tokenCosts[contentType];
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to generate content");
      return;
    }

    // Use authUser instead of currentUser for consistency
    const userToUse = authUser || currentUser;

    // Check if user is authenticated
    if (!userToUse?.id) {
      setError("Please log in to use AI content generation.");
      return;
    }

    // Check if user has enough tokens
    const tokensRequired = tokenCosts[type];
    const hasEnoughTokens = await subscriptionQueries.hasEnoughTokens(
      userToUse.id,
      tokensRequired
    );

    if (!hasEnoughTokens) {
      setError(
        `Insufficient tokens. You need ${tokensRequired} tokens to generate ${type} content. Please purchase more tokens to continue.`
      );
      return;
    }

    setGenerating(true);
    setTokenLoading(true);
    setError(null);
    setProgress("Consuming tokens...");

    try {
      // First, consume the tokens
      const tokenResult = await subscriptionQueries.consumeTokens(
        userToUse.id,
        `ai_generation_${type}`,
        tokensRequired
      );

      if (!tokenResult.success) {
        throw new Error(tokenResult.error || "Failed to consume tokens");
      }

      setProgress("Initializing generation...");

      const apiUrl = `${apiMap[type]}/generate`;
      const requestBody: any = { prompt };

      // Add type-specific parameters
      if (type === "podcast") requestBody.type = "podcast";

      setProgress(`Connecting to ${type} generation API...`);

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () =>
            reject(new Error("Request timeout - API took too long to respond")),
          60000
        ); // 60 second timeout
      });

      // Make the API request with timeout
      const responsePromise = fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      setProgress(`Generating ${type} content...`);

      let response = (await Promise.race([
        responsePromise,
        timeoutPromise,
      ])) as Response;

      // Handle different HTTP status codes with specific error messages
      if (response.status === 404) {
        throw new Error(
          `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } generation service not found. Please try again later.`
        );
      }

      if (response.status === 429) {
        throw new Error(
          "Too many requests. Please wait a moment before trying again."
        );
      }

      if (response.status === 503) {
        throw new Error(
          `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } generation service is temporarily unavailable. Please try again later.`
        );
      }

      if (response.status === 402) {
        throw new Error(
          "Subscription required for AI content generation. Please upgrade your account."
        );
      }

      // Try GET request if POST returns 405 (Method Not Allowed)
      if (response.status === 405) {
        setProgress("Retrying with alternative method...");
        const queryParams = new URLSearchParams({ prompt }).toString();
        response = await fetch(`${apiUrl}?${queryParams}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(
          `Failed to generate ${type}. Server responded with status ${response.status}: ${errorText}`
        );
      }

      setProgress("Processing generated content...");

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error("Invalid response format from API. Please try again.");
      }

      // Check for API-specific error messages
      if (result.error) {
        throw new Error(result.error);
      }

      if (result.status === "error") {
        throw new Error(result.message || "API returned an error");
      }

      // Extract content URL with more comprehensive checks
      const contentUrl =
        result.url ||
        result.output ||
        result.data?.url ||
        result.image_url ||
        result.imageUrl ||
        result.file_url ||
        result.generated_url ||
        result.result ||
        result.link ||
        result.src ||
        result.path ||
        result.content_url ||
        result.media_url;

      if (!contentUrl) {
        console.error("API Response:", result);
        throw new Error(
          `No content URL found in API response. The ${type} may not have been generated successfully.`
        );
      }

      // Validate URL format
      try {
        new URL(contentUrl);
      } catch {
        throw new Error("Invalid content URL received from API");
      }

      setProgress(
        `Content generated successfully! ${tokensRequired} tokens consumed. Remaining: ${tokenResult.remainingTokens}`
      );

      // Small delay to show success message
      setTimeout(() => {
        onGenerate(contentUrl, type);
        onClose();
      }, 1000);
    } catch (error: any) {
      console.error("Error generating content:", error);

      // Set user-friendly error message
      let errorMessage = error.message;

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
      } else if (error.message.includes("timeout")) {
        errorMessage =
          "Generation is taking longer than expected. Please try again with a simpler prompt.";
      }

      setError(errorMessage);
    } finally {
      setGenerating(false);
      setTokenLoading(false);
      if (!error) {
        setTimeout(() => setProgress(""), 2000);
      }
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md border border-zinc-800">
          <div className="text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-4 text-white animate-spin" />
            <h3 className="text-xl text-white mb-2">Loading...</h3>
            <p className="text-zinc-400">Checking authentication status...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is not logged in
  if (!authUser && !currentUser) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md border border-zinc-800">
          <div className="text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
            <h3 className="text-xl text-white mb-2">Login Required</h3>
            <p className="text-zinc-400 mb-6">
              Please log in to use AI content generation.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md border border-zinc-800">
        <h3 className="text-xl text-white mb-2">AI Content Generator</h3>
        <p className="text-zinc-400 text-sm mb-4">
          Create amazing content with AI using your tokens.
        </p>

        {/* Token Status */}
        {userProfile && (
          <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-white/60" />
                <span className="text-white text-sm font-medium">
                  {userProfile.tokens} Tokens Available
                </span>
              </div>
              <div className="text-white/60 text-xs">
                Plan: {userProfile.subscription_plan.toUpperCase()}
              </div>
            </div>
            <div className="text-white/60 text-xs">
              Status:{" "}
              <span className={getStatusColor(userProfile.subscription_status)}>
                {userProfile.subscription_status.toUpperCase()}
              </span>
            </div>

            {userProfile.tokens < Math.min(...Object.values(tokenCosts)) && (
              <div className="mt-3 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/20 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300 text-xs">
                  Low tokens! You need at least{" "}
                  {Math.min(...Object.values(tokenCosts))} tokens for content
                  generation.
                </span>
              </div>
            )}

            {userProfile.subscription_status === "expired" && (
              <div className="mt-3 p-3 bg-red-500/20 rounded-lg border border-red-500/20 flex items-center space-x-2">
                <Lock className="w-4 h-4 text-red-400" />
                <span className="text-red-300 text-xs">
                  Your subscription has expired. Purchase a new plan to get more
                  tokens.
                </span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4">
          {contentTypes.map(({ id, label, icon: Icon, cost }) => {
            const canAfford = canAffordGeneration(id);
            return (
              <button
                key={id}
                onClick={() => setType(id)}
                disabled={!canAfford}
                className={`flex flex-col items-center justify-center space-y-1 px-3 py-3 rounded-lg transition-all relative ${
                  type === id
                    ? "bg-white/10 text-white border border-white/20"
                    : canAfford
                    ? "text-zinc-400 hover:text-white hover:bg-white/5"
                    : "text-zinc-600 cursor-not-allowed bg-zinc-800/50"
                }`}
              >
                <div className="flex items-center space-x-1">
                  <Icon className="w-4 h-4" />
                  {!canAfford && <Lock className="w-3 h-3" />}
                </div>
                <span className="text-xs">{label}</span>
                <div
                  className={`flex items-center space-x-1 text-xs ${
                    canAfford ? "text-white/60" : "text-red-400"
                  }`}
                >
                  <Coins className="w-3 h-3" />
                  <span>{cost}</span>
                </div>
              </button>
            );
          })}
        </div>

        <textarea
          placeholder={`Describe the ${type} you want to generate... (${tokenCosts[type]} tokens)`}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            if (error) setError(null); // Clear error when user starts typing
          }}
          className="w-full h-32 bg-zinc-800 rounded-lg p-4 text-white placeholder-zinc-500 resize-none border border-zinc-700 focus:border-white/20 focus:ring-0 transition-colors mb-4"
          disabled={!canAffordGeneration(type)}
        />

        {/* Progress indicator */}
        {progress && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              {tokenLoading ? (
                <>
                  <Coins className="w-4 h-4 text-blue-400" />
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                </>
              ) : (
                <CheckCircle className="w-4 h-4 text-blue-400" />
              )}
              <span className="text-blue-400 text-sm">{progress}</span>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-zinc-400 text-xs flex items-center space-x-1">
            <Coins className="w-3 h-3" />
            <span>Current selection costs {tokenCosts[type]} tokens</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={generating || !prompt || !canAffordGeneration(type)}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : !canAffordGeneration(type) ? (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Insufficient Tokens
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate ({tokenCosts[type]} tokens)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
