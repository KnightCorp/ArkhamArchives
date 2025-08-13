export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  preferences: {
    privacy: "public" | "friends" | "private";
    showLocation: boolean;
    showActivity: boolean;
  };
  relationships: {
    friends: string[];
    following: string[];
    followers: string[];
    blocked: string[];
  };
  metadata: {
    joinDate: string;
    lastActive: string;
    timezone: string;
    interests: string[];
  };
}

export interface SocialEvent {
  id: string;
  userId: string;
  type:
    | "post"
    | "comment"
    | "like"
    | "share"
    | "message"
    | "story"
    | "location"
    | "call"
    | "video_call"
    | "photo_tag"
    | "check_in"
    | "reaction";
  content: string;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
    venue?: string;
  };
  media?: {
    type: "image" | "video" | "audio" | "document";
    url: string;
    thumbnail?: string;
    duration?: number;
  }[];
  mentions?: string[]; // User IDs mentioned
  tags?: string[];
  parentId?: string; // For comments, replies, etc.
  targetId?: string; // For likes, shares, etc.
  visibility: "public" | "friends" | "private" | "custom";
  metadata: {
    mood?: string;
    activity?: string;
    device?: string;
    appVersion?: string;
    reactions?: { [emoji: string]: string[] }; // emoji -> user IDs
    editHistory?: { timestamp: string; content: string }[];
  };
  connections: string[]; // Connected event IDs
  embedding?: number[]; // For semantic similarity
}

export interface EventConnection {
  id: string;
  fromEventId: string;
  toEventId: string;
  type:
    | "temporal"
    | "relational"
    | "location"
    | "media"
    | "semantic"
    | "causal";
  strength: number; // 0-1
  metadata: {
    timeDelta?: number; // milliseconds
    distance?: number; // meters
    commonUsers?: string[];
    semanticSimilarity?: number;
    confidence: number;
  };
}

export interface Timeline {
  userId: string;
  events: SocialEvent[];
  connections: EventConnection[];
  insights: {
    activityPeaks: { timestamp: string; count: number }[];
    topLocations: { location: string; count: number }[];
    frequentInteractions: { userId: string; count: number }[];
    moodPatterns: { mood: string; timestamps: string[] }[];
    socialCircles: {
      id: string;
      name: string;
      members: string[];
      commonInterests: string[];
    }[];
  };
}

export interface StoryNode {
  id: string;
  events: SocialEvent[];
  narrative: string;
  timestamp: string;
  participants: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  mood: string;
  significance: number; // 0-1
  connections: string[]; // Other story node IDs
}

export interface SocialGraph {
  users: { [id: string]: User };
  events: { [id: string]: SocialEvent };
  connections: { [id: string]: EventConnection };
  timelines: { [userId: string]: Timeline };
  stories: { [id: string]: StoryNode };
  metadata: {
    lastUpdated: string;
    totalEvents: number;
    totalConnections: number;
    dateRange: {
      start: string;
      end: string;
    };
  };
}

export interface POVFilter {
  userId: string;
  includeConnections: boolean;
  maxDegrees: number; // How many connection degrees to include
  eventTypes?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  locationRadius?: {
    center: { lat: number; lng: number };
    radius: number; // meters
  };
}

export interface Insight {
  id: string;
  type: "pattern" | "anomaly" | "trend" | "correlation" | "prediction";
  title: string;
  description: string;
  confidence: number;
  data: any;
  timestamp: string;
  affectedUsers: string[];
  visualization?: {
    type: "chart" | "map" | "graph" | "heatmap";
    config: any;
  };
}

// Graph algorithms interfaces
export interface GraphMetrics {
  centrality: { [userId: string]: number };
  clustering: { [userId: string]: number };
  communityDetection: {
    communities: { [communityId: string]: string[] };
    modularity: number;
  };
  pathAnalysis: {
    shortestPaths: { [userPair: string]: string[] };
    influencePaths: { [userId: string]: string[] };
  };
}

export interface VisualizationConfig {
  layout: "force" | "circular" | "hierarchical" | "geographic" | "temporal";
  colorScheme: string;
  nodeSize: "fixed" | "degree" | "activity" | "influence";
  edgeWidth: "fixed" | "strength" | "frequency";
  clustering: boolean;
  showLabels: boolean;
  showTimeline: boolean;
  showHeatmap: boolean;
  filters: {
    timeRange: { start: string; end: string };
    eventTypes: string[];
    users: string[];
    minConnection: number;
  };
}
