import { useState, useEffect } from "react";
import { Send, Search, Book, Brain } from "lucide-react";
import { examService } from "../../../../services/examService";
import supabase from "../../../../lib/supabaseClient";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

// Supabase helper functions
const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  return data;
};

const addUserXP = async (userId: string, xpToAdd: number) => {
  try {
    const { data, error } = await supabase.rpc("add_user_xp", {
      user_uuid: userId,
      xp_amount: xpToAdd,
    });

    if (error) {
      console.error("Error adding user XP:", error);
      return false;
    }
    return data;
  } catch (error) {
    console.error("Error in addUserXP:", error);
    return false;
  }
};

const saveChatSession = async (userId: string, sessionData: any) => {
  try {
    const { error } = await supabase.from("challenge_completions").insert({
      user_id: userId,
      challenge_id: `chat_session_${Date.now()}`,
      challenge_type: "chat_session",
      language_id: "study_chat",
      language_name: "Study Chat Session",
      xp_earned: sessionData.timeScore + sessionData.questionScore,
      code_submitted: JSON.stringify(sessionData),
      execution_output: JSON.stringify({
        time_spent: sessionData.timeSpent,
        questions_asked: sessionData.questionsAsked,
        time_score: sessionData.timeScore,
        question_score: sessionData.questionScore,
      }),
      completed_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error saving chat session:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in saveChatSession:", error);
    return false;
  }
};

// Enhanced helper to format answers for markdown: bold headings, number main points, letter subpoints, dash for further subpoints, and add spacing
function formatBullets(text: string) {
  const lines = text.split(/\n+/).filter(Boolean);
  let mainCount = 1;
  let subCount = 0;
  let subSubCount = 0;
  let result: string[] = [];
  let lastWasMain = false;

  lines.forEach((line) => {
    const trimmed = line.trim();
    // Heading: line ends with a colon (e.g., 'Elasticity:')
    if (/^[A-Z][^:]*:$/i.test(trimmed)) {
      // If not the first line, add a blank line before a new heading for clarity
      if (result.length > 0) result.push("");
      result.push(`**${trimmed}**`);
      lastWasMain = false;
    }
    // Main bullet: starts with "•" or "- " or is a definition line after a heading
    else if (
      /^•|^- /.test(trimmed) ||
      (lastWasMain === false && !/^\s/.test(line) && trimmed.length > 0)
    ) {
      if (result.length > 0 && !/^\*\*.*\*\*$/.test(result[result.length - 1]))
        result.push(""); // blank line before new main point
      result.push(`${mainCount}. ${trimmed.replace(/^•\s*|^- /, "")}`);
      mainCount++;
      subCount = 0;
      subSubCount = 0;
      lastWasMain = true;
    }
    // Subpoint: indented or starts with "  -"
    else if (/^\s{2,}- /.test(line)) {
      subCount++;
      const letter = String.fromCharCode(96 + subCount); // a, b, c, ...
      result.push(`    ${letter}. ${trimmed.replace(/^\s*- /, "")}`);
      subSubCount = 0;
    }
    // Further subpoint: more indented or starts with "    -"
    else if (/^\s{4,}- /.test(line)) {
      subSubCount++;
      result.push(`        - ${trimmed.replace(/^\s*- /, "")}`);
    }
    // Note or plain text (not numbered)
    else {
      result.push(trimmed);
      lastWasMain = false;
    }
  });
  return result.join("\n");
}

export const ExamChat = ({
  onSessionDataChange,
}: {
  onSessionDataChange?: (sessionData: any) => void;
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your exam prep assistant. Ask me anything to start your study session automatically!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Real-time tracking state
  const [isTrackingActive, setIsTrackingActive] = useState(false);

  // Send session data to parent component
  useEffect(() => {
    if (onSessionDataChange && sessionStartTime) {
      onSessionDataChange({
        sessionStartTime,
        questionsAsked,
        isActive: sessionStartTime !== null && questionsAsked > 0,
      });
    }
  }, [sessionStartTime, questionsAsked, onSessionDataChange]);

  // Page Visibility API for automatic session tracking
  useEffect(() => {
    if (!sessionStartTime || !currentUser) return;

    const handleVisibilityChange = async () => {
      const now = new Date();

      if (document.hidden) {
        // User switched away from tab - award points and pause tracking
        console.log("Tab hidden - awarding points for chat session");

        const timeSpentSeconds = Math.floor(
          (now.getTime() - sessionStartTime.getTime()) / 1000
        );
        const finalTimeSpent = Math.max(60, timeSpentSeconds);

        if (questionsAsked > 0) {
          try {
            // Award XP for the session
            const sessionData = {
              timeScore: Math.floor(finalTimeSpent / 60) * 5, // 5 XP per minute
              questionScore: questionsAsked * 10, // 10 XP per question
              timeSpent: finalTimeSpent,
              questionsAsked: questionsAsked,
            };

            await saveChatSession(currentUser.id, sessionData);
            await addUserXP(
              currentUser.id,
              sessionData.timeScore + sessionData.questionScore
            );

            // Update session in database
            await supabase.from("study_sessions").upsert(
              {
                user_id: currentUser.id,
                session_type: "chat",
                start_time: sessionStartTime.toISOString(),
                last_update: now.toISOString(),
                time_spent: finalTimeSpent,
                questions_asked: questionsAsked,
                status: "paused",
                metadata: {
                  component: "ExamChat",
                  activity_type: "study_questions",
                  paused_at: now.toISOString(),
                },
              },
              {
                onConflict: "user_id,session_type,start_time",
              }
            );

            toast.success(
              `📴 Session paused - earned ${
                sessionData.timeScore + sessionData.questionScore
              } XP!`,
              {
                duration: 3000,
                position: "top-center",
              }
            );
          } catch (error) {
            console.error("Error awarding points on tab switch:", error);
          }
        }
      } else {
        // User returned to tab - resume tracking
        console.log("Tab visible - resuming chat session");

        if (questionsAsked > 0) {
          try {
            // Resume session tracking
            await supabase.from("study_sessions").upsert(
              {
                user_id: currentUser.id,
                session_type: "chat",
                start_time: sessionStartTime.toISOString(),
                last_update: now.toISOString(),
                time_spent: Math.floor(
                  (now.getTime() - sessionStartTime.getTime()) / 1000
                ),
                questions_asked: questionsAsked,
                status: "active",
                metadata: {
                  component: "ExamChat",
                  activity_type: "study_questions",
                  resumed_at: now.toISOString(),
                },
              },
              {
                onConflict: "user_id,session_type,start_time",
              }
            );
          } catch (error) {
            console.error("Error resuming session tracking:", error);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [sessionStartTime, currentUser, questionsAsked]);

  // Timer to update displayed time spent (removed - no longer needed)
  useEffect(() => {
    if (!sessionStartTime) return;
    // Timer removed since we don't display time anymore
  }, [sessionStartTime]);

  useEffect(() => {
    // Load user data on mount (don't auto-start session)
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        const profile = await getUserProfile(user.id);
        // Profile loaded successfully
        console.log("User profile loaded:", profile);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    // Auto-start session if not already started
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
      setQuestionsAsked(0);
      if (currentUser) {
        setIsTrackingActive(true);
      }
      console.log("Auto-started new chat session");
    }

    const userMessage = message;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setMessage("");
    setLoading(true);
    setQuestionsAsked((prev) => prev + 1);

    // Trigger real-time activity update
    if (currentUser && sessionStartTime) {
      setIsTrackingActive(true);
    }

    try {
      // Add a temporary 'thinking...' message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Thinking..." },
      ]);
      const response = await examService.queryModel(userMessage);

      // Award immediate XP for asking a question
      if (currentUser) {
        await addUserXP(currentUser.id, 10); // 10 XP per question
        toast.success("🎉 +10 XP for asking a question!", {
          duration: 2000,
          position: "top-right",
        });
      }

      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove 'Thinking...'
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove 'Thinking...'
        {
          role: "assistant",
          content: "Sorry, I could not get an answer. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save chat activity every 30 seconds when active (only when tab is visible)
  useEffect(() => {
    if (!isTrackingActive || !currentUser || !sessionStartTime) return;

    const interval = setInterval(async () => {
      // Only track if tab is visible
      if (document.hidden) return;

      const now = new Date();
      const timeSpentSeconds = Math.floor(
        (now.getTime() - sessionStartTime.getTime()) / 1000
      );
      const timeSpent = Math.max(60, timeSpentSeconds);

      if (timeSpent > 30 && questionsAsked > 0) {
        try {
          await supabase.from("study_sessions").upsert(
            {
              user_id: currentUser.id,
              session_type: "chat",
              start_time: sessionStartTime.toISOString(),
              last_update: now.toISOString(),
              time_spent: timeSpent,
              questions_asked: questionsAsked,
              status: "active",
              metadata: {
                component: "ExamChat",
                activity_type: "study_questions",
              },
            },
            {
              onConflict: "user_id,session_type,start_time",
            }
          );
          console.log("Chat activity tracked at:", now);
        } catch (error) {
          console.error("Error tracking chat activity:", error);
        }
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isTrackingActive, currentUser, sessionStartTime, questionsAsked]);

  // Start tracking when user becomes active
  useEffect(() => {
    if (currentUser && sessionStartTime) {
      setIsTrackingActive(true);
    }
  }, [currentUser, sessionStartTime]);

  return (
    <div className="space-y-6">
      {/* Resource Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-matrix/50" />
        <input
          type="text"
          placeholder="Search study resources..."
          className="w-full bg-black/50 border border-matrix/30 rounded-lg pl-12 pr-4 py-3 text-matrix placeholder-matrix/30 focus:outline-none focus:border-matrix/50 font-code"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code">
          <Book className="w-5 h-5" />
          <span>Study Materials</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code">
          <Brain className="w-5 h-5" />
          <span>Practice Tests</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="h-[400px] overflow-y-auto space-y-4 pr-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                msg.role === "user"
                  ? "bg-matrix/10 text-matrix border border-matrix/30"
                  : "bg-black/50 text-matrix/90 border border-matrix/20"
              } font-code`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-invert">
                  <ReactMarkdown>{formatBullets(msg.content)}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex space-x-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything about your studies..."
          className="flex-1 bg-black/50 border border-matrix/30 rounded-lg px-4 py-3 text-matrix placeholder-matrix/30 focus:outline-none focus:border-matrix/50 font-code"
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || loading}
          className="px-6 py-3 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-code"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
