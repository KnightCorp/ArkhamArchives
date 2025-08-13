import React, { useEffect, useState } from "react";
import {
  Activity,
  FileText,
  MapPin,
  Settings,
  MessageCircle,
  BookOpen,
  Sword,
} from "lucide-react";
import supabase from "../../../../../lib/supabaseClient";

interface StudyActivity {
  id: string;
  type: "Chat" | "Practice" | "Arena";
  time: string;
  message: string;
  icon: React.ElementType;
  user_name?: string;
}

export const LiveUpdates = () => {
  const [activities, setActivities] = useState<StudyActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveActivities = async () => {
    try {
      console.log("[LiveUpdates] Fetching activities...");
      const { data, error } = await supabase
        .from("study_sessions")
        .select(
          `
          *,
          profiles (username)
        `
        )
        .in("status", ["active", "completed"])
        .order("last_update", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching live activities:", error);
        return;
      }

      console.log("[LiveUpdates] Fetched data:", data?.length || 0, "sessions");
      data?.forEach((session, index) => {
        console.log(`[LiveUpdates] Session ${index}:`, {
          type: session.session_type,
          status: session.status,
          user: session.profiles?.username,
          lastUpdate: session.last_update,
          metadata: session.metadata,
        });
      });

      const formattedActivities: StudyActivity[] = (data || []).map(
        (session) => {
          const timeDiff =
            new Date().getTime() - new Date(session.last_update).getTime();
          const minutesAgo = Math.floor(timeDiff / (1000 * 60));

          let type: "Chat" | "Practice" | "Arena";
          let icon: React.ElementType;
          let message: string;

          // Check if session was completed and calculate XP
          const isCompleted = session.status === "completed";
          const timeSpentMinutes = Math.floor(session.time_spent / 60);
          const timeXP = timeSpentMinutes * 5; // 5 XP per minute
          const questionXP = session.questions_asked * 10; // 10 XP per question
          const totalXP = timeXP + questionXP;

          switch (session.session_type) {
            case "chat":
              type = "Chat";
              icon = MessageCircle;
              if (isCompleted) {
                message = `${
                  session.profiles?.username || "Student"
                } completed chat session - Earned ${totalXP} XP (${
                  session.questions_asked
                } questions, ${timeSpentMinutes}m)`;
              } else {
                message = `${
                  session.profiles?.username || "Student"
                } asking study questions (${
                  session.questions_asked
                } questions)`;
              }
              break;
            case "practice":
              type = "Practice";
              icon = BookOpen;
              const metadata = session.metadata || {};
              if (isCompleted) {
                message = `${
                  session.profiles?.username || "Student"
                } completed practice session - Earned ${totalXP} XP (${
                  session.questions_asked
                } questions, ${timeSpentMinutes}m)`;
              } else {
                message = `${
                  session.profiles?.username || "Student"
                } practicing ${metadata.subject || "Unknown"} (${
                  session.questions_asked
                }/${metadata.total_questions || 0} questions)`;
              }
              break;
            case "arena":
              type = "Arena";
              icon = Sword;
              if (isCompleted) {
                const arenaXP = session.metadata?.xp_earned || totalXP;
                message = `${
                  session.profiles?.username || "Student"
                } completed arena match - Earned ${arenaXP} XP (${timeSpentMinutes}m)`;
              } else {
                message = `${
                  session.profiles?.username || "Student"
                } competing in arena match`;
              }
              break;
            default:
              type = "Practice";
              icon = FileText;
              message = "Unknown activity";
          }

          return {
            id: session.user_id + session.session_type,
            type,
            time: minutesAgo < 1 ? "Just now" : `${minutesAgo}m ago`,
            message,
            icon,
            user_name: session.profiles?.username,
          };
        }
      );

      setActivities(formattedActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveActivities();

    // Update every 30 seconds
    const interval = setInterval(fetchLiveActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const defaultUpdates = [
    {
      id: "default1",
      type: "System" as const,
      time: "1h ago",
      message: "Study tracking system initialized",
      icon: Settings,
    },
  ];

  const displayActivities = activities.length > 0 ? activities : defaultUpdates;

  return (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-5 h-5 text-zinc-400" />
          <h2 className="text-lg text-zinc-200">LIVE STUDY ACTIVITY</h2>
          {loading && (
            <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchLiveActivities();
          }}
          className="px-3 py-1 text-xs bg-zinc-800 text-zinc-400 rounded hover:bg-zinc-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {displayActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className="flex-none">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                <activity.icon className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-zinc-200">{activity.type}</span>
                <span className="text-sm text-zinc-400">{activity.time}</span>
              </div>
              <p className="text-zinc-400">{activity.message}</p>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && !loading && (
        <div className="text-center py-4">
          <p className="text-zinc-500">No active study sessions</p>
        </div>
      )}
    </div>
  );
};
