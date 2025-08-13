import React, { useState, useEffect } from "react";
import {
  Send,
  Brain,
  History,
  TrendingUp,
  Clock,
  Terminal,
  Loader,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface SearchHistory {
  id: string;
  query: string;
  timestamp: string;
  response?: string;
}

interface AlfredProps {
  currentUser: any;
}

export const Alfred = ({ currentUser }: AlfredProps) => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello, I am Alfred, your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock search patterns based on user activity
  const [patterns] = useState([
    {
      title: "Search Patterns",
      description:
        "You frequently research psychology and cognitive science topics",
      percentage: 45,
    },
    {
      title: "Time Analysis",
      description: "Most active search times: 8-10 PM",
      percentage: 30,
    },
    {
      title: "Topic Clusters",
      description: "Common themes: behavior, therapy, communication",
      percentage: 25,
    },
  ]);

  // Load user's search history on mount
  useEffect(() => {
    if (currentUser?.id) {
      loadSearchHistory();
    }
  }, [currentUser]);

  const loadSearchHistory = () => {
    // Mock search history - in real app, this would come from database
    const mockHistory: SearchHistory[] = [
      {
        id: "1",
        query: "How does confirmation bias affect decision making?",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        response:
          "Confirmation bias significantly impacts decision making by...",
      },
      {
        id: "2",
        query: "What are effective techniques for active listening?",
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        response: "Active listening techniques include...",
      },
      {
        id: "3",
        query: "Explain cognitive behavioral therapy frameworks",
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        response: "CBT frameworks are structured approaches...",
      },
    ];

    setSearchHistory(mockHistory);
    setLoading(false);
  };

  const generateAIResponse = (userQuery: string): string => {
    // Mock AI responses based on query patterns
    const responses = {
      psychology:
        "Based on psychological research, this topic involves complex cognitive processes that influence behavior and decision-making.",
      behavior:
        "Behavioral patterns often stem from underlying psychological mechanisms and can be influenced by various environmental factors.",
      therapy:
        "Therapeutic approaches typically focus on identifying patterns, developing coping strategies, and promoting positive behavioral changes.",
      default: `I understand your query about "${userQuery}". This is a complex topic that involves multiple factors and perspectives. Let me break this down for you based on current research and best practices.`,
    };

    const lowerQuery = userQuery.toLowerCase();
    if (lowerQuery.includes("psychology") || lowerQuery.includes("cognitive")) {
      return responses.psychology;
    } else if (
      lowerQuery.includes("behavior") ||
      lowerQuery.includes("habit")
    ) {
      return responses.behavior;
    } else if (
      lowerQuery.includes("therapy") ||
      lowerQuery.includes("counseling")
    ) {
      return responses.therapy;
    } else {
      return responses.default;
    }
  };

  const handleSend = async () => {
    if (!query.trim() || !currentUser) return;

    const userMessage: Message = {
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    // Add user message
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Save to search history
    const newHistoryItem: SearchHistory = {
      id: Date.now().toString(),
      query: query,
      timestamp: new Date().toISOString(),
    };

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = generateAIResponse(query);
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSearchHistory((prev) =>
        [
          {
            ...newHistoryItem,
            response: aiResponse,
          },
          ...prev,
        ].slice(0, 10)
      ); // Keep only last 10 searches
      setIsTyping(false);
    }, 1500);

    setQuery("");
  };

  const handleHistoryClick = (historicalQuery: string) => {
    setQuery(historicalQuery);
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  if (!currentUser) {
    return (
      <div className="text-center py-8 text-white/60">
        <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Please log in to access Alfred, your AI assistant.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-white/60">
        <Loader className="w-6 h-6 animate-spin mx-auto mb-2" />
        <p>Initializing Alfred...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-white/60" />
          <div>
            <h2 className="text-white">
              Welcome back, {currentUser.full_name || "User"}!
            </h2>
            <p className="text-white/60 text-sm">
              Alfred is ready to assist you with research, analysis, and
              insights.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Terminal */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
        <div className="flex items-center space-x-3 mb-4">
          <Terminal className="w-5 h-5 text-white/60" />
          <h3 className="text-lg text-white">AI Terminal</h3>
        </div>

        <div className="h-[400px] overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
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
                    ? "bg-white/10 text-white"
                    : "bg-black/50 text-white/90"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {msg.role === "assistant" && (
                    <Brain className="w-4 h-4 text-white/60" />
                  )}
                  <span className="text-sm text-white/60">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-black/50 text-white/90 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-4 h-4 text-white/60" />
                  <span className="text-sm text-white/60">
                    Alfred is typing...
                  </span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isTyping && handleSend()}
            placeholder="Ask me anything about psychology, behavior, therapy, or any topic..."
            className="flex-1 bg-black/20 rounded-lg px-4 py-3 text-white placeholder-white/30 border border-white/10 focus:border-white/20 transition-colors focus:outline-none"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!query.trim() || isTyping}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isTyping ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isTyping ? "Processing..." : "Send"}</span>
          </button>
        </div>
      </div>

      {/* Search Patterns */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-5 h-5 text-white/60" />
          <h3 className="text-lg text-white">Your Search Patterns</h3>
        </div>
        <div className="space-y-4">
          {patterns.map((pattern, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white">{pattern.title}</span>
                <span className="text-white/60">{pattern.percentage}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-white/20 to-white/40 rounded-full transition-all duration-1000"
                  style={{ width: `${pattern.percentage}%` }}
                />
              </div>
              <p className="text-white/60 text-sm">{pattern.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
        <div className="flex items-center space-x-2 mb-4">
          <History className="w-5 h-5 text-white/60" />
          <h3 className="text-white">Recent Searches</h3>
        </div>

        {searchHistory.length === 0 ? (
          <div className="text-center py-4 text-white/60">
            <p>
              No search history yet. Start a conversation with Alfred above!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {searchHistory.map((search) => (
              <button
                key={search.id}
                onClick={() => handleHistoryClick(search.query)}
                className="w-full text-left p-3 bg-black/20 rounded-lg text-white/80 hover:bg-black/30 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 flex-1">
                    <Clock className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-white group-hover:text-white/90">
                        {search.query}
                      </div>
                      {search.response && (
                        <div className="text-white/50 text-sm mt-1 line-clamp-2">
                          {search.response}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-white/40 text-xs whitespace-nowrap ml-2">
                    {formatTimeAgo(search.timestamp)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
