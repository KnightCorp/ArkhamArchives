import { supabase } from "../../../lib/supabaseClient";

// Types for database entities
export interface SocialEvent {
  id: string;
  user_id: string;
  event_type: string;
  content: string;
  timestamp: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  location_venue?: string;
  media?: any[];
  mentions?: string[];
  tags?: string[];
  parent_id?: string;
  target_id?: string;
  visibility: "public" | "friends" | "private" | "custom";
  mood?: string;
  activity?: string;
  device?: string;
  app_version?: string;
  reactions?: { [key: string]: string[] };
  impressions_count: number;
  reach_count: number;
  embedding?: number[];
  sentiment_score?: number;
  edit_history?: any[];
  created_at: string;
  updated_at: string;
}

export interface EventConnection {
  id: string;
  from_event_id: string;
  to_event_id: string;
  connection_type:
    | "temporal"
    | "relational"
    | "location"
    | "media"
    | "semantic"
    | "causal";
  strength: number;
  time_delta_ms?: number;
  distance_meters?: number;
  common_users?: string[];
  semantic_similarity?: number;
  confidence: number;
  created_at: string;
}

export interface GhostThread {
  id: string;
  participant_ids: string[];
  serendipity_score: number;
  intersections: any[];
  discovery_timestamp: string;
  last_intersection?: string;
  is_active: boolean;
  significance_level: "low" | "medium" | "high" | "extraordinary";
  created_at: string;
  updated_at: string;
}

