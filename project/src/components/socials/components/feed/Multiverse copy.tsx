import React, { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  Users,
  MapPin,
  Clock,
  MessageCircle,
  Eye,
  Ghost,
  Film,
  Layers,
  Sparkles,
} from "lucide-react";
import { GraphDatabaseService } from "../../services/graphDatabase";
import { SocialEvent, EventConnection, User } from "../../types/socialGraph";
import multiverseQueries from "../../lib/multiverseQueries";
import {
  SocialEvent as DBSocialEvent,
  User as DBUser,
  EventConnection as DBEventConnection,
  TimeLockRoom as DBTimeLockRoom,
  GhostThread as DBGhostThread,
} from "../../lib/multiverseQueries";

interface Person {
  id: string;
  name: string;
  avatar: string;
  x: number;
  y: number;
}

interface Event {
  id: string;
  personId: string;
  timestamp: string;
  type: "post" | "call" | "message" | "location" | "story" | "like" | "view";
  content: string;
  location?: string;
  connections: string[];
  metadata?: {
    mood?: string;
    visibility?: "public" | "private" | "friends";
    reactions?: number;
  };
}

interface TimeLockRoom {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  participants: string[];
  location: string;
  type: "party" | "meeting" | "event" | "gathering";
}

interface GhostThread {
  id: string;
  personIds: string[];
  intersections: Array<{
    timestamp: string;
    location: string;
    type: "proximity" | "mutual_friend" | "same_event" | "digital_overlap";
    description: string;
  }>;
  serendipityScore: number;
}

