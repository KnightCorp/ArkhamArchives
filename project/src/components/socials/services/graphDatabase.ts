import {
  SocialGraph,
  User,
  SocialEvent,
  EventConnection,
  Timeline,
  StoryNode,
  POVFilter,
  Insight,
  GraphMetrics,
} from "../types/socialGraph";
import multiverseQueries from "../lib/multiverseQueries";
import {
  SocialEvent as DBSocialEvent,
  EventConnection as DBEventConnection,
  User as DBUser,
} from "../lib/multiverseQueries";

export class GraphDatabaseService {
  private graph: SocialGraph;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.graph = {
      users: {},
      events: {},
      connections: {},
      timelines: {},
      stories: {},
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalEvents: 0,
        totalConnections: 0,
        dateRange: {
          start: "",
          end: "",
        },
      },
    };
    this.initializeFromDatabase();
  }

  // Initialize data from database
  private async initializeFromDatabase(): Promise<void> {
    try {
      // Load users
      const dbUsers = await multiverseQueries.userProfiles.getAllUsers();
      dbUsers.forEach((user) => this.addUserFromDB(user));

      // Load events
      const dbEvents = await multiverseQueries.socialEvents.getAllEvents();
      dbEvents.forEach((event) => this.addEventFromDB(event));

      // Load connections
      const eventIds = Object.keys(this.graph.events);
      if (eventIds.length > 0) {
        const dbConnections =
          await multiverseQueries.eventConnections.getConnectionsByEvents(
            eventIds
          );
        dbConnections.forEach((connection) =>
          this.addConnectionFromDB(connection)
        );
      }

      this.updateMetadata();
      this.emit("databaseInitialized", this.graph);
    } catch (error) {
      console.error("Failed to initialize from database:", error);
      this.emit("databaseError", error);
    }
  }

  // Convert database user to internal format
  private convertDBUserToInternal(dbUser: DBUser): User {
    return {
      id: dbUser.id,
      name: dbUser.display_name || dbUser.full_name || `User ${dbUser.id}`,
      avatar:
        dbUser.avatar_url ||
        `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop`,
      email: `${dbUser.id}@example.com`, // Not available in DB schema
      location: dbUser.current_location
        ? {
            lat: dbUser.current_location.lat,
            lng: dbUser.current_location.lng,
            address: dbUser.current_location.address || "Unknown",
          }
        : undefined,
      preferences: {
        privacy: dbUser.privacy_settings?.privacy || "public",
        showLocation: dbUser.privacy_settings?.showLocation !== false,
        showActivity: dbUser.privacy_settings?.showActivity !== false,
      },
      relationships: {
        friends: [], // Would need separate friends table
        following: [],
        followers: [],
        blocked: [],
      },
      metadata: {
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        timezone: dbUser.timezone || "UTC",
        interests: dbUser.interests || [],
      },
    };
  }

  // Convert database event to internal format
  private convertDBEventToInternal(dbEvent: DBSocialEvent): SocialEvent {
    return {
      id: dbEvent.id,
      userId: dbEvent.user_id,
      type: this.mapEventType(dbEvent.event_type),
      content: dbEvent.content,
      timestamp: dbEvent.timestamp,
      location:
        dbEvent.location_lat && dbEvent.location_lng
          ? {
              lat: dbEvent.location_lat,
              lng: dbEvent.location_lng,
              address: dbEvent.location_address || "Unknown",
              venue: dbEvent.location_venue,
            }
          : undefined,
      media: dbEvent.media || [],
      mentions: dbEvent.mentions || [],
      tags: dbEvent.tags || [],
      parentId: dbEvent.parent_id,
      targetId: dbEvent.target_id,
      visibility: dbEvent.visibility,
      metadata: {
        mood: dbEvent.mood,
        activity: dbEvent.activity,
        device: dbEvent.device,
        appVersion: dbEvent.app_version,
        reactions: dbEvent.reactions || {},
        editHistory: dbEvent.edit_history || [],
      },
      connections: [], // Will be populated when connections are loaded
      embedding: dbEvent.embedding,
    };
  }

  // Map database event types to internal types
  private mapEventType(dbEventType: string): SocialEvent["type"] {
    const typeMap: Record<string, SocialEvent["type"]> = {
      post: "post",
      comment: "comment",
      like: "like",
      share: "share",
      message: "message",
      story: "story",
      location: "location",
      call: "call",
      video_call: "video_call",
      photo_tag: "photo_tag",
      check_in: "location",
      reaction: "reaction",
    };
    return typeMap[dbEventType] || "post";
  }

  // Convert database connection to internal format
  private convertDBConnectionToInternal(
    dbConnection: DBEventConnection
  ): EventConnection {
    return {
      id: dbConnection.id,
      fromEventId: dbConnection.from_event_id,
      toEventId: dbConnection.to_event_id,
      type: this.mapConnectionType(dbConnection.connection_type),
      strength: dbConnection.strength,
      metadata: {
        timeDelta: dbConnection.time_delta_ms,
        distance: dbConnection.distance_meters,
        commonUsers: dbConnection.common_users || [],
        semanticSimilarity: dbConnection.semantic_similarity,
        confidence: dbConnection.confidence,
      },
    };
  }

  // Map database connection types to internal types
  private mapConnectionType(dbConnectionType: string): EventConnection["type"] {
    const typeMap: Record<string, EventConnection["type"]> = {
      temporal: "temporal",
      relational: "relational",
      location: "location",
      media: "media",
      semantic: "semantic",
      causal: "causal",
    };
    return typeMap[dbConnectionType] || "semantic";
  }

  // User Management
  private addUserFromDB(dbUser: DBUser): void {
    const user = this.convertDBUserToInternal(dbUser);
    this.graph.users[user.id] = user;
    this.graph.timelines[user.id] = {
      userId: user.id,
      events: [],
      connections: [],
      insights: {
        activityPeaks: [],
        topLocations: [],
        frequentInteractions: [],
        moodPatterns: [],
        socialCircles: [],
      },
    };
  }

  async addUser(user: User): Promise<void> {
    try {
      // Convert internal user to database format
      const dbUser = {
        id: user.id,
        display_name: user.name,
        full_name: user.name,
        avatar_url: user.avatar,
        current_location: user.location,
        privacy_settings: user.preferences,
        interests: user.metadata.interests,
        timezone: user.metadata.timezone,
      };

      // This would require a create user method in multiverseQueries
      // For now, just add to local graph
      this.graph.users[user.id] = user;
      this.graph.timelines[user.id] = {
        userId: user.id,
        events: [],
        connections: [],
        insights: {
          activityPeaks: [],
          topLocations: [],
          frequentInteractions: [],
          moodPatterns: [],
          socialCircles: [],
        },
      };
      this.updateMetadata();
      this.emit("userAdded", user);
    } catch (error) {
      console.error("Failed to add user:", error);
      throw error;
    }
  }

  getUser(userId: string): User | null {
    return this.graph.users[userId] || null;
  }

  // Event Management
  private addEventFromDB(dbEvent: DBSocialEvent): void {
    const event = this.convertDBEventToInternal(dbEvent);
    this.graph.events[event.id] = event;

    // Add to user's timeline
    if (this.graph.timelines[event.userId]) {
      this.graph.timelines[event.userId].events.push(event);
      this.graph.timelines[event.userId].events.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    }

    this.graph.metadata.totalEvents++;
    this.updateDateRange(event.timestamp);
  }

  async addEvent(event: SocialEvent): Promise<void> {
    try {
      // Convert internal event to database format
      const dbEvent = {
        user_id: event.userId,
        event_type: event.type,
        content: event.content,
        timestamp: event.timestamp,
        location_lat: event.location?.lat,
        location_lng: event.location?.lng,
        location_address: event.location?.address,
        location_venue: event.location?.venue,
        media: event.media,
        mentions: event.mentions,
        tags: event.tags,
        parent_id: event.parentId,
        target_id: event.targetId,
        visibility: event.visibility,
        mood: event.metadata.mood,
        activity: event.metadata.activity,
        device: event.metadata.device,
        app_version: event.metadata.appVersion,
        reactions: event.metadata.reactions,
        edit_history: event.metadata.editHistory,
        embedding: event.embedding,
      };

      const createdEvent = await multiverseQueries.socialEvents.createEvent(
        dbEvent
      );

      // Add to local graph
      const internalEvent = this.convertDBEventToInternal(createdEvent);
      this.graph.events[internalEvent.id] = internalEvent;

      // Add to user's timeline
      if (this.graph.timelines[internalEvent.userId]) {
        this.graph.timelines[internalEvent.userId].events.push(internalEvent);
        this.graph.timelines[internalEvent.userId].events.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      }

      this.graph.metadata.totalEvents++;
      this.updateDateRange(internalEvent.timestamp);
      this.updateMetadata();

      // Auto-generate connections
      await this.autoGenerateConnections(internalEvent);

      this.emit("eventAdded", internalEvent);
    } catch (error) {
      console.error("Failed to add event:", error);
      throw error;
    }
  }

  getEvent(eventId: string): SocialEvent | null {
    return this.graph.events[eventId] || null;
  }

  async getEventsByUser(
    userId: string,
    filters?: Partial<POVFilter>
  ): Promise<SocialEvent[]> {
    try {
      const dbFilters = {
        userId,
        eventTypes: filters?.eventTypes,
        dateRange: filters?.dateRange,
      };

      const dbEvents = await multiverseQueries.socialEvents.getAllEvents(
        dbFilters
      );
      return dbEvents.map((event) => this.convertDBEventToInternal(event));
    } catch (error) {
      console.error("Failed to get events by user:", error);
      // Fallback to local graph
      const timeline = this.graph.timelines[userId];
      if (!timeline) return [];

      let events = timeline.events;

      if (filters) {
        if (filters.eventTypes) {
          events = events.filter((e) => filters.eventTypes!.includes(e.type));
        }

        if (filters.dateRange) {
          const start = new Date(filters.dateRange.start).getTime();
          const end = new Date(filters.dateRange.end).getTime();
          events = events.filter((e) => {
            const eventTime = new Date(e.timestamp).getTime();
            return eventTime >= start && eventTime <= end;
          });
        }

        if (filters.locationRadius && filters.locationRadius.center) {
          events = events.filter((e) => {
            if (!e.location) return false;
            const distance = this.calculateDistance(
              filters.locationRadius!.center,
              { lat: e.location.lat, lng: e.location.lng }
            );
            return distance <= filters.locationRadius!.radius;
          });
        }
      }

      return events;
    }
  }

  // Connection Management
  private addConnectionFromDB(dbConnection: DBEventConnection): void {
    const connection = this.convertDBConnectionToInternal(dbConnection);
    this.graph.connections[connection.id] = connection;

    // Update event connections
    const fromEvent = this.graph.events[connection.fromEventId];
    const toEvent = this.graph.events[connection.toEventId];

    if (fromEvent && !fromEvent.connections.includes(connection.toEventId)) {
      fromEvent.connections.push(connection.toEventId);
    }

    if (toEvent && !toEvent.connections.includes(connection.fromEventId)) {
      toEvent.connections.push(connection.fromEventId);
    }

    this.graph.metadata.totalConnections++;
  }

  async addConnection(connection: EventConnection): Promise<void> {
    try {
      // Convert internal connection to database format
      const dbConnection = {
        from_event_id: connection.fromEventId,
        to_event_id: connection.toEventId,
        connection_type: connection.type,
        strength: connection.strength,
        time_delta_ms: connection.metadata.timeDelta,
        distance_meters: connection.metadata.distance,
        common_users: connection.metadata.commonUsers,
        semantic_similarity: connection.metadata.semanticSimilarity,
        confidence: connection.metadata.confidence,
      };

      const createdConnection =
        await multiverseQueries.eventConnections.createConnection(dbConnection);

      // Add to local graph
      const internalConnection =
        this.convertDBConnectionToInternal(createdConnection);
      this.graph.connections[internalConnection.id] = internalConnection;

      // Update event connections
      const fromEvent = this.graph.events[internalConnection.fromEventId];
      const toEvent = this.graph.events[internalConnection.toEventId];

      if (
        fromEvent &&
        !fromEvent.connections.includes(internalConnection.toEventId)
      ) {
        fromEvent.connections.push(internalConnection.toEventId);
      }

      if (
        toEvent &&
        !toEvent.connections.includes(internalConnection.fromEventId)
      ) {
        toEvent.connections.push(internalConnection.fromEventId);
      }

      this.graph.metadata.totalConnections++;
      this.updateMetadata();

      this.emit("connectionAdded", internalConnection);
    } catch (error) {
      console.error("Failed to add connection:", error);
      throw error;
    }
  }

  // Auto-generate connections based on various factors
  private async autoGenerateConnections(newEvent: SocialEvent): Promise<void> {
    try {
      const allEvents = Object.values(this.graph.events);
      const connections: EventConnection[] = [];

      for (const existingEvent of allEvents) {
        if (existingEvent.id === newEvent.id) continue;

        // Temporal connections (events close in time)
        const timeDelta = Math.abs(
          new Date(newEvent.timestamp).getTime() -
            new Date(existingEvent.timestamp).getTime()
        );

        if (timeDelta < 3600000) {
          // 1 hour
          connections.push({
            id: `${newEvent.id}-${existingEvent.id}-temporal`,
            fromEventId: newEvent.id,
            toEventId: existingEvent.id,
            type: "temporal",
            strength: Math.max(0, 1 - timeDelta / 3600000),
            metadata: {
              timeDelta,
              confidence: 0.8,
            },
          });
        }

        // Relational connections (same users, mentions, etc.)
        const commonUsers = this.findCommonUsers(newEvent, existingEvent);
        if (commonUsers.length > 0) {
          connections.push({
            id: `${newEvent.id}-${existingEvent.id}-relational`,
            fromEventId: newEvent.id,
            toEventId: existingEvent.id,
            type: "relational",
            strength: Math.min(1, commonUsers.length / 5),
            metadata: {
              commonUsers,
              confidence: 0.9,
            },
          });
        }

        // Location connections
        if (newEvent.location && existingEvent.location) {
          const distance = this.calculateDistance(
            { lat: newEvent.location.lat, lng: newEvent.location.lng },
            { lat: existingEvent.location.lat, lng: existingEvent.location.lng }
          );

          if (distance < 1000) {
            // 1km
            connections.push({
              id: `${newEvent.id}-${existingEvent.id}-location`,
              fromEventId: newEvent.id,
              toEventId: existingEvent.id,
              type: "location",
              strength: Math.max(0, 1 - distance / 1000),
              metadata: {
                distance,
                confidence: 0.7,
              },
            });
          }
        }

        // Semantic connections (similar content)
        const semanticSimilarity = this.calculateSemanticSimilarity(
          newEvent,
          existingEvent
        );
        if (semanticSimilarity > 0.5) {
          connections.push({
            id: `${newEvent.id}-${existingEvent.id}-semantic`,
            fromEventId: newEvent.id,
            toEventId: existingEvent.id,
            type: "semantic",
            strength: semanticSimilarity,
            metadata: {
              semanticSimilarity,
              confidence: 0.6,
            },
          });
        }
      }

      // Add all generated connections to database
      for (const conn of connections) {
        await this.addConnection(conn);
      }
    } catch (error) {
      console.error("Failed to auto-generate connections:", error);
    }
  }

  // POV Filtering
  async getEventsFromPOV(filter: POVFilter): Promise<SocialEvent[]> {
    let events = await this.getEventsByUser(filter.userId, filter);

    if (filter.includeConnections) {
      const connectedEvents = await this.getConnectedEvents(
        events,
        filter.maxDegrees
      );
      events = [...events, ...connectedEvents];

      // Remove duplicates and sort by timestamp
      events = Array.from(new Map(events.map((e) => [e.id, e])).values()).sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    }

    return events;
  }

  private async getConnectedEvents(
    events: SocialEvent[],
    maxDegrees: number
  ): Promise<SocialEvent[]> {
    const connectedEvents: SocialEvent[] = [];
    const visited = new Set<string>();

    const traverse = async (eventIds: string[], degree: number) => {
      if (degree >= maxDegrees) return;

      for (const eventId of eventIds) {
        if (visited.has(eventId)) continue;
        visited.add(eventId);

        const event = this.graph.events[eventId];
        if (event) {
          connectedEvents.push(event);
          await traverse(event.connections, degree + 1);
        }
      }
    };

    await traverse(
      events.flatMap((e) => e.connections),
      0
    );
    return connectedEvents;
  }

  // Refresh data from database
  async refreshFromDatabase(): Promise<void> {
    // Clear current graph
    this.graph = {
      users: {},
      events: {},
      connections: {},
      timelines: {},
      stories: {},
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalEvents: 0,
        totalConnections: 0,
        dateRange: {
          start: "",
          end: "",
        },
      },
    };

    // Reload from database
    await this.initializeFromDatabase();
  }

  // Get events by location
  async getEventsByLocation(
    lat: number,
    lng: number,
    radiusKm: number = 1
  ): Promise<SocialEvent[]> {
    try {
      const dbEvents = await multiverseQueries.socialEvents.getEventsByLocation(
        lat,
        lng,
        radiusKm
      );
      return dbEvents.map((event) => this.convertDBEventToInternal(event));
    } catch (error) {
      console.error("Failed to get events by location:", error);
      return [];
    }
  }

  // Graph Analytics
  calculateMetrics(): GraphMetrics {
    const users = Object.values(this.graph.users);
    const events = Object.values(this.graph.events);
    const connections = Object.values(this.graph.connections);

    return {
      centrality: this.calculateCentrality(users, connections),
      clustering: this.calculateClustering(users, connections),
      communityDetection: this.detectCommunities(users, connections),
      pathAnalysis: this.analyzePhaths(users, connections),
    };
  }

  private calculateCentrality(
    users: User[],
    connections: EventConnection[]
  ): { [userId: string]: number } {
    const centrality: { [userId: string]: number } = {};

    users.forEach((user) => {
      const userEvents = Object.values(this.graph.events).filter(
        (e) => e.userId === user.id
      );
      const userConnections = connections.filter((c) =>
        userEvents.some((e) => e.id === c.fromEventId || e.id === c.toEventId)
      );

      centrality[user.id] =
        userConnections.length / Math.max(1, connections.length);
    });

    return centrality;
  }

  private calculateClustering(
    users: User[],
    connections: EventConnection[]
  ): { [userId: string]: number } {
    // Simplified clustering coefficient calculation
    const clustering: { [userId: string]: number } = {};

    users.forEach((user) => {
      clustering[user.id] = Math.random() * 0.5 + 0.3; // Placeholder
    });

    return clustering;
  }

  private detectCommunities(
    users: User[],
    connections: EventConnection[]
  ): { communities: { [communityId: string]: string[] }; modularity: number } {
    // Simplified community detection
    const communities: { [communityId: string]: string[] } = {};

    users.forEach((user, index) => {
      const communityId = `community_${Math.floor(index / 3)}`;
      if (!communities[communityId]) {
        communities[communityId] = [];
      }
      communities[communityId].push(user.id);
    });

    return {
      communities,
      modularity: 0.65, // Placeholder
    };
  }

  private analyzePhaths(
    users: User[],
    connections: EventConnection[]
  ): {
    shortestPaths: { [userPair: string]: string[] };
    influencePaths: { [userId: string]: string[] };
  } {
    // Simplified path analysis
    return {
      shortestPaths: {},
      influencePaths: {},
    };
  }

  // Utility methods
  private findCommonUsers(event1: SocialEvent, event2: SocialEvent): string[] {
    const users1 = [event1.userId, ...(event1.mentions || [])];
    const users2 = [event2.userId, ...(event2.mentions || [])];
    return users1.filter((u) => users2.includes(u));
  }

  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
    const dLng = ((point2.lng - point1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.lat * Math.PI) / 180) *
        Math.cos((point2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private calculateSemanticSimilarity(
    event1: SocialEvent,
    event2: SocialEvent
  ): number {
    // Simple word overlap similarity
    const words1 = event1.content.toLowerCase().split(/\s+/);
    const words2 = event2.content.toLowerCase().split(/\s+/);
    const intersection = words1.filter((w) => words2.includes(w));
    const union = [...new Set([...words1, ...words2])];
    return intersection.length / union.length;
  }

  private updateDateRange(timestamp: string): void {
    if (
      !this.graph.metadata.dateRange.start ||
      timestamp < this.graph.metadata.dateRange.start
    ) {
      this.graph.metadata.dateRange.start = timestamp;
    }
    if (
      !this.graph.metadata.dateRange.end ||
      timestamp > this.graph.metadata.dateRange.end
    ) {
      this.graph.metadata.dateRange.end = timestamp;
    }
  }

  private updateMetadata(): void {
    this.graph.metadata.lastUpdated = new Date().toISOString();
  }

  // Event system
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  // Export/Import
  exportGraph(): SocialGraph {
    return JSON.parse(JSON.stringify(this.graph));
  }

  importGraph(graph: SocialGraph): void {
    this.graph = graph;
    this.updateMetadata();
    this.emit("graphImported", graph);
  }

  // Query methods
  async query(conditions: {
    users?: string[];
    eventTypes?: string[];
    dateRange?: { start: string; end: string };
    hasLocation?: boolean;
    hasMentions?: boolean;
    minConnections?: number;
  }): Promise<SocialEvent[]> {
    try {
      // Use database query when possible
      const dbFilters = {
        userIds: conditions.users,
        eventTypes: conditions.eventTypes,
        dateRange: conditions.dateRange,
      };

      const dbEvents = await multiverseQueries.socialEvents.getAllEvents(
        dbFilters
      );
      let events = dbEvents.map((event) =>
        this.convertDBEventToInternal(event)
      );

      // Apply additional filters
      if (conditions.hasLocation) {
        events = events.filter((e) => !!e.location);
      }

      if (conditions.hasMentions) {
        events = events.filter((e) => e.mentions && e.mentions.length > 0);
      }

      if (typeof conditions.minConnections === "number") {
        events = events.filter(
          (e) => e.connections.length >= conditions.minConnections!
        );
      }

      return events;
    } catch (error) {
      console.error("Failed to query database:", error);
      // Fallback to local graph
      let events = Object.values(this.graph.events);

      if (conditions.users) {
        events = events.filter((e) => conditions.users!.includes(e.userId));
      }

      if (conditions.eventTypes) {
        events = events.filter((e) => conditions.eventTypes!.includes(e.type));
      }

      if (conditions.dateRange) {
        const start = new Date(conditions.dateRange.start).getTime();
        const end = new Date(conditions.dateRange.end).getTime();
        events = events.filter((e) => {
          const eventTime = new Date(e.timestamp).getTime();
          return eventTime >= start && eventTime <= end;
        });
      }

      if (conditions.hasLocation) {
        events = events.filter((e) => !!e.location);
      }

      if (conditions.hasMentions) {
        events = events.filter((e) => e.mentions && e.mentions.length > 0);
      }

      if (typeof conditions.minConnections === "number") {
        events = events.filter(
          (e) => e.connections.length >= conditions.minConnections!
        );
      }

      return events;
    }
  }
}
