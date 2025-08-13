import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Image,
  Paperclip,
  MoreVertical,
  Eye,
  Users,
  Lock,
} from "lucide-react";
import messengerQueries, { Message, Profile } from "../../lib/messengerQueries";
import { getCurrentUser } from "../../lib/socialMediaQueries";

interface ChatWindowProps {
  conversationId?: string;
  otherUser?: Profile;
  isGroup?: boolean;
}

export const ChatWindow = ({
  conversationId,
  otherUser,
  isGroup = false,
}: ChatWindowProps) => {
  const [message, setMessage] = useState("");
  const [isHiddenMessage, setIsHiddenMessage] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Initialize current user
  useEffect(() => {
    initializeUser();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (conversationId && currentUser) {
      loadMessages();
      subscribeToMessages();
      markAsRead();
    }

    return () => {
      // Cleanup subscription if needed
    };
  }, [conversationId, currentUser]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messageEndRef.current && messages.length) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Load online users
  useEffect(() => {
    loadOnlineUsers();
    subscribeToPresence();
  }, []);

  const initializeUser = async () => {
    try {
      const { user, error } = await getCurrentUser();
      if (error) throw error;
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  };

  const loadMessages = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    try {
      const data = await messengerQueries.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOnlineUsers = async () => {
    try {
      const data = await messengerQueries.getOnlineUsers();
      setOnlineUsers(data.map((u) => u.user_id));
    } catch (error) {
      console.error("Error loading online users:", error);
    }
  };

  const subscribeToMessages = () => {
    if (!conversationId) return;

    const subscription = messengerQueries.subscribeToMessages(
      conversationId,
      (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        // Mark as read if not from current user
        if (newMessage.sender_id !== currentUser?.id) {
          markAsRead();
        }
      }
    );

    return subscription;
  };

  const subscribeToPresence = () => {
    const subscription = messengerQueries.subscribeToPresence((presence) => {
      setOnlineUsers((prev) => {
        if (presence.is_online) {
          return prev.includes(presence.user_id)
            ? prev
            : [...prev, presence.user_id];
        } else {
          return prev.filter((id) => id !== presence.user_id);
        }
      });
    });

    return subscription;
  };

  const markAsRead = async () => {
    if (!conversationId) return;

    try {
      await messengerQueries.markMessagesAsRead(conversationId);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !conversationId) return;

    try {
      await messengerQueries.sendMessage({
        conversationId,
        content: message,
        isHidden: isHiddenMessage,
        isAnonymous: isAnonymous,
      });

      setMessage("");
      setIsHiddenMessage(false);
      setIsAnonymous(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Check if user is online
  const isUserOnline = otherUser ? onlineUsers.includes(otherUser.id) : false;

  if (!otherUser || !currentUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900">
        <p className="text-zinc-400">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={otherUser.avatar_url || "/avatar.png"}
              alt={
                otherUser.display_name ||
                otherUser.full_name ||
                otherUser.username ||
                "User"
              }
              className="w-10 h-10 rounded-full grayscale hover:grayscale-0 transition-all"
            />
            {isUserOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-zinc-900" />
            )}
          </div>
          <div>
            <h3 className="text-zinc-200 font-medium">
              {otherUser.display_name ||
                otherUser.full_name ||
                otherUser.username ||
                "User"}
            </h3>
            <p className="text-xs text-zinc-500">
              {isUserOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isGroup && (
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <Users className="w-5 h-5 text-amber-500/70" />
            </button>
          )}
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-amber-500/70" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900 bg-opacity-80">
        {isLoading ? (
          <div className="flex justify-center">
            <p className="text-zinc-400">Loading messages...</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_id === currentUser.id
                  ? "justify-end"
                  : "justify-start"
              }`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <div
                className={`max-w-[70%] ${
                  msg.sender_id === currentUser.id
                    ? "bg-amber-500/10 border border-amber-500/20"
                    : "bg-zinc-800/90"
                } rounded-lg p-3`}
              >
                {/* Hidden message indicator */}
                {msg.is_hidden && (
                  <div className="flex items-center space-x-1 mb-1 text-amber-500/70">
                    <Lock className="w-3 h-3" />
                    <span className="text-xs">Hidden Message</span>
                  </div>
                )}

                {/* Anonymous message indicator */}
                {msg.is_anonymous && (
                  <div className="flex items-center space-x-1 mb-1 text-blue-500/70">
                    <Users className="w-3 h-3" />
                    <span className="text-xs">Anonymous</span>
                  </div>
                )}

                {/* File/Image display */}
                {msg.message_type === "image" && msg.file_url && (
                  <img
                    src={msg.file_url}
                    alt={msg.file_name || "Image"}
                    className="rounded-md mb-2 max-w-full"
                  />
                )}

                {msg.message_type === "file" && msg.file_url && (
                  <div className="flex items-center space-x-2 mb-2 p-2 bg-zinc-700/50 rounded">
                    <Paperclip className="w-4 h-4 text-zinc-400" />
                    <a
                      href={msg.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-amber-500 transition-colors"
                    >
                      {msg.file_name || "Download file"}
                    </a>
                  </div>
                )}

                {/* Message content */}
                {msg.content && (
                  <p className="text-zinc-200">
                    {msg.content}
                    {msg.edited_at && (
                      <span className="text-xs text-zinc-500 ml-2">
                        (edited)
                      </span>
                    )}
                  </p>
                )}

                {/* Message metadata */}
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-zinc-500">
                    {formatMessageTime(msg.created_at)}
                  </p>
                  {/* Sender name for anonymous messages */}
                  {!msg.is_anonymous && msg.sender_id !== currentUser.id && (
                    <p className="text-xs text-zinc-400">
                      {msg.sender?.display_name ||
                        msg.sender?.full_name ||
                        msg.sender?.username}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/90">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsHiddenMessage(!isHiddenMessage)}
              className={`p-2 rounded-lg transition-colors ${
                isHiddenMessage
                  ? "bg-amber-500/20 text-amber-500"
                  : "hover:bg-zinc-800 text-zinc-400"
              }`}
              title="Send hidden message"
            >
              <Lock className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`p-2 rounded-lg transition-colors ${
                isAnonymous
                  ? "bg-amber-500/20 text-amber-500"
                  : "hover:bg-zinc-800 text-zinc-400"
              }`}
              title="Send anonymous message"
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              className="p-2 hover:bg-zinc-800 text-zinc-400 rounded-lg transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              className="p-2 hover:bg-zinc-800 text-zinc-400 rounded-lg transition-colors"
              title="Attach image"
            >
              <Image className="w-5 h-5" />
            </button>
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`${
              isAnonymous ? "Send anonymous message..." : "Type a message..."
            }`}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2 bg-amber-500/20 text-amber-500 rounded-lg hover:bg-amber-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Message options indicators */}
        {(isHiddenMessage || isAnonymous) && (
          <div className="flex items-center space-x-4 mt-2 text-xs">
            {isHiddenMessage && (
              <span className="flex items-center space-x-1 text-amber-500/70">
                <Lock className="w-3 h-3" />
                <span>Hidden message enabled</span>
              </span>
            )}
            {isAnonymous && (
              <span className="flex items-center space-x-1 text-blue-500/70">
                <Users className="w-3 h-3" />
                <span>Anonymous message enabled</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