export interface TimeLockRoom {
  id: string;
  name: string;
  description?: string;
  start_time: string;
  end_time: string;
  location_lat?: number;
  location_lng?: number;
  location_address: string;
  location_venue?: string;
  room_type:
    | "party"
    | "meeting"
    | "event"
    | "gathering"
    | "conference"
    | "celebration";
  max_participants: number;
  is_private: boolean;
  entry_code?: string;
  creator_id: string;
  participant_ids: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoryNode {
  id: string;
  title: string;
  narrative: string;
  event_ids: string[];
  participant_ids: string[];
  story_timestamp: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  mood?: string;
  significance_score?: number;
  narrative_style: string;
  ai_model?: string;
  generation_prompt?: string;
  generation_timestamp: string;
  human_edited: boolean;
  connected_story_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface UserTimeline {
  id: string;
  user_id: string;
  pov_filter: any;
  activity_peaks: any[];
  top_locations: any[];
  frequent_interactions: any[];
  mood_patterns: any[];
  social_circles: any[];
  total_events: number;
  total_connections: number;
  date_range_start?: string;
  date_range_end?: string;
  last_computed: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  display_name?: string;
  avatar_url?: string;
  full_name?: string;
  timeline_position_x: number;
  timeline_position_y: number;
  mood_status?: string;
  activity_status?: string;
  social_influence_score: number;
  serendipity_score: number;
  privacy_settings: any;
  interests?: string[];
  current_location?: any;
  timezone: string;
}

// Social Events Queries
export const socialEventQueries = {
  // Get all events with optional filters
  async getAllEvents(filters?: {
    userId?: string;
    eventTypes?: string[];
    dateRange?: { start: string; end: string };
    visibility?: string[];
    limit?: number;
  }) {
    let query = supabase
      .from("social_events")
      .select("*")
      .order("timestamp", { ascending: false });

    if (filters?.userId) {
      query = query.eq("user_id", filters.userId);
    }

    if (filters?.eventTypes && filters.eventTypes.length > 0) {
      query = query.in("event_type", filters.eventTypes);
    }

    if (filters?.dateRange) {
      query = query
        .gte("timestamp", filters.dateRange.start)
        .lte("timestamp", filters.dateRange.end);
    }

    if (filters?.visibility && filters.visibility.length > 0) {
      query = query.in("visibility", filters.visibility);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data: events, error } = await query;
    if (error) throw error;
    const userIds = [...new Set(events.map((event) => event.user_id))];

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, full_name")
      .in("id", userIds);

    if (profileError) throw profileError;

    // Merge the data
    const eventsWithProfiles = events.map((event) => ({
      ...event,
      profiles: profiles.find((profile) => profile.id === event.user_id),
    }));

    return eventsWithProfiles;
    // return data as (SocialEvent & { profiles: User })[];
  },

  // Create a new social event
  async createEvent(event: Partial<SocialEvent>) {
    const { data, error } = await supabase
      .from("social_events")
      .insert([event])
      .select()
      .single();

    if (error) throw error;
    return data as SocialEvent;
  },

  // Get events by location proximity
  async getEventsByLocation(lat: number, lng: number, radiusKm: number = 1) {
    const { data, error } = await supabase.rpc("get_events_near_location", {
      input_lat: lat,
      input_lng: lng,
      radius_km: radiusKm,
    });

    if (error) throw error;
    return data as SocialEvent[];
  },

  // Get events with their connections
  async getEventsWithConnections(eventIds: string[]) {
    const { data: events, error: eventsError } = await supabase
      .from("social_events")
      .select("*")
      .in("id", eventIds);

    if (eventsError) throw eventsError;

    // Get profiles
    const userIds = [...new Set(events.map((event) => event.user_id))];
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, full_name")
      .in("id", userIds);

    if (profileError) throw profileError;

    // Get connections
    const { data: fromConnections, error: fromError } = await supabase
      .from("event_connections")
      .select("*")
      .in("from_event_id", eventIds);

    const { data: toConnections, error: toError } = await supabase
      .from("event_connections")
      .select("*")
      .in("to_event_id", eventIds);

    if (fromError) throw fromError;
    if (toError) throw toError;

    // Merge data
    const eventsWithData = events.map((event) => ({
      ...event,
      profiles: profiles.find((profile) => profile.id === event.user_id),
      from_connections: fromConnections.filter(
        (conn) => conn.from_event_id === event.id
      ),
      to_connections: toConnections.filter(
        (conn) => conn.to_event_id === event.id
      ),
    }));

    return eventsWithData;
  },

  // Update event
  async updateEvent(eventId: string, updates: Partial<SocialEvent>) {
    const { data, error } = await supabase
      .from("social_events")
      .update(updates)
      .eq("id", eventId)
      .select()
      .single();

    if (error) throw error;
    return data as SocialEvent;
  },

  // Delete event
  async deleteEvent(eventId: string) {
    const { error } = await supabase
      .from("social_events")
      .delete()
      .eq("id", eventId);

    if (error) throw error;
  },
};

// Event Connections Queries
export const eventConnectionQueries = {
  // Get all connections for specific events
  async getConnectionsByEvents(eventIds: string[]) {
    const { data, error } = await supabase
      .from("event_connections")
      .select("*")
      .or(
        `from_event_id.in.(${eventIds.join(
          ","
        )}),to_event_id.in.(${eventIds.join(",")})`
      );

    if (error) throw error;
    return data as EventConnection[];
  },

  // Create connection
  async createConnection(connection: Partial<EventConnection>) {
    const { data, error } = await supabase
      .from("event_connections")
      .insert([connection])
      .select()
      .single();

    if (error) throw error;
    return data as EventConnection;
  },

  // Get connections by type
  async getConnectionsByType(connectionType: string) {
    const { data, error } = await supabase
      .from("event_connections")
      .select("*")
      .eq("connection_type", connectionType)
      .order("strength", { ascending: false });

    if (error) throw error;
    return data as EventConnection[];
  },

  // Get strongest connections
  async getStrongestConnections(limit: number = 50) {
    const { data: connections, error: connError } = await supabase
      .from("event_connections")
      .select("*")
      .order("strength", { ascending: false })
      .limit(limit);

    if (connError) throw connError;

    // Get event IDs
    const eventIds = [
      ...new Set([
        ...connections.map((conn) => conn.from_event_id),
        ...connections.map((conn) => conn.to_event_id),
      ]),
    ];

    // Get events
    const { data: events, error: eventsError } = await supabase
      .from("social_events")
      .select("id, content, user_id, timestamp")
      .in("id", eventIds);

    if (eventsError) throw eventsError;

    // Get user profiles
    const userIds = [...new Set(events.map((event) => event.user_id))];
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", userIds);

    if (profileError) throw profileError;

    // Merge data
    const enrichedConnections = connections.map((connection) => ({
      ...connection,
      from_event: {
        ...events.find((e) => e.id === connection.from_event_id),
        profiles: profiles.find(
          (p) =>
            p.id ===
            events.find((e) => e.id === connection.from_event_id)?.user_id
        ),
      },
      to_event: {
        ...events.find((e) => e.id === connection.to_event_id),
        profiles: profiles.find(
          (p) =>
            p.id ===
            events.find((e) => e.id === connection.to_event_id)?.user_id
        ),
      },
    }));

    return enrichedConnections;
  },
};

// Ghost Threads Queries
export const ghostThreadQueries = {
  // Get all active ghost threads
  async getActiveGhostThreads() {
    const { data, error } = await supabase
      .from("ghost_threads")
      .select("*")
      .eq("is_active", true)
      .order("serendipity_score", { ascending: false });

    if (error) throw error;
    return data as GhostThread[];
  },

  // Get ghost threads for specific users
  async getGhostThreadsByUsers(userIds: string[]) {
    const { data, error } = await supabase
      .from("ghost_threads")
      .select("*")
      .overlaps("participant_ids", userIds)
      .eq("is_active", true);

    if (error) throw error;
    return data as GhostThread[];
  },

  // Create ghost thread
  async createGhostThread(thread: Partial<GhostThread>) {
    const { data, error } = await supabase
      .from("ghost_threads")
      .insert([thread])
      .select()
      .single();

    if (error) throw error;
    return data as GhostThread;
  },

  // Update ghost thread
  async updateGhostThread(threadId: string, updates: Partial<GhostThread>) {
    const { data, error } = await supabase
      .from("ghost_threads")
      .update(updates)
      .eq("id", threadId)
      .select()
      .single();

    if (error) throw error;
    return data as GhostThread;
  },

  // Get enriched ghost threads with participant info
  async getEnrichedGhostThreads() {
    const { data, error } = await supabase
      .from("enriched_ghost_threads")
      .select("*");

    if (error) throw error;
    return data;
  },
};

// Time Lock Rooms Queries
export const timeLockRoomQueries = {
  // Get all active rooms
  async getActiveRooms() {
    const { data, error } = await supabase
      .from("active_time_lock_rooms")
      .select("*");

    if (error) throw error;
    return data;
  },

  // Get rooms by location
  async getRoomsByLocation(lat: number, lng: number, radiusKm: number = 5) {
    const { data, error } = await supabase.rpc("get_rooms_near_location", {
      input_lat: lat,
      input_lng: lng,
      radius_km: radiusKm,
    });

    if (error) throw error;
    return data as TimeLockRoom[];
  },

  // Create room
  async createRoom(room: Partial<TimeLockRoom>) {
    const { data, error } = await supabase
      .from("time_lock_rooms")
      .insert([room])
      .select()
      .single();

    if (error) throw error;
    return data as TimeLockRoom;
  },

  // Join room
  async joinRoom(roomId: string, userId: string) {
    // First get current participants
    const { data: room, error: fetchError } = await supabase
      .from("time_lock_rooms")
      .select("participant_ids")
      .eq("id", roomId)
      .single();

    if (fetchError) throw fetchError;

    const updatedParticipants = [...(room.participant_ids || []), userId];

    const { data, error } = await supabase
      .from("time_lock_rooms")
      .update({ participant_ids: updatedParticipants })
      .eq("id", roomId)
      .select()
      .single();

    if (error) throw error;
    return data as TimeLockRoom;
  },

  // Leave room
  async leaveRoom(roomId: string, userId: string) {
    const { data: room, error: fetchError } = await supabase
      .from("time_lock_rooms")
      .select("participant_ids")
      .eq("id", roomId)
      .single();

    if (fetchError) throw fetchError;

    const updatedParticipants = (room.participant_ids || []).filter(
      (id: string) => id !== userId
    );

    const { data, error } = await supabase
      .from("time_lock_rooms")
      .update({ participant_ids: updatedParticipants })
      .eq("id", roomId)
      .select()
      .single();

    if (error) throw error;
    return data as TimeLockRoom;
  },

  // Update room
  async updateRoom(roomId: string, updates: Partial<TimeLockRoom>) {
    const { data, error } = await supabase
      .from("time_lock_rooms")
      .update(updates)
      .eq("id", roomId)
      .select()
      .single();

    if (error) throw error;
    return data as TimeLockRoom;
  },
};

// Story Nodes Queries
export const storyNodeQueries = {
  // Get all stories
  async getAllStories(filters?: {
    participantIds?: string[];
    dateRange?: { start: string; end: string };
    minSignificance?: number;
  }) {
    let query = supabase
      .from("story_nodes")
      .select("*")
      .order("story_timestamp", { ascending: false });

    if (filters?.participantIds && filters.participantIds.length > 0) {
      query = query.overlaps("participant_ids", filters.participantIds);
    }

    if (filters?.dateRange) {
      query = query
        .gte("story_timestamp", filters.dateRange.start)
        .lte("story_timestamp", filters.dateRange.end);
    }

    if (filters?.minSignificance) {
      query = query.gte("significance_score", filters.minSignificance);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as StoryNode[];
  },

  // Create story
  async createStory(story: Partial<StoryNode>) {
    const { data, error } = await supabase
      .from("story_nodes")
      .insert([story])
      .select()
      .single();

    if (error) throw error;
    return data as StoryNode;
  },

  // Get stories by events
  async getStoriesByEvents(eventIds: string[]) {
    const { data, error } = await supabase
      .from("story_nodes")
      .select("*")
      .overlaps("event_ids", eventIds);

    if (error) throw error;
    return data as StoryNode[];
  },

  // Update story
  async updateStory(storyId: string, updates: Partial<StoryNode>) {
    const { data, error } = await supabase
      .from("story_nodes")
      .update(updates)
      .eq("id", storyId)
      .select()
      .single();

    if (error) throw error;
    return data as StoryNode;
  },
};

// User Timeline Queries
export const userTimelineQueries = {
  // Get user timeline
  async getUserTimeline(userId: string) {
    const { data, error } = await supabase
      .from("user_timelines")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data as UserTimeline;
  },

  // Update user timeline
  async updateUserTimeline(userId: string, updates: Partial<UserTimeline>) {
    const { data, error } = await supabase
      .from("user_timelines")
      .upsert({ user_id: userId, ...updates })
      .select()
      .single();

    if (error) throw error;
    return data as UserTimeline;
  },

  // Get user timeline with events and connections
  async getEnrichedUserTimeline(
    userId: string,
    filters?: {
      eventTypes?: string[];
      dateRange?: { start: string; end: string };
      includeConnections?: boolean;
    }
  ) {
    // Get timeline
    const timeline = await this.getUserTimeline(userId);

    // Get user's events
    const events = await socialEventQueries.getAllEvents({
      userId,
      eventTypes: filters?.eventTypes,
      dateRange: filters?.dateRange,
    });

    let connections: EventConnection[] = [];
    if (filters?.includeConnections && events.length > 0) {
      const eventIds = events.map((e) => e.id);
      connections = await eventConnectionQueries.getConnectionsByEvents(
        eventIds
      );
    }

    return {
      timeline,
      events,
      connections,
    };
  },
};

// User Profile Queries
export const userProfileQueries = {
  // Get all users with multiverse data
  async getAllUsers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("display_name");

    if (error) throw error;
    return data as User[];
  },

  // Get user by ID
  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data as User;
  },

  // Update user multiverse data
  async updateUserMultiverseData(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  // Get users by location proximity
  async getUsersByLocation(lat: number, lng: number, radiusKm: number = 10) {
    const { data, error } = await supabase.rpc("get_users_near_location", {
      input_lat: lat,
      input_lng: lng,
      radius_km: radiusKm,
    });

    if (error) throw error;
    return data as User[];
  },
};

// Analytics Queries
export const analyticsQueries = {
  // Get activity analytics for date range
  async getActivityAnalytics(dateRange: { start: string; end: string }) {
    const { data, error } = await supabase.rpc("get_activity_analytics", {
      start_date: dateRange.start,
      end_date: dateRange.end,
    });

    if (error) throw error;
    return data;
  },

  // Get connection analytics
  async getConnectionAnalytics() {
    const { data, error } = await supabase.rpc("get_connection_analytics");

    if (error) throw error;
    return data;
  },

  // Get user influence scores
  async getUserInfluenceScores() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, social_influence_score, serendipity_score")
      .order("social_influence_score", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get mood patterns
  async getMoodPatterns(userId?: string) {
    let query = supabase
      .from("social_events")
      .select("mood, timestamp, user_id")
      .not("mood", "is", null);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query.order("timestamp");

    if (error) throw error;
    return data;
  },
};

// Real-time subscriptions
export const realtimeSubscriptions = {
  // Subscribe to new events
  subscribeToEvents(callback: (payload: any) => void) {
    return supabase
      .channel("social_events")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "social_events",
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to new connections
  subscribeToConnections(callback: (payload: any) => void) {
    return supabase
      .channel("event_connections")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "event_connections",
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to ghost threads
  subscribeToGhostThreads(callback: (payload: any) => void) {
    return supabase
      .channel("ghost_threads")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ghost_threads",
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to time lock rooms
  subscribeToTimeLockRooms(callback: (payload: any) => void) {
    return supabase
      .channel("time_lock_rooms")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "time_lock_rooms",
        },
        callback
      )
      .subscribe();
  },
};

// Utility functions
export const utilityQueries = {
  // Search across all content
  async searchContent(
    query: string,
    filters?: {
      eventTypes?: string[];
      userIds?: string[];
      dateRange?: { start: string; end: string };
    }
  ) {
    let searchQuery = supabase
      .from("social_events")
      .select("*")
      .textSearch("content", query)
      .order("timestamp", { ascending: false });

    if (filters?.eventTypes && filters.eventTypes.length > 0) {
      searchQuery = searchQuery.in("event_type", filters.eventTypes);
    }

    if (filters?.userIds && filters.userIds.length > 0) {
      searchQuery = searchQuery.in("user_id", filters.userIds);
    }

    if (filters?.dateRange) {
      searchQuery = searchQuery
        .gte("timestamp", filters.dateRange.start)
        .lte("timestamp", filters.dateRange.end);
    }

    const { data: events, error } = await searchQuery.limit(100);
    if (error) throw error;

    // Get profiles separately
    const userIds = [...new Set(events.map((event) => event.user_id))];
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", userIds);

    if (profileError) throw profileError;

    // Merge data
    const eventsWithProfiles = events.map((event) => ({
      ...event,
      profiles: profiles.find((profile) => profile.id === event.user_id),
    }));

    return eventsWithProfiles;
  },

  // Get trending topics
  async getTrendingTopics(dateRange: { start: string; end: string }) {
    const { data, error } = await supabase.rpc("get_trending_topics", {
      start_date: dateRange.start,
      end_date: dateRange.end,
    });

    if (error) throw error;
    return data;
  },

  // Get serendipity opportunities
  async getSerendipityOpportunities(userId: string) {
    const { data, error } = await supabase.rpc(
      "get_serendipity_opportunities",
      {
        user_id: userId,
      }
    );

    if (error) throw error;
    return data;
  },
};

// Export all query collections
export default {
  socialEvents: socialEventQueries,
  eventConnections: eventConnectionQueries,
  ghostThreads: ghostThreadQueries,
  timeLockRooms: timeLockRoomQueries,
  storyNodes: storyNodeQueries,
  userTimelines: userTimelineQueries,
  userProfiles: userProfileQueries,
  analytics: analyticsQueries,
  realtime: realtimeSubscriptions,
  utils: utilityQueries,
};
