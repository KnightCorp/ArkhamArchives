import React, { useEffect, useState } from "react";
import { Check, CheckCheck } from "lucide-react";
import messengerQueries, {
  Conversation,
  Profile,
} from "../../lib/messengerQueries";
import { getCurrentUser } from "../../lib/socialMediaQueries";

interface MessageListProps {
  activeChat: string | null;
  onChatSelect: (chatId: string, otherUser: Profile) => void;
  searchQuery: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  activeChat,
  onChatSelect,
  searchQuery,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [showAllUsers, setShowAllUsers] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers();
    } else {
      setShowAllUsers(false);
      setUsers([]);
    }
  }, [searchQuery]);

  const initializeData = async () => {
    setIsLoading(true);
    try {
      // Get current user
      const { user, error } = await getCurrentUser();
      if (error) throw error;
      setCurrentUser(user);

      // Load conversations and online users
      await Promise.all([loadConversations(), loadOnlineUsers()]);

      // Subscribe to real-time updates
      subscribeToUpdates();
    } catch (error) {
      console.error("Error initializing message list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      const data = await messengerQueries.getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Error loading conversations:", error);
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

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setUsers([]);
      setShowAllUsers(false);
      return;
    }

    try {
      const data = await messengerQueries.getUsers(searchQuery);
      setUsers(data);
      setShowAllUsers(true);
    } catch (error) {
      console.error("Error searching users:", error);
      setUsers([]);
    }
  };

  const subscribeToUpdates = () => {
    // Subscribe to conversation updates
    const conversationSub = messengerQueries.subscribeToConversations(
      (updatedConv) => {
        setConversations((prev) => {
          const existing = prev.find((c) => c.id === updatedConv.id);
          if (existing) {
            return prev.map((c) => (c.id === updatedConv.id ? updatedConv : c));
          } else {
            return [updatedConv, ...prev];
          }
        });
      }
    );

    // Subscribe to presence updates
    const presenceSub = messengerQueries.subscribeToPresence((presence) => {
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

    return () => {
      conversationSub?.unsubscribe?.();
      presenceSub?.unsubscribe?.();
    };
  };

  const handleUserClick = async (user: Profile) => {
    try {
      setIsLoading(true);
      // Get or create direct conversation with this user
      const conversationId =
        await messengerQueries.getOrCreateDirectConversation(user.id);

      // Clear search to show conversations
      setShowAllUsers(false);

      // Select the chat
      onChatSelect(conversationId, user);

      // Refresh conversations to include the new one if created
      await loadConversations();
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    if (!currentUser) return;

    // Get the other user in direct conversation
    const otherParticipant = conversation.participants?.find(
      (p) => p.user_id !== currentUser.id && p.is_active
    );

    if (otherParticipant) {
      onChatSelect(conversation.id, otherParticipant.user);
    }
  };

  const formatLastMessageTime = (timestamp: string | null) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d`;
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getConversationDisplayName = (conversation: Conversation) => {
    if (conversation.type === "group") {
      return conversation.name || "Group Chat";
    }

    // For direct conversations, show the other user's name
    const otherParticipant = conversation.participants?.find(
      (p) => p.user_id !== currentUser?.id && p.is_active
    );

    return (
      otherParticipant?.user.display_name ||
      otherParticipant?.user.full_name ||
      otherParticipant?.user.username ||
      "Unknown User"
    );
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === "group") {
      return conversation.avatar_url || "/group-avatar.png";
    }

    // For direct conversations, show the other user's avatar
    const otherParticipant = conversation.participants?.find(
      (p) => p.user_id !== currentUser?.id && p.is_active
    );

    return otherParticipant?.user.avatar_url || "/avatar.png";
  };

  const isConversationUserOnline = (conversation: Conversation) => {
    if (conversation.type === "group") return false;

    const otherParticipant = conversation.participants?.find(
      (p) => p.user_id !== currentUser?.id && p.is_active
    );

    return otherParticipant
      ? onlineUsers.includes(otherParticipant.user_id)
      : false;
  };

  const getLastMessagePreview = (conversation: Conversation) => {
    if (!conversation.last_message) {
      const otherParticipant = conversation.participants?.find(
        (p) => p.user_id !== currentUser?.id && p.is_active
      );
      const isOnline = otherParticipant
        ? onlineUsers.includes(otherParticipant.user_id)
        : false;
      return isOnline ? "Online" : "No messages yet";
    }

    const message = conversation.last_message;
    if (!message.content) return "Message deleted";

    if (message.message_type === "image") return "📷 Image";
    if (message.message_type === "file") return "📎 File";

    return message.content;
  };

  if (isLoading && conversations.length === 0 && users.length === 0) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <p className="text-silver/40 academia-text">Loading conversations...</p>
      </div>
    );
  }

  // Show users if searching
  if (showAllUsers) {
    if (users.length === 0) {
      return (
        <div className="flex-1 flex justify-center items-center p-4">
          <div className="text-center">
            <p className="text-silver/40 academia-text">No users found</p>
            <p className="text-xs text-silver/30 mt-1 academia-text">
              Try a different search term
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 border-b border-[#8B0000]/30">
          <p className="text-xs text-silver/60 uppercase tracking-wide academia-text">
            Search Results ({users.length})
          </p>
        </div>
        {users.map((user) => {
          const isOnline = onlineUsers.includes(user.id);

          return (
            <button
              key={user.id}
              onClick={() => handleUserClick(user)}
              disabled={isLoading}
              className="w-full p-4 flex items-center space-x-3 hover:bg-[#8B0000]/20 transition-colors disabled:opacity-50"
            >
              <div className="relative">
                <img
                  src={user.avatar_url || "/avatar.png"}
                  alt={
                    user.display_name ||
                    user.full_name ||
                    user.username ||
                    "User"
                  }
                  className="w-12 h-12 rounded-full grayscale hover:grayscale-0 transition-all"
                />
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 rounded-full border-2 border-[#0a0505]" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="text-silver font-medium truncate academia-text">
                  {user.display_name ||
                    user.full_name ||
                    user.username ||
                    "User"}
                </h3>
                <p className="text-sm truncate text-silver/60 academia-text">
                  {user.bio || (isOnline ? "Online" : "Offline")}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Show conversations
  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="text-center">
          <p className="text-silver/40 mb-2 academia-text">
            No conversations yet
          </p>
          <p className="text-xs text-silver/30 academia-text">
            Search for users above to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-3 border-b border-[#8B0000]/30">
        <p className="text-xs text-silver/60 uppercase tracking-wide academia-text">
          Conversations ({conversations.length})
        </p>
      </div>
      {conversations.map((conversation) => {
        const isOnline = isConversationUserOnline(conversation);
        const displayName = getConversationDisplayName(conversation);
        const avatarUrl = getConversationAvatar(conversation);
        const lastMessagePreview = getLastMessagePreview(conversation);

        return (
          <button
            key={conversation.id}
            onClick={() => handleConversationClick(conversation)}
            className={`w-full p-4 flex items-center space-x-3 hover:bg-[#8B0000]/20 transition-colors ${
              activeChat === conversation.id ? "bg-[#8B0000]/30" : ""
            }`}
          >
            <div className="relative">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-12 h-12 rounded-full grayscale hover:grayscale-0 transition-all"
              />
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 rounded-full border-2 border-[#0a0505]" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-silver font-medium truncate academia-text">
                  {displayName}
                </h3>
                <span className="text-xs text-silver/50 whitespace-nowrap ml-2 academia-text">
                  {formatLastMessageTime(conversation.last_message_at)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm truncate text-silver/60 academia-text">
                  {lastMessagePreview}
                </p>
                <div className="flex items-center space-x-2">
                  {(conversation.unread_count ?? 0) > 0 && (
                    <span className="bg-amber-500 text-black text-xs font-medium px-2 py-1 rounded-full min-w-[20px] text-center">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MessageList;
