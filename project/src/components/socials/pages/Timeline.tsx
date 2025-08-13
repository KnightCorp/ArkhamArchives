import React, { useState, useEffect } from "react";
import {
  Clock,
  Loader2,
  Heart,
  MessageCircle,
  Users,
  Camera,
  Video,
  Trophy,
  RefreshCw,
} from "lucide-react";
import {
  timelineQueries,
  timelineUtils,
  TimelineEvent,
  Achievement,
} from "../lib/timelineQueries";
import { supabase } from "../../../lib/supabaseClient";

const Timeline = () => {
  const [user, setUser] = useState<any>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (!error) setUser(user);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load timeline data
  const loadTimelineData = async (offset = 0) => {
    if (!user?.id) return;

    try {
      const [timelineResult, achievementsResult] = await Promise.all([
        timelineQueries.getUserTimeline(user.id, 20, offset),
        offset === 0
          ? timelineQueries.getUserAchievements(user.id)
          : Promise.resolve({ data: null, error: null }),
      ]);

      if (timelineResult.error) {
        throw timelineResult.error;
      }

      if (offset === 0) {
        setTimelineEvents(timelineResult.data || []);
        if (achievementsResult.data) {
          setAchievements(achievementsResult.data);
        }
      } else {
        setTimelineEvents((prev) => [...prev, ...(timelineResult.data || [])]);
      }

      setHasMore((timelineResult.data?.length || 0) === 20);
    } catch (err) {
      console.error("Error loading timeline:", err);
      setError("Failed to load timeline. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);
      await loadTimelineData();
      setLoading(false);
    };

    fetchData();
  }, [user?.id]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    await loadTimelineData(timelineEvents.length);
    setLoadingMore(false);
  };

  const handleRefresh = async () => {
    setError(null);
    setLoading(true);
    await loadTimelineData();
    setLoading(false);
  };

  const renderEventContent = (event: TimelineEvent) => {
    switch (event.event_type) {
      case "post":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Camera className="w-5 h-5 text-blue-400" />
              <span className="text-zinc-300">Posted a new photo</span>
            </div>
            {event.post?.image_url && (
              <img
                src={event.post.image_url}
                alt=""
                className="w-full rounded-lg grayscale hover:grayscale-0 transition-all cursor-pointer"
              />
            )}
            {event.post?.caption && (
              <p className="text-zinc-300">{event.post.caption}</p>
            )}
            <div className="flex items-center space-x-4 text-sm text-zinc-400">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{event.post?.likes_count || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{event.post?.comments_count || 0}</span>
              </div>
            </div>
          </div>
        );

      case "reel":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Video className="w-5 h-5 text-purple-400" />
              <span className="text-zinc-300">Created a new reel</span>
            </div>
            {event.reel?.thumbnail_url && (
              <div className="relative">
                <img
                  src={event.reel.thumbnail_url}
                  alt=""
                  className="w-full rounded-lg grayscale hover:grayscale-0 transition-all cursor-pointer"
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                  <Video className="w-12 h-12 text-white/80" />
                </div>
              </div>
            )}
            {event.reel?.title && (
              <h3 className="text-zinc-200 font-medium">{event.reel.title}</h3>
            )}
            <div className="flex items-center space-x-4 text-sm text-zinc-400">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{event.reel?.likes_count || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>👁️</span>
                <span>{event.reel?.views_count || 0}</span>
              </div>
            </div>
          </div>
        );

      case "like":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-zinc-300">
                {timelineUtils.getEventDisplayText(event)}
              </span>
            </div>
            {event.target_user && (
              <div className="flex items-center space-x-3 p-3 bg-zinc-800/50 rounded-lg">
                <img
                  src={
                    event.target_user.avatar_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      event.target_user.display_name
                    )}&background=6366f1&color=ffffff&size=150`
                  }
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-zinc-200 font-medium">
                    {event.target_user.display_name}
                  </p>
                  <p className="text-zinc-400 text-sm">
                    @{event.target_user.username}
                  </p>
                </div>
              </div>
            )}
            {(event.post?.image_url || event.reel?.thumbnail_url) && (
              <img
                src={event.post?.image_url || event.reel?.thumbnail_url}
                alt=""
                className="w-32 h-32 object-cover rounded-lg grayscale hover:grayscale-0 transition-all"
              />
            )}
          </div>
        );

      case "follow":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-zinc-300">
                {timelineUtils.getEventDisplayText(event)}
              </span>
            </div>
            {event.target_user && (
              <div className="flex items-center space-x-3 p-3 bg-zinc-800/50 rounded-lg">
                <img
                  src={
                    event.target_user.avatar_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      event.target_user.display_name
                    )}&background=6366f1&color=ffffff&size=150`
                  }
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-zinc-200 font-medium">
                    {event.target_user.display_name}
                  </p>
                  <p className="text-zinc-400 text-sm">
                    @{event.target_user.username}
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case "comment":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-blue-400" />
              <span className="text-zinc-300">Commented on a post</span>
            </div>
            {event.content?.comment_text && (
              <div className="p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-zinc-300 italic">
                  "{event.content.comment_text}"
                </p>
              </div>
            )}
            {event.post?.image_url && (
              <img
                src={event.post.image_url}
                alt=""
                className="w-32 h-32 object-cover rounded-lg grayscale hover:grayscale-0 transition-all"
              />
            )}
          </div>
        );

      case "achievement":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-zinc-300">Unlocked an achievement</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/20 rounded-lg">
              <div className="text-3xl">
                {event.content?.badge_icon || "🏆"}
              </div>
              <div>
                <h3 className="text-zinc-200 font-medium">
                  {event.content?.title}
                </h3>
                <p className="text-zinc-400">{event.content?.description}</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center space-x-3">
            <div className="text-lg">{timelineUtils.getEventIcon(event)}</div>
            <span className="text-zinc-300">
              {timelineUtils.getEventDisplayText(event)}
            </span>
          </div>
        );
    }
  };

  const groupedEvents = timelineUtils.groupEventsByDate(timelineEvents);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-900/50 rounded-lg p-8 text-center">
          <Clock className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <h2 className="text-xl font-typewriter text-zinc-200 mb-2">
            Sign in to view your timeline
          </h2>
          <p className="text-zinc-400">
            Track your journey and see all your activities in one place.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Clock className="w-8 h-8 text-zinc-400" />
          <h1 className="text-3xl font-typewriter text-zinc-200">
            Your Timeline
          </h1>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-typewriter text-zinc-200 mb-4">
            Recent Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.slice(0, 6).map((achievement) => (
              <div
                key={achievement.id}
                className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{achievement.badge_icon}</div>
                  <div>
                    <h3 className="text-zinc-200 font-medium">
                      {achievement.title}
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 text-red-300 hover:text-red-200 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Timeline */}
      {Object.keys(groupedEvents).length > 0 ? (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-zinc-800" />

          {/* Timeline events grouped by date */}
          <div className="space-y-12">
            {Object.entries(groupedEvents)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, events]) => (
                <div key={date} className="space-y-8">
                  {/* Date header */}
                  <div className="relative pl-24">
                    <div className="absolute left-6 -translate-x-1/2 bg-zinc-700 border-2 border-zinc-600 rounded-full w-6 h-6 flex items-center justify-center">
                      <div className="w-2 h-2 bg-zinc-400 rounded-full" />
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                      <h3 className="text-zinc-200 font-mono text-sm">
                        {timelineUtils.formatTimelineDate(date)}
                      </h3>
                    </div>
                  </div>

                  {/* Events for this date */}
                  {events.map((event) => (
                    <div key={event.id} className="relative pl-24">
                      {/* Time marker */}
                      <div className="absolute left-6 -translate-x-1/2 bg-zinc-900 border-2 border-zinc-800 rounded-full w-5 h-5" />

                      {/* Time */}
                      <div className="absolute left-0 top-1 text-sm text-zinc-500 font-mono">
                        {timelineUtils.formatTimelineTime(event.created_at)}
                      </div>

                      {/* Content */}
                      <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800 hover:bg-zinc-900/70 transition-colors">
                        {renderEventContent(event)}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>

          {/* Load more button */}
          {hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center space-x-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors mx-auto"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>Load More</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-zinc-900/50 rounded-lg p-8 text-center">
          <Clock className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <h2 className="text-xl font-typewriter text-zinc-200 mb-2">
            No timeline events yet
          </h2>
          <p className="text-zinc-400">
            Start creating posts, liking content, or following others to see
            your timeline come to life!
          </p>
        </div>
      )}
    </div>
  );
};

export default Timeline;
