// AlgorithmSelector.tsx
import React, { useState, useEffect } from "react";
import {
  Clock,
  Heart,
  Brain,
  Users,
  Compass,
  Moon,
  HourglassIcon,
  Shuffle,
  History,
  Route,
  MapPin,
  GraduationCap,
  Palette,
  Settings,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { profileQueries } from "../../lib/exploreQueries";

type AlgorithmType =
  | "chronological"
  | "engagement"
  | "interest"
  | "network"
  | "discovery"
  | "mood"
  | "timeInvestment"
  | "contrarian"
  | "timeCapsule"
  | "creatorJourney"
  | "localProximity"
  | "expertiseDevelopment"
  | "creativeRemix";

interface AlgorithmSelectorProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  userId?: string;
}

interface UserPreferences {
  interests: string[];
  values: string[];
  aesthetics: string[];
  genres: string[];
}

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithm,
  onAlgorithmChange,
  userId = "current-user-id", // Replace with actual user ID from auth
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userPreferences, setUserPreferences] =
    useState<UserPreferences | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [algorithmStats, setAlgorithmStats] = useState<Record<string, number>>(
    {}
  );

  // Fetch user preferences to personalize algorithm recommendations
  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const { data, error } = await profileQueries.getUserPreferences(userId);
        if (!error && data) {
          setUserPreferences(data);
        }
      } catch (error) {
        console.error("Error fetching user preferences:", error);
      }
    };

    if (userId) {
      fetchUserPreferences();
    }
  }, [userId]);

  // Mock algorithm performance stats (in real app, fetch from analytics)
  useEffect(() => {
    // Simulate fetching algorithm performance stats
    setAlgorithmStats({
      chronological: 85,
      engagement: 92,
      interest: 94,
      network: 78,
      discovery: 88,
      mood: 76,
      timeInvestment: 82,
      contrarian: 65,
      timeCapsule: 71,
      creatorJourney: 89,
      localProximity: 83,
      expertiseDevelopment: 91,
      creativeRemix: 87,
    });
  }, []);

  const algorithms = [
    {
      id: "interest" as const,
      name: "Interest-Based",
      description:
        "Personalized content based on your interests and preferences",
      icon: Brain,
      category: "Personalized",
      recommended: true,
      detailedDescription:
        "Uses your selected interests, values, and past interactions to curate content that aligns with your preferences.",
    },
    {
      id: "engagement" as const,
      name: "Engagement-Based",
      description: "Content ranked by user interaction and popularity",
      icon: Heart,
      category: "Popular",
      recommended: false,
      detailedDescription:
        "Shows content with high likes, comments, and shares. Great for discovering trending topics.",
    },
    {
      id: "discovery" as const,
      name: "Discovery",
      description: "Explore new and diverse content outside your comfort zone",
      icon: Compass,
      category: "Exploratory",
      recommended: true,
      detailedDescription:
        "Introduces you to new creators, topics, and perspectives you might not typically encounter.",
    },
    {
      id: "network" as const,
      name: "Network-Based",
      description: "Content from creators and groups you follow",
      icon: Users,
      category: "Social",
      recommended: false,
      detailedDescription:
        "Prioritizes content from creators you follow and interest groups you've joined.",
    },
    {
      id: "localProximity" as const,
      name: "Local Proximity",
      description: "Content and events from your geographical area",
      icon: MapPin,
      category: "Location",
      recommended: userPreferences?.interests?.includes("local") || false,
      detailedDescription:
        "Shows local events, nearby locations, and content from creators in your area.",
    },
    {
      id: "expertiseDevelopment" as const,
      name: "Expertise Development",
      description: "Progressive content to build skills in your interests",
      icon: GraduationCap,
      category: "Learning",
      recommended: userPreferences?.interests?.includes("learning") || false,
      detailedDescription:
        "Curates content that helps you develop expertise in your areas of interest, from beginner to advanced.",
    },
    {
      id: "creatorJourney" as const,
      name: "Creator Journey",
      description: "Follow the evolution and growth of your favorite creators",
      icon: Route,
      category: "Social",
      recommended: false,
      detailedDescription:
        "Tracks and showcases the progression of creators you follow, highlighting their growth and milestones.",
    },
    {
      id: "mood" as const,
      name: "Mood-Based",
      description: "Content that matches your current emotional state",
      icon: Moon,
      category: "Emotional",
      recommended: false,
      detailedDescription:
        "Analyzes your recent activity to determine your mood and suggests appropriate content.",
    },
    {
      id: "timeInvestment" as const,
      name: "Time Investment",
      description: "Content optimized for your available time and attention",
      icon: HourglassIcon,
      category: "Efficiency",
      recommended: false,
      detailedDescription:
        "Adapts content length and complexity based on your typical session duration and engagement patterns.",
    },
    {
      id: "creativeRemix" as const,
      name: "Creative Remix",
      description: "Inspired combinations of your aesthetic preferences",
      icon: Palette,
      category: "Creative",
      recommended: (userPreferences?.aesthetics?.length ?? 0) > 0,
      detailedDescription:
        "Combines elements from your preferred aesthetics to create unique content recommendations.",
    },
    {
      id: "chronological" as const,
      name: "Chronological",
      description: "Content shown in order of creation (newest first)",
      icon: Clock,
      category: "Simple",
      recommended: false,
      detailedDescription:
        "Simple time-based feed showing the most recent content first.",
    },
    {
      id: "contrarian" as const,
      name: "Contrarian",
      description: "Challenge your perspectives with opposing viewpoints",
      icon: Shuffle,
      category: "Challenging",
      recommended: false,
      detailedDescription:
        "Deliberately shows content that challenges your existing beliefs and introduces contrasting perspectives.",
    },
    {
      id: "timeCapsule" as const,
      name: "Time Capsule",
      description: "Rediscover content from your past interactions",
      icon: History,
      category: "Nostalgic",
      recommended: false,
      detailedDescription:
        "Resurfaces content you engaged with in the past, helping you rediscover forgotten interests.",
    },
  ];

  // Group algorithms by category
  const categorizedAlgorithms = algorithms.reduce((acc, algorithm) => {
    if (!acc[algorithm.category]) {
      acc[algorithm.category] = [];
    }
    acc[algorithm.category].push(algorithm);
    return acc;
  }, {} as Record<string, typeof algorithms>);

  // Get recommended algorithms
  const recommendedAlgorithms = algorithms.filter((alg) => alg.recommended);

  const handleAlgorithmSelect = (algorithmId: AlgorithmType) => {
    onAlgorithmChange(algorithmId);
    // Optionally save user's algorithm preference
    if (userId) {
      // You could add a function to save algorithm preference
      // profileQueries.saveAlgorithmPreference(userId, algorithmId);
    }
  };

  return (
    <div className="bg-zinc-900/95 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl text-zinc-200 font-cormorant">
            Content Algorithm
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Choose how you want to discover content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:text-zinc-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">
              {isExpanded ? "Simple View" : "Advanced View"}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Recommended Algorithms (Always Visible) */}
      {recommendedAlgorithms.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <h3 className="text-sm font-medium text-zinc-300">
              Recommended for You
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedAlgorithms.map((algorithm) => {
              const Icon = algorithm.icon;
              const isSelected = selectedAlgorithm === algorithm.id;
              const performanceScore = algorithmStats[algorithm.id] || 0;

              return (
                <div
                  key={algorithm.id}
                  className="relative"
                  onMouseEnter={() => setShowTooltip(algorithm.id)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <button
                    onClick={() => handleAlgorithmSelect(algorithm.id)}
                    className={`w-full flex items-start space-x-3 p-4 rounded-lg transition-all border ${
                      isSelected
                        ? "bg-purple-900/30 border-purple-600/50 shadow-lg"
                        : "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 mt-1 ${
                        isSelected ? "text-purple-400" : "text-zinc-400"
                      }`}
                    />
                    <div className="text-left flex-1">
                      <div
                        className={`font-medium ${
                          isSelected ? "text-purple-300" : "text-zinc-200"
                        }`}
                      >
                        {algorithm.name}
                      </div>
                      <div className="text-sm text-zinc-400 mt-1">
                        {algorithm.description}
                      </div>
                      {/* Performance indicator */}
                      <div className="flex items-center mt-2">
                        <div className="flex-1 bg-zinc-700 rounded-full h-1">
                          <div
                            className="bg-purple-500 rounded-full h-1 transition-all"
                            style={{ width: `${performanceScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-zinc-500 ml-2">
                          {performanceScore}% match
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Tooltip */}
                  {showTooltip === algorithm.id && (
                    <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-300 max-w-xs shadow-xl">
                      <div className="font-medium text-zinc-200 mb-1">
                        {algorithm.name}
                      </div>
                      <div className="text-zinc-400">
                        {algorithm.detailedDescription}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-zinc-800"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Algorithms (Expandable) */}
      {isExpanded && (
        <div className="space-y-6">
          {Object.entries(categorizedAlgorithms).map(
            ([category, algorithms]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-zinc-500 rounded-full"></div>
                  <h3 className="text-sm font-medium text-zinc-300">
                    {category}
                  </h3>
                  <div className="flex-1 h-px bg-zinc-800"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {algorithms.map((algorithm) => {
                    const Icon = algorithm.icon;
                    const isSelected = selectedAlgorithm === algorithm.id;
                    const performanceScore = algorithmStats[algorithm.id] || 0;

                    return (
                      <div
                        key={algorithm.id}
                        className="relative"
                        onMouseEnter={() => setShowTooltip(algorithm.id)}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <button
                          onClick={() => handleAlgorithmSelect(algorithm.id)}
                          className={`w-full flex items-start space-x-3 p-4 rounded-lg transition-all border ${
                            isSelected
                              ? "bg-purple-900/30 border-purple-600/50 shadow-lg"
                              : "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 mt-1 ${
                              isSelected ? "text-purple-400" : "text-zinc-400"
                            }`}
                          />
                          <div className="text-left flex-1">
                            <div className="flex items-center gap-2">
                              <div
                                className={`font-medium ${
                                  isSelected
                                    ? "text-purple-300"
                                    : "text-zinc-200"
                                }`}
                              >
                                {algorithm.name}
                              </div>
                              {algorithm.recommended && (
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              )}
                            </div>
                            <div className="text-sm text-zinc-400 mt-1">
                              {algorithm.description}
                            </div>
                            {/* Performance indicator */}
                            <div className="flex items-center mt-2">
                              <div className="flex-1 bg-zinc-700 rounded-full h-1">
                                <div
                                  className="bg-purple-500 rounded-full h-1 transition-all"
                                  style={{ width: `${performanceScore}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-zinc-500 ml-2">
                                {performanceScore}% match
                              </span>
                            </div>
                          </div>
                        </button>

                        {/* Tooltip */}
                        {showTooltip === algorithm.id && (
                          <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-300 max-w-xs shadow-xl">
                            <div className="font-medium text-zinc-200 mb-1">
                              {algorithm.name}
                            </div>
                            <div className="text-zinc-400 mb-2">
                              {algorithm.detailedDescription}
                            </div>
                            <div className="text-xs text-zinc-500">
                              Category: {algorithm.category}
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-zinc-800"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Current Selection Summary */}
      <div className="mt-6 p-4 bg-zinc-800/30 border border-zinc-700/50 rounded-lg">
        <div className="flex items-center gap-3">
          {(() => {
            const currentAlgorithm = algorithms.find(
              (alg) => alg.id === selectedAlgorithm
            );
            const Icon = currentAlgorithm?.icon || Brain;
            return (
              <>
                <Icon className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-zinc-200 font-medium">
                    Currently using:{" "}
                    {currentAlgorithm?.name || "Interest-Based"}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {currentAlgorithm?.description ||
                      "Personalized content based on your interests"}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Algorithm Performance Insights */}
      {userPreferences && (
        <div className="mt-4 p-4 bg-zinc-800/20 border border-zinc-700/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-300">
              Personalization Insights
            </span>
          </div>
          <div className="text-xs text-zinc-400 space-y-1">
            {userPreferences.interests?.length > 0 && (
              <div>
                Based on your {userPreferences.interests.length} interests, we
                recommend Interest-Based or Discovery algorithms.
              </div>
            )}
            {userPreferences.aesthetics?.length > 0 && (
              <div>
                With {userPreferences.aesthetics.length} aesthetic preferences,
                Creative Remix could offer unique combinations.
              </div>
            )}
            {userPreferences.values?.length > 0 && (
              <div>
                Your {userPreferences.values.length} core values help us
                personalize content alignment.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