export const Multiverse = () => {
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(
    new Date("2024-03-15T20:42:00Z")
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<
    "tree" | "timeline" | "perspective" | "narrative"
  >("tree");
  const [showGhostThreads, setShowGhostThreads] = useState(false);
  const [showTimeLockRooms, setShowTimeLockRooms] = useState(false);
  const [narrativeMode, setNarrativeMode] = useState(false);
  const [customStoryline, setCustomStoryline] = useState<string[]>([]);
  const [graphDB] = useState(() => {
    try {
      return new GraphDatabaseService();
    } catch (err) {
      console.error("Failed to initialize GraphDatabaseService:", err);
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStoryPreview, setShowStoryPreview] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [realUsers, setRealUsers] = useState<DBUser[]>([]);
  const [realEvents, setRealEvents] = useState<DBSocialEvent[]>([]);
  const [realConnections, setRealConnections] = useState<DBEventConnection[]>(
    []
  );
  const [realTimeLockRooms, setRealTimeLockRooms] = useState<DBTimeLockRoom[]>(
    []
  );
  const [realGhostThreads, setRealGhostThreads] = useState<DBGhostThread[]>([]);

  useEffect(() => {
    const loadRealData = async () => {
      setIsLoading(true);
      try {
        // Load users
        const users = await multiverseQueries.userProfiles.getAllUsers();
        console.log("Loaded users:", users);
        setRealUsers(users);

        // Load recent events (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const events = await multiverseQueries.socialEvents.getAllEvents({
          dateRange: {
            start: thirtyDaysAgo.toISOString(),
            end: new Date().toISOString(),
          },
          limit: 500,
        });
        console.log("Loaded events:", events);
        setRealEvents(events);

        // Load connections for these events
        if (events.length > 0) {
          const eventIds = events.map((e) => e.id);
          const connections =
            await multiverseQueries.eventConnections.getConnectionsByEvents(
              eventIds
            );
          console.log("Loaded connections:", connections);
          setRealConnections(connections);
        }

        // Load active time lock rooms
        const timeLockRooms =
          await multiverseQueries.timeLockRooms.getActiveRooms();
        console.log("Loaded time lock rooms:", timeLockRooms);
        setRealTimeLockRooms(timeLockRooms);

        // Load active ghost threads
        const ghostThreads =
          await multiverseQueries.ghostThreads.getActiveGhostThreads();
        console.log("Loaded ghost threads:", ghostThreads);
        setRealGhostThreads(ghostThreads);

        setError(null);
      } catch (err) {
        console.error("Failed to load real data:", err);
        setError(
          "Failed to load data from database. Check console for details."
        );

        // Add fallback mock data for testing
        setRealUsers([
          {
            id: "user1",
            display_name: "Test User 1",
            full_name: "Test User One",
            avatar_url: undefined,
            timeline_position_x: 200,
            timeline_position_y: 150,
            social_influence_score: 0.8,
            serendipity_score: 0.6,
            privacy_settings: {},
            timezone: "UTC",
          },
          {
            id: "user2",
            display_name: "Test User 2",
            full_name: "Test User Two",
            avatar_url: undefined,
            timeline_position_x: 400,
            timeline_position_y: 200,
            social_influence_score: 0.7,
            serendipity_score: 0.5,
            privacy_settings: {},
            timezone: "UTC",
          },
        ]);

        setRealEvents([
          {
            id: "event1",
            user_id: "user1",
            event_type: "post",
            content: "Test post from user 1",
            timestamp: new Date().toISOString(),
            visibility: "public",
            impressions_count: 0,
            reach_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRealData();
  }, []);
  const validateDatabaseData = () => {
    const issues = [];

    if (realUsers.length === 0) {
      issues.push("No users loaded");
    }

    if (realEvents.length === 0) {
      issues.push("No events loaded");
    }

    // Check if users have required fields
    realUsers.forEach((user) => {
      if (!user.id) issues.push(`User missing ID: ${JSON.stringify(user)}`);
      if (!user.display_name && !user.full_name) {
        issues.push(`User ${user.id} missing display name`);
      }
    });

    // Check if events have required fields
    realEvents.forEach((event) => {
      if (!event.id) issues.push(`Event missing ID: ${JSON.stringify(event)}`);
      if (!event.user_id) issues.push(`Event ${event.id} missing user_id`);
      if (!event.event_type)
        issues.push(`Event ${event.id} missing event_type`);
    });

    if (issues.length > 0) {
      console.warn("Database validation issues:", issues);
      setError(
        `Data validation issues: ${issues.slice(0, 3).join(", ")}${
          issues.length > 3 ? "..." : ""
        }`
      );
    }

    return issues.length === 0;
  };
  const getEventColor = (type: string) => {
    switch (type) {
      case "post":
        return "#6b7280"; // Gray
      case "call":
        return "#4b5563"; // Dark gray
      case "message":
        return "#374151"; // Darker gray
      case "location":
        return "#1f2937"; // Very dark gray
      case "story":
        return "#111827"; // Almost black
      case "like":
        return "#9ca3af"; // Light gray
      case "view":
        return "#d1d5db"; // Lighter gray
      default:
        return "#6b7280";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "post":
        return "📱";
      case "call":
        return "📞";
      case "message":
        return "💬";
      case "location":
        return "📍";
      case "story":
        return "📖";
      case "like":
        return "❤️";
      case "view":
        return "👁️";
      default:
        return "⭐";
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getVisibleEvents = () => {
    return realEvents.filter(
      (event) => new Date(event.timestamp) <= currentTime
    );
  };

  // Replace the getPersonPerspective function
  const getPersonPerspective = (personId: string) => {
    return realEvents.filter(
      (event) =>
        event.user_id === personId && new Date(event.timestamp) <= currentTime
    );
  };

  const generateNarrative = () => {
    const visibleEvents = getVisibleEvents().sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    if (visibleEvents.length === 0) {
      return "The digital realm awaits... Press 'Play' to witness the unfolding connections between souls across the multiverse.";
    }

    const narrativeStyles = [
      {
        title: "The Digital Symphony",
        opening:
          "In the interconnected web of human consciousness, every click, every message, every shared moment creates ripples that transcend the boundaries of space and time...",
        style: "poetic",
      },
      {
        title: "Threads of Serendipity",
        opening:
          "What appears as random digital noise to the untrained eye reveals itself as an intricate dance of destiny to those who know how to look...",
        style: "mysterious",
      },
      {
        title: "The Social Constellation",
        opening:
          "Like stars in the night sky, each person's digital presence forms part of a greater constellation, their interactions creating patterns of meaning...",
        style: "cosmic",
      },
    ];

    const selectedNarrative =
      narrativeStyles[Math.floor(Math.random() * narrativeStyles.length)];
    let narrative = `**${selectedNarrative.title}**\n\n${selectedNarrative.opening}\n\n`;

    const eventChapters = [];
    let currentChapter: DBSocialEvent[] = [];
    let lastTime: Date | null = null;

    visibleEvents.forEach((event, index) => {
      const eventTime = new Date(event.timestamp);
      if (!lastTime || eventTime.getTime() - lastTime.getTime() > 300000) {
        if (currentChapter.length > 0) {
          eventChapters.push([...currentChapter]);
        }
        currentChapter = [event];
      } else {
        currentChapter.push(event);
      }
      lastTime = eventTime;
    });
    if (currentChapter.length > 0) {
      eventChapters.push(currentChapter);
    }

    eventChapters.forEach((chapter, chapterIndex) => {
      const chapterTime = formatTime(chapter[0].timestamp);
      narrative += `\n**Chapter ${chapterIndex + 1}: ${chapterTime}**\n`;

      chapter.forEach((event, eventIndex) => {
        const person = realUsers.find((p) => p.id === event.user_id);
        const mood = event.mood || "contemplative";
        const userName =
          person?.display_name || person?.full_name || `User ${event.user_id}`;

        switch (event.event_type) {
          case "post":
            narrative += `\n• *${userName}* broadcasts their ${mood} energy into the digital ether${
              event.location_address ? ` from ${event.location_address}` : ""
            }, sending waves of connection across the network...`;
            break;
          case "call":
            narrative += `\n• Through invisible threads of connection, *${userName}* reaches across the void, their ${mood} voice carrying secrets and stories...`;
            break;
          case "message":
            narrative += `\n• *${userName}* weaves words into the digital tapestry, their ${mood} message becoming part of the greater conversation...`;
            break;
          // Add other cases as needed
          default:
            narrative += `\n• *${userName}* contributes their ${mood} essence to the ever-evolving narrative...`;
        }
      });

      narrative += "\n";
    });

    const conclusions = [
      "\n*And so the dance continues, each interaction a step in the grand choreography of human connection...*",
      "\n*In this moment, we witness the beautiful complexity of our interconnected existence...*",
      "\n*The multiverse reveals its secrets to those who dare to look beyond the surface...*",
    ];

    narrative += conclusions[Math.floor(Math.random() * conclusions.length)];

    return narrative;
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setCurrentTime(new Date("2024-03-15T20:42:00Z"));
    setSelectedEvent(null);
    setSelectedPerson(null);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePersonClick = (personId: string) => {
    setSelectedPerson(selectedPerson === personId ? null : personId);
    setViewMode("perspective");
  };

  const createStoryPrompt = (
    people: string[],
    events: DBSocialEvent[],
    style: string
  ) => {
    const eventSummary = events
      .map((event) => {
        const user = realUsers.find((u) => u.id === event.user_id);
        const userName =
          user?.display_name || user?.full_name || `User ${event.user_id}`;
        return `${event.timestamp}: ${userName} - ${event.content} ${
          event.location_address ? `at ${event.location_address}` : ""
        } (mood: ${event.mood || "unknown"})`;
      })
      .join("\n");

    return `
Create an engaging ${style} story based on the following interconnected events and people:

PEOPLE INVOLVED: ${people.join(", ")}

EVENTS TIMELINE:
${eventSummary}

REQUIREMENTS:
- Write a cohesive narrative that connects these events meaningfully
- Highlight the serendipitous connections between different people's experiences
- Include emotional depth and character development
- Make the story engaging and relatable
- Length: 500-800 words
- Style: ${style}

Focus on how these seemingly separate moments in different people's lives actually form a larger, interconnected story of human connection and shared experiences.
`;
  };
  const generateCustomStory = async () => {
    if (customStoryline.length === 0) {
      setError("Please select at least one person for your storyline.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const selectedPeople = customStoryline
        .map((id) => {
          const user = realUsers.find((u) => u.id === id);
          return user?.display_name || user?.full_name || `User ${id}`;
        })
        .filter((name): name is string => typeof name === "string");

      const relevantEvents = realEvents
        .filter((event) => customStoryline.includes(event.user_id))
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

      // Get API credentials from environment variables
      const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
      const DEEPSEEK_API_URL =
        import.meta.env.VITE_DEEPSEEK_API_URL ||
        "https://api.deepseek.com/v1/chat/completions";

      if (!DEEPSEEK_API_KEY) {
        throw new Error(
          "DeepSeek API key not found. Please check your .env file."
        );
      }

      // Create story prompt
      const prompt = createStoryPrompt(
        selectedPeople,
        relevantEvents,
        "narrative"
      );

      // Call DeepSeek API directly
      const response = await fetch(DEEPSEEK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "You are a creative storyteller who specializes in weaving together interconnected narratives from social media events and personal interactions. Create engaging, coherent stories that highlight the serendipitous connections between different people's lives.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 1500,
          temperature: 0.8,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("DeepSeek API Error:", errorData);
        throw new Error(
          `DeepSeek API error: ${response.status} - ${
            errorData.error || "Failed to generate story"
          }`
        );
      }

      const data = await response.json();
      const story =
        data.choices[0]?.message?.content || "Story generation failed";

      setGeneratedStory(story);
      setShowStoryPreview(true);
    } catch (err) {
      console.error("Story generation error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate story. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const TestDatabaseConnection = () => (
    <button
      onClick={async () => {
        setIsLoading(true);
        try {
          const testUser = await multiverseQueries.userProfiles.getAllUsers();
          console.log("Database test successful:", testUser);
          setError("Database test successful! Check console.");
        } catch (err) {
          console.error("Database test failed:", err);
          setError(`Database test failed: ${err}`);
        } finally {
          setIsLoading(false);
        }
      }}
      className="px-3 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
      disabled={isLoading}
    >
      Test DB Connection
    </button>
  );

  useEffect(() => {
    if (!isLoading && (realUsers.length > 0 || realEvents.length > 0)) {
      validateDatabaseData();
    }
  }, [isLoading, realUsers, realEvents]);
  const handleViewModeChange = () => {
    const modes: (typeof viewMode)[] = [
      "tree",
      "timeline",
      "perspective",
      "narrative",
    ];
    const currentIndex = modes.indexOf(viewMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setViewMode(nextMode);

    // Reset selections when changing modes
    if (nextMode !== "perspective") {
      setSelectedPerson(null);
    }
  };

  useEffect(() => {
    // Subscribe to real-time updates
    const eventsSubscription = multiverseQueries.realtime.subscribeToEvents(
      (payload) => {
        if (payload.eventType === "INSERT") {
          setRealEvents((prev) => [...prev, payload.new]);
        }
      }
    );

    const connectionsSubscription =
      multiverseQueries.realtime.subscribeToConnections((payload) => {
        if (payload.eventType === "INSERT") {
          setRealConnections((prev) => [...prev, payload.new]);
        }
      });

    const ghostThreadsSubscription =
      multiverseQueries.realtime.subscribeToGhostThreads((payload) => {
        if (payload.eventType === "INSERT") {
          setRealGhostThreads((prev) => [...prev, payload.new]);
        } else if (payload.eventType === "UPDATE") {
          setRealGhostThreads((prev) =>
            prev.map((thread) =>
              thread.id === payload.new.id ? payload.new : thread
            )
          );
        }
      });

    return () => {
      eventsSubscription.unsubscribe();
      connectionsSubscription.unsubscribe();
      ghostThreadsSubscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => new Date(prev.getTime() + 1000));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);
  {
    isLoading && (
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5 mb-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-white">Loading multiverse data...</span>
        </div>
      </div>
    );
  }

  const DatabaseStatus = () => (
    <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${
              error ? "bg-red-500" : "bg-green-500"
            }`}
          />
          <span className="text-white/80 text-sm">
            Database Status:{" "}
            {error ? "Disconnected (Using fallback)" : "Connected"}
          </span>
        </div>
        <div className="text-white/60 text-sm">
          Users: {realUsers.length} | Events: {realEvents.length} | Connections:{" "}
          {realConnections.length}
        </div>
      </div>
    </div>
  );
  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 backdrop-blur-xl rounded-lg p-4 border border-red-500/20 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-300 hover:text-red-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header Controls */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl text-white">Multiverse Timeline</h2>
            <p className="text-white/60">
              Interconnected events across your network
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setViewMode(
                  viewMode === "tree"
                    ? "timeline"
                    : viewMode === "timeline"
                    ? "perspective"
                    : viewMode === "perspective"
                    ? "narrative"
                    : "tree"
                )
              }
              className="px-3 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              {viewMode === "tree"
                ? "Timeline View"
                : viewMode === "timeline"
                ? "Perspective View"
                : viewMode === "perspective"
                ? "Narrative Mode"
                : "Tree View"}
            </button>
          </div>
        </div>

        {/* Advanced Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlayback}
              className="flex items-center space-x-2 px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>

            <div className="flex items-center space-x-2 text-white/60">
              <Clock className="w-4 h-4" />
              <span>{formatTime(currentTime.toISOString())}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-white/60 text-sm">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowGhostThreads(!showGhostThreads)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              showGhostThreads
                ? "bg-white/10 text-white border border-white/20"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Ghost className="w-4 h-4" />
            <span>Ghost Threads</span>
          </button>

          <button
            onClick={() => setShowTimeLockRooms(!showTimeLockRooms)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              showTimeLockRooms
                ? "bg-white/10 text-white border border-white/20"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Time Lock Rooms</span>
          </button>

          <button
            onClick={() => setNarrativeMode(!narrativeMode)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              narrativeMode
                ? "bg-white/10 text-white border border-white/20"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Film className="w-4 h-4" />
            <span>AI Narrative</span>
          </button>
        </div>
      </div>

      {/* Narrative Mode */}
      {narrativeMode && (
        <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
          <div className="flex items-center space-x-3 mb-4">
            <Film className="w-5 h-5 text-white/60" />
            <h3 className="text-lg text-white">AI-Generated Narrative</h3>
          </div>
          <div className="bg-gradient-to-br from-black/30 to-black/10 rounded-lg p-6 border border-white/10">
            <div className="relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-slate-400 to-slate-500 rounded-full"></div>
              <div
                className="text-white/90 leading-relaxed font-light pl-4"
                dangerouslySetInnerHTML={{
                  __html: generateNarrative()
                    .replace(
                      /\*\*(.*?)\*\*/g,
                      '<h3 class="text-xl font-bold text-white mb-4 mt-6 first:mt-0">$1</h3>'
                    )
                    .replace(
                      /\*(.*?)\*/g,
                      '<em class="text-blue-300 italic font-medium">$1</em>'
                    )
                    .replace(
                      /^• /gm,
                      '<div class="flex items-start space-x-3 mb-3"><span class="text-slate-400 mt-1">•</span><span class="flex-1">'
                    )
                    .replace(/\n\n/g, '</span></div><div class="mb-4"></div>')
                    .replace(/\n(?!$)/g, "</span></div>")
                    .replace(/([^>])$/gm, "$1</span></div>")
                    .replace(
                      /<div class="mb-4"><\/div>/g,
                      '<div class="mb-4"></div>'
                    )
                    .replace(
                      /^(?!<)(.+)$/gm,
                      '<p class="mb-4 text-white/80">$1</p>'
                    ),
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Perspective View */}
      {/* {viewMode === "perspective" && selectedPerson && (
        <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
          <div className="flex items-center space-x-3 mb-4">
            <Eye className="w-5 h-5 text-white/60" />
            <h3 className="text-lg text-white">
              {mockPeople.find((p) => p.id === selectedPerson)?.name}'s
              Perspective
            </h3>
          </div>
          <div className="space-y-4">
            {getPersonPerspective(selectedPerson).map((event) => (
              <div
                key={event.id}
                className="bg-black/20 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">
                    {formatTime(event.timestamp)}
                  </span>
                  <span className="text-white/60 text-sm">
                    {event.metadata?.mood}
                  </span>
                </div>
                <p className="text-white">{event.content}</p>
                {event.location && (
                  <div className="flex items-center space-x-2 text-white/60 mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Visualization */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg border border-white/5 overflow-hidden">
        <div
          ref={containerRef}
          className="relative h-[600px] overflow-hidden"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%">
              <defs>
                <pattern
                  id="grid"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {showTimeLockRooms &&
            realTimeLockRooms.map((room) => {
              const roomParticipants = realUsers.filter((u) =>
                room.participant_ids?.includes(u.id)
              );
              if (roomParticipants.length === 0) return null;

              const centerX =
                roomParticipants.reduce(
                  (sum, u) => sum + (u.timeline_position_x || 200),
                  0
                ) / roomParticipants.length;
              const centerY =
                roomParticipants.reduce(
                  (sum, u) => sum + (u.timeline_position_y || 150),
                  0
                ) / roomParticipants.length;
              const radius = Math.max(80, roomParticipants.length * 30);

              return (
                <div
                  key={room.id}
                  className="absolute border-2 border-white/10 rounded-full bg-white/5 backdrop-blur-sm"
                  style={{
                    left: centerX - radius,
                    top: centerY - radius,
                    width: radius * 2,
                    height: radius * 2,
                  }}
                >
                  <div className="absolute top-2 left-2 text-white/60 text-xs font-medium">
                    {room.name}
                  </div>
                </div>
              );
            })}

          {/* Ghost Threads */}
          {showGhostThreads &&
            realGhostThreads.map((thread) => {
              const participants = thread.participant_ids
                .map((id) => realUsers.find((u) => u.id === id))
                .filter(Boolean);

              if (participants.length < 2) return null;

              return (
                <div
                  key={thread.id}
                  className="bg-black/20 rounded-lg p-4 border border-white/10 mb-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {participants.slice(0, 2).map((user, index) =>
                        user ? (
                          <React.Fragment key={user.id}>
                            <img
                              src={
                                user.avatar_url ||
                                `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop`
                              }
                              alt={user.display_name || user.full_name}
                              className="w-8 h-8 rounded-full grayscale"
                            />
                            {index === 0 && (
                              <span className="text-white/60">↔</span>
                            )}
                          </React.Fragment>
                        ) : null
                      )}
                    </div>
                    <div className="text-white/60">
                      Serendipity: {Math.round(thread.serendipity_score)}%
                    </div>
                  </div>

                  <div className="space-y-2">
                    {thread.intersections.map(
                      (intersection: any, index: number) => (
                        <div key={index} className="text-white/70 text-sm">
                          <span className="text-white/50">
                            {formatTime(intersection.timestamp)}
                          </span>{" "}
                          - {intersection.description}
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}

          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {realConnections.map((connection) => {
              const fromEvent = realEvents.find(
                (e) => e.id === connection.from_event_id
              );
              const toEvent = realEvents.find(
                (e) => e.id === connection.to_event_id
              );

              if (
                !fromEvent ||
                !toEvent ||
                new Date(fromEvent.timestamp) > currentTime ||
                new Date(toEvent.timestamp) > currentTime
              )
                return null;

              const fromUser = realUsers.find(
                (p) => p.id === fromEvent.user_id
              );
              const toUser = realUsers.find((p) => p.id === toEvent.user_id);

              if (!fromUser || !toUser) return null;

              return (
                <line
                  key={`${connection.from_event_id}-${connection.to_event_id}`}
                  x1={fromUser.timeline_position_x || 200}
                  y1={fromUser.timeline_position_y || 150}
                  x2={toUser.timeline_position_x || 400}
                  y2={toUser.timeline_position_y || 200}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              );
            })}
          </svg>
          {/* People Nodes */}
          {realUsers.map((user) => {
            // Convert DB user to display format
            const person = {
              id: user.id,
              name: user.display_name || user.full_name || `User ${user.id}`,
              avatar: user.avatar_url || null, // Set to null instead of fallback URL
              x: user.timeline_position_x || Math.random() * 500 + 100,
              y: user.timeline_position_y || Math.random() * 300 + 100,
            };

            const personEvents = getVisibleEvents().filter(
              (e) => e.user_id === person.id
            );
            const hasActiveEvent = personEvents.length > 0;
            const isSelected = selectedPerson === person.id;

            return (
              <div
                key={person.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: person.x, top: person.y }}
              >
                <div
                  className={`relative group cursor-pointer ${
                    hasActiveEvent ? "animate-pulse" : ""
                  }`}
                  onClick={() => handlePersonClick(person.id)}
                >
                  {/* Updated avatar rendering with fallback */}
                  {person.avatar ? (
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className={`w-16 h-16 rounded-full border-4 transition-all grayscale ${
                        isSelected
                          ? "border-white shadow-[0_0_30px_rgba(255,255,255,0.8)] grayscale-0"
                          : hasActiveEvent
                          ? "border-white/70 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                          : "border-white/30"
                      }`}
                      onError={(e) => {
                        // Fallback when image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-16 h-16 rounded-full border-4 transition-all flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br from-slate-500 to-slate-700 ${
                      person.avatar ? "hidden" : ""
                    } ${
                      isSelected
                        ? "border-white shadow-[0_0_30px_rgba(255,255,255,0.8)]"
                        : hasActiveEvent
                        ? "border-white/70 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        : "border-white/30"
                    }`}
                  >
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Event Indicators */}
                  {personEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer transform hover:scale-110 transition-transform border border-white/20"
                      style={{
                        backgroundColor: getEventColor(event.event_type),
                        transform: `rotate(${
                          index * 45
                        }deg) translateY(-20px) rotate(-${index * 45}deg)`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent({
                          id: event.id,
                          personId: event.user_id,
                          timestamp: event.timestamp,
                          type: event.event_type as Event["type"],
                          content: event.content,
                          location: event.location_address,
                          connections: realConnections
                            .filter(
                              (conn) =>
                                conn.from_event_id === event.id ||
                                conn.to_event_id === event.id
                            )
                            .map((conn) =>
                              conn.from_event_id === event.id
                                ? conn.to_event_id
                                : conn.from_event_id
                            ),
                          metadata: {
                            mood: event.mood,
                            visibility:
                              event.visibility === "public" ||
                              event.visibility === "private" ||
                              event.visibility === "friends"
                                ? event.visibility
                                : undefined,
                            reactions: Array.isArray(event.reactions)
                              ? event.reactions.length
                              : typeof event.reactions === "number"
                              ? event.reactions
                              : undefined,
                          },
                        });
                      }}
                      title={event.content}
                    >
                      {getEventIcon(event.event_type)}
                    </div>
                  ))}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {person.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Stitching */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Layers className="w-5 h-5 text-white/60" />
            <h3 className="text-lg text-white">Timeline Stitching</h3>
          </div>
          <button
            onClick={generateCustomStory}
            disabled={isLoading || customStoryline.length === 0}
            className={`flex items-center space-x-2 px-4 py-2 text-white border rounded-lg transition-colors ${
              isLoading || customStoryline.length === 0
                ? "bg-white/5 border-white/10 text-white/60 cursor-not-allowed"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Create Story</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {realUsers.slice(0, 6).map((user) => (
            <button
              key={user.id}
              onClick={() => {
                if (customStoryline.includes(user.id)) {
                  setCustomStoryline((prev) =>
                    prev.filter((id) => id !== user.id)
                  );
                } else {
                  setCustomStoryline((prev) => [...prev, user.id]);
                }
              }}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                customStoryline.includes(user.id)
                  ? "bg-white/10 border border-white/20 shadow-lg"
                  : "bg-white/5 border border-white/10 hover:bg-white/10"
              }`}
            >
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.display_name || user.full_name}
                  className={`w-8 h-8 rounded-full ${
                    customStoryline.includes(user.id) ? "" : "grayscale"
                  }`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.nextElementSibling?.classList.remove("hidden");
                  }}
                />
              ) : null}
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white font-semibold text-sm ${
                  user.avatar_url ? "hidden" : ""
                } ${customStoryline.includes(user.id) ? "" : "grayscale"}`}
              >
                {(user.display_name || user.full_name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <span className="text-white">
                {user.display_name || user.full_name || `User ${user.id}`}
              </span>
              {customStoryline.includes(user.id) && (
                <span className="text-green-400 text-sm">✓</span>
              )}
            </button>
          ))}
        </div>

        {customStoryline.length === 0 && (
          <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/20">
            <p className="text-blue-300 text-sm">
              💡 <strong>Tip:</strong> Select one or more people above to enable
              story generation!
            </p>
          </div>
        )}

        {customStoryline.length > 0 && (
          <div className="mt-4 p-4 bg-black/20 rounded-lg border border-white/10">
            <h4 className="text-white mb-2">Your Custom Storyline</h4>
            <p className="text-white/70 text-sm">
              Following perspectives from:{" "}
              {customStoryline
                .map((id) => {
                  const user = realUsers.find((u) => u.id === id);
                  return user?.display_name || user?.full_name || `User ${id}`;
                })
                .join(", ")}
            </p>
          </div>
        )}
      </div>
      {showGhostThreads &&
        realGhostThreads.map((thread) => {
          const participants = thread.participant_ids
            .map((id) => realUsers.find((u) => u.id === id))
            .filter(Boolean);

          if (participants.length < 2) return null;

          return (
            <div
              key={thread.id}
              className="bg-black/20 rounded-lg p-4 border border-white/10 mb-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {participants.slice(0, 2).map((user, index) =>
                    user ? (
                      <React.Fragment key={user.id}>
                        <img
                          src={
                            user.avatar_url ||
                            `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop`
                          }
                          alt={user.display_name || user.full_name}
                          className="w-8 h-8 rounded-full grayscale"
                        />
                        {index === 0 && (
                          <span className="text-white/60">↔</span>
                        )}
                      </React.Fragment>
                    ) : null
                  )}
                </div>
                <div className="text-white/60">
                  Serendipity: {Math.round(thread.serendipity_score)}%
                </div>
              </div>

              <div className="space-y-2">
                {thread.intersections.map(
                  (intersection: any, index: number) => (
                    <div key={index} className="text-white/70 text-sm">
                      <span className="text-white/50">
                        {formatTime(intersection.timestamp)}
                      </span>{" "}
                      - {intersection.description}
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}

      {/* Event Details Panel */}
      {selectedEvent && (
        <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm border border-white/20"
                style={{ backgroundColor: getEventColor(selectedEvent.type) }}
              >
                {getEventIcon(selectedEvent.type)}
              </div>
              <div>
                <h3 className="text-white font-medium">
                  {realUsers.find((p) => p.id === selectedEvent.personId)
                    ?.display_name ||
                    realUsers.find((p) => p.id === selectedEvent.personId)
                      ?.full_name ||
                    `User ${selectedEvent.personId}`}
                </h3>
                <p className="text-white/60 text-sm">
                  {formatTime(selectedEvent.timestamp)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-white/80 text-sm mb-2">Event</h4>
              <p className="text-white">{selectedEvent.content}</p>
            </div>

            {selectedEvent.metadata && (
              <div className="grid grid-cols-2 gap-4">
                {selectedEvent.metadata.mood && (
                  <div>
                    <h4 className="text-white/80 text-sm mb-1">Mood</h4>
                    <span className="px-2 py-1 bg-white/5 rounded text-white/70 text-sm">
                      {selectedEvent.metadata.mood}
                    </span>
                  </div>
                )}
                {selectedEvent.metadata.visibility && (
                  <div>
                    <h4 className="text-white/80 text-sm mb-1">Visibility</h4>
                    <span className="px-2 py-1 bg-white/5 rounded text-white/70 text-sm">
                      {selectedEvent.metadata.visibility}
                    </span>
                  </div>
                )}
              </div>
            )}

            {selectedEvent.location && (
              <div className="flex items-center space-x-2 text-white/60">
                <MapPin className="w-4 h-4" />
                <span>{selectedEvent.location}</span>
              </div>
            )}

            {selectedEvent.connections.length > 0 && (
              <div>
                <h4 className="text-white/80 text-sm mb-2">Connected Events</h4>
                <div className="space-y-2">
                  {selectedEvent.connections.map((connId) => {
                    const connectedEvent = realEvents.find(
                      (e) => e.id === connId
                    );
                    const connectedPerson = connectedEvent
                      ? realUsers.find((p) => p.id === connectedEvent.user_id)
                      : null;

                    if (!connectedEvent || !connectedPerson) return null;

                    return (
                      <div
                        key={connId}
                        className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() =>
                          setSelectedEvent({
                            id: connectedEvent.id,
                            personId: connectedEvent.user_id,
                            timestamp: connectedEvent.timestamp,
                            type: connectedEvent.event_type as Event["type"],
                            content: connectedEvent.content,
                            location: connectedEvent.location_address,
                            connections: realConnections
                              .filter(
                                (conn) =>
                                  conn.from_event_id === connectedEvent.id ||
                                  conn.to_event_id === connectedEvent.id
                              )
                              .map((conn) =>
                                conn.from_event_id === connectedEvent.id
                                  ? conn.to_event_id
                                  : conn.from_event_id
                              ),
                            metadata: {
                              mood: connectedEvent.mood,
                              visibility:
                                connectedEvent.visibility === "public" ||
                                connectedEvent.visibility === "private" ||
                                connectedEvent.visibility === "friends"
                                  ? connectedEvent.visibility
                                  : undefined,
                              reactions: Array.isArray(connectedEvent.reactions)
                                ? connectedEvent.reactions.length
                                : typeof connectedEvent.reactions === "number"
                                ? connectedEvent.reactions
                                : undefined,
                            },
                          })
                        }
                      >
                        <img
                          src={connectedPerson.avatar_url}
                          alt={
                            connectedPerson.display_name ||
                            connectedPerson.full_name ||
                            `User ${connectedPerson.id}`
                          }
                          className="w-8 h-8 rounded-full grayscale"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-white text-sm">
                              {connectedPerson.display_name ||
                                connectedPerson.full_name ||
                                `User ${connectedPerson.id}`}
                            </span>
                            <span className="text-white/60 text-xs">
                              {formatTime(connectedEvent.timestamp)}
                            </span>
                          </div>
                          <p className="text-white/70 text-sm">
                            {connectedEvent.content}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5">
        <h3 className="text-white mb-3">Event Types</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { type: "post", label: "Posts", icon: "📱" },
            { type: "call", label: "Calls", icon: "📞" },
            { type: "message", label: "Messages", icon: "💬" },
            { type: "location", label: "Location", icon: "📍" },
            { type: "story", label: "Stories", icon: "📖" },
            { type: "like", label: "Likes", icon: "❤️" },
            { type: "view", label: "Views", icon: "👁️" },
          ].map(({ type, label, icon }) => (
            <div key={type} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-xs border border-white/20"
                style={{ backgroundColor: getEventColor(type) }}
              >
                {icon}
              </div>
              <span className="text-white/70 text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Story Preview Modal */}
      {showStoryPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/90 backdrop-blur-xl rounded-lg p-6 border border-white/10 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6 text-white/60" />
                <h2 className="text-xl text-white">Generated Story</h2>
              </div>
              <button
                onClick={() => {
                  setShowStoryPreview(false);
                  setGeneratedStory("");
                }}
                className="text-white/60 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="bg-gradient-to-br from-black/30 to-black/10 rounded-lg p-8 border border-white/10 shadow-2xl">
              <div className="relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-slate-400 to-slate-500 rounded-full"></div>
                <div
                  className="text-white/90 leading-relaxed text-base font-light pl-6"
                  dangerouslySetInnerHTML={{
                    __html: generatedStory
                      .replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="text-white font-semibold">$1</strong>'
                      )
                      .replace(
                        /\*(.*?)\*/g,
                        '<em class="text-blue-300 italic">$1</em>'
                      )
                      .replace(/\n\n/g, '</p><p class="mb-4">')
                      .replace(/^/, '<p class="mb-4">')
                      .replace(/$/, "</p>")
                      .replace(/\n/g, "<br/>"),
                  }}
                />
              </div>
            </div>

            {/* Story Stats */}
            <div className="flex items-center justify-between mt-4 p-4 bg-black/20 rounded-lg border border-white/10">
              <div className="flex items-center space-x-6 text-sm text-white/60">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Words: {generatedStory.split(" ").length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>Characters: {generatedStory.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                  <span>
                    Reading time: ~
                    {Math.ceil(generatedStory.split(" ").length / 200)} min
                  </span>
                </div>
              </div>
              <div className="text-xs text-white/40">
                Generated by DeepSeek AI
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedStory);
                  setError("Story copied to clipboard!");
                  setTimeout(() => setError(null), 2000);
                }}
                className="px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
              >
                Copy Story
              </button>
              <button
                onClick={() => {
                  setShowStoryPreview(false);
                  setGeneratedStory("");
                }}
                className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
