import { supabase } from "../../../lib/supabaseClient"; // Adjust import path as needed

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_online?: boolean;
  last_seen?: string;
  status?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  message_type: "text" | "image" | "file" | "system";
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  is_hidden: boolean;
  is_anonymous: boolean;
  reply_to_message_id: string | null;
  edited_at: string | null;
  created_at: string;
  sender?: Profile;
  reply_to_message?: Message;
}

export interface Conversation {
  id: string;
  type: "direct" | "group";
  name: string | null;
  description: string | null;
  avatar_url: string | null;
  is_private: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message_at: string | null;
  participants?: ConversationParticipant[];
  last_message?: Message;
  unread_count?: number;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  role: "admin" | "moderator" | "member";
  joined_at: string;
  left_at: string | null;
  is_active: boolean;
  last_read_at: string | null;
  user: Profile;
}

export interface UserPresence {
  user_id: string;
  is_online: boolean;
  last_seen: string;
  status: string | null;
}

class MessengerQueries {
  // Get all conversations for current user
  async getConversations() {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select(
          `
          *,
          participants:conversation_participants!inner(
            *,
            user:profiles(
              id,
              username,
              full_name,
              display_name,
              avatar_url,
              bio
            )
          ),
          last_message:messages(
            id,
            content,
            message_type,
            created_at,
            sender:profiles(
              id,
              username,
              full_name,
              display_name
            )
          )
        `
        )
        .eq("participants.is_active", true)
        .order("last_message_at", { ascending: false, nullsFirst: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        throw error;
      }

      // Get unread counts for each conversation
      const conversationsWithUnread = await Promise.all(
        (data || []).map(async (conv) => {
          try {
            const unreadCount = await this.getUnreadMessageCount(conv.id);
            return {
              ...conv,
              unread_count: unreadCount,
            };
          } catch (err) {
            console.error(
              `Error getting unread count for conversation ${conv.id}:`,
              err
            );
            return {
              ...conv,
              unread_count: 0,
            };
          }
        })
      );

      return conversationsWithUnread;
    } catch (error) {
      console.error("getConversations error:", error);
      throw error;
    }
  }

  // Get or create direct conversation between current user and another user
  async getOrCreateDirectConversation(otherUserId: string) {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error("Not authenticated");

      const { data, error } = await supabase.rpc(
        "get_or_create_direct_conversation",
        {
          user1_id: currentUser.user.id,
          user2_id: otherUserId,
        }
      );

      if (error) {
        console.error("Error in getOrCreateDirectConversation:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("getOrCreateDirectConversation error:", error);
      throw error;
    }
  }

  // Get messages for a conversation
  async getMessages(conversationId: string, page = 0, limit = 50) {
    try {
      const offset = page * limit;

      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:profiles(
            id,
            username,
            full_name,
            display_name,
            avatar_url
          ),
          reply_to_message:messages(
            id,
            content,
            sender:profiles(
              id,
              username,
              full_name,
              display_name
            )
          )
        `
        )
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }
      return (data || []).reverse(); // Reverse to show oldest first
    } catch (error) {
      console.error("getMessages error:", error);
      throw error;
    }
  }

  // Send a message
  async sendMessage({
    conversationId,
    content,
    messageType = "text",
    fileUrl = null,
    fileName = null,
    fileSize = null,
    isHidden = false,
    isAnonymous = false,
    replyToMessageId = null,
  }: {
    conversationId: string;
    content?: string;
    messageType?: "text" | "image" | "file" | "system";
    fileUrl?: string | null;
    fileName?: string | null;
    fileSize?: number | null;
    isHidden?: boolean;
    isAnonymous?: boolean;
    replyToMessageId?: string | null;
  }) {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: currentUser.user.id,
          content,
          message_type: messageType,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          is_hidden: isHidden,
          is_anonymous: isAnonymous,
          reply_to_message_id: replyToMessageId,
        })
        .select(
          `
          *,
          sender:profiles(
            id,
            username,
            full_name,
            display_name,
            avatar_url
          )
        `
        )
        .single();

      if (error) {
        console.error("Error sending message:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("sendMessage error:", error);
      throw error;
    }
  }

  async getUsers(searchQuery = "", limit = 20) {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error("Not authenticated");

      let query = supabase
        .from("profiles")
        .select(
          `
        id,
        username,
        full_name,
        display_name,
        avatar_url,
        bio,
        user_presence(
          is_online,
          last_seen,
          status
        )
      `
        )
        .neq("id", currentUser.user.id)
        .limit(limit);

      if (searchQuery) {
        query = query.or(
          `username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }

      return (data || []).map((user) => ({
        ...user,
        is_online: user.user_presence?.[0]?.is_online || false,
        last_seen: user.user_presence?.[0]?.last_seen,
        status: user.user_presence?.[0]?.status,
      }));
    } catch (error) {
      console.error("getUsers error:", error);
      throw error;
    }
  }

  // Get online users
  async getOnlineUsers() {
    try {
      const { data, error } = await supabase
        .from("user_presence")
        .select(
          `
          user_id,
          is_online,
          last_seen,
          status,
          user:profiles(
            id,
            username,
            full_name,
            display_name,
            avatar_url
          )
        `
        )
        .eq("is_online", true);

      if (error) {
        console.error("Error fetching online users:", error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error("getOnlineUsers error:", error);
      throw error;
    }
  }

  // Update user presence - improved error handling
  async updateUserPresence(isOnline: boolean, status = "online") {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        console.error("User not authenticated for presence update");
        throw new Error("Not authenticated");
      }

      console.log(`Updating presence for user ${currentUser.user.id}:`, {
        isOnline,
        status,
      });

      const { data, error } = await supabase.from("user_presence").upsert(
        {
          user_id: currentUser.user.id,
          is_online: isOnline,
          status,
          last_seen: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

      if (error) {
        console.error("Error updating user presence:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }

      console.log("Presence updated successfully:", data);
      return data;
    } catch (error) {
      console.error("updateUserPresence error:", error);
      throw error;
    }
  }

  // Mark messages as read
  async markMessagesAsRead(conversationId: string) {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error("Not authenticated");

      // Get all unread messages in the conversation
      const { data: messages, error: messagesError } = await supabase
        .from("messages")
        .select("id")
        .eq("conversation_id", conversationId)
        .neq("sender_id", currentUser.user.id);

      if (messagesError) {
        console.error(
          "Error fetching messages for read status:",
          messagesError
        );
        throw messagesError;
      }

      if (!messages || messages.length === 0) return;

      // Mark them as read
      const readStatuses = messages.map((msg) => ({
        message_id: msg.id,
        user_id: currentUser.user.id,
      }));

      const { error } = await supabase
        .from("message_read_status")
        .upsert(readStatuses, { onConflict: "message_id,user_id" });

      if (error) {
        console.error("Error marking messages as read:", error);
        throw error;
      }

      // Update participant's last_read_at
      const { error: participantError } = await supabase
        .from("conversation_participants")
        .update({ last_read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .eq("user_id", currentUser.user.id);

      if (participantError) {
        console.error(
          "Error updating participant read time:",
          participantError
        );
      }
    } catch (error) {
      console.error("markMessagesAsRead error:", error);
      throw error;
    }
  }

  // Get unread message count for a conversation
  async getUnreadMessageCount(conversationId: string) {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error("Not authenticated");

      // Get user's last read timestamp
      const { data: participant } = await supabase
        .from("conversation_participants")
        .select("last_read_at")
        .eq("conversation_id", conversationId)
        .eq("user_id", currentUser.user.id)
        .single();

      if (!participant) return 0;

      // Count messages sent after last read time by other users
      let query = supabase
        .from("messages")
        .select("id", { count: "exact" })
        .eq("conversation_id", conversationId)
        .neq("sender_id", currentUser.user.id);

      if (participant.last_read_at) {
        query = query.gt("created_at", participant.last_read_at);
      }

      const { count, error } = await query;
      if (error) {
        console.error("Error getting unread count:", error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error("getUnreadMessageCount error:", error);
      return 0; // Return 0 on error to avoid breaking the UI
    }
  }

  // Create group conversation
  async createGroupConversation({
    name,
    description,
    isPrivate = true,
    participantIds,
  }: {
    name: string;
    description?: string;
    isPrivate?: boolean;
    participantIds: string[];
  }) {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error("Not authenticated");

      // Create conversation
      const { data: conversation, error: conversationError } = await supabase
        .from("conversations")
        .insert({
          type: "group",
          name,
          description,
          is_private: isPrivate,
          created_by: currentUser.user.id,
        })
        .select()
        .single();

      if (conversationError) {
        console.error("Error creating group conversation:", conversationError);
        throw conversationError;
      }

      // Add creator as admin
      const participants = [
        {
          conversation_id: conversation.id,
          user_id: currentUser.user.id,
          role: "admin",
        },
        // Add other participants as members
        ...participantIds.map((userId) => ({
          conversation_id: conversation.id,
          user_id: userId,
          role: "member",
        })),
      ];

      const { error: participantsError } = await supabase
        .from("conversation_participants")
        .insert(participants);

      if (participantsError) {
        console.error("Error adding participants:", participantsError);
        throw participantsError;
      }

      return conversation;
    } catch (error) {
      console.error("createGroupConversation error:", error);
      throw error;
    }
  }

  // Subscribe to real-time messages for a conversation
  subscribeToMessages(
    conversationId: string,
    callback: (message: Message) => void
  ) {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          try {
            // Fetch the full message with sender info
            const { data } = await supabase
              .from("messages")
              .select(
                `
                *,
                sender:profiles(
                  id,
                  username,
                  full_name,
                  display_name,
                  avatar_url
                )
              `
              )
              .eq(
                "id",
                typeof payload.new === "object" &&
                  payload.new !== null &&
                  "id" in payload.new
                  ? (payload.new as { id: string }).id
                  : ""
              )
              .single();

            if (data) {
              callback(data);
            }
          } catch (error) {
            console.error("Error in message subscription:", error);
          }
        }
      )
      .subscribe();
  }

  // Subscribe to user presence changes
  subscribeToPresence(callback: (presence: UserPresence) => void) {
    return supabase
      .channel("user_presence")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_presence",
        },
        (payload) => {
          try {
            callback(payload.new as UserPresence);
          } catch (error) {
            console.error("Error in presence subscription:", error);
          }
        }
      )
      .subscribe();
  }

  // Subscribe to conversation changes
  subscribeToConversations(callback: (conversation: Conversation) => void) {
    return supabase
      .channel("conversations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        async (payload) => {
          try {
            // Fetch full conversation data
            const { data } = await supabase
              .from("conversations")
              .select(
                `
                *,
                participants:conversation_participants!inner(
                  *,
                  user:profiles(
                    id,
                    username,
                    full_name,
                    display_name,
                    avatar_url,
                    bio
                  )
                )
              `
              )
              .eq(
                "id",
                typeof payload.new === "object" &&
                  payload.new !== null &&
                  "id" in payload.new
                  ? (payload.new as { id: string }).id
                  : ""
              )
              .single();

            if (data) {
              callback(data);
            }
          } catch (error) {
            console.error("Error in conversations subscription:", error);
          }
        }
      )
      .subscribe();
  }

  // Add user to group conversation
  async addUserToConversation(
    conversationId: string,
    userId: string,
    role = "member"
  ) {
    try {
      const { error } = await supabase
        .from("conversation_participants")
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          role,
        });

      if (error) {
        console.error("Error adding user to conversation:", error);
        throw error;
      }
    } catch (error) {
      console.error("addUserToConversation error:", error);
      throw error;
    }
  }

  // Remove user from conversation
  async removeUserFromConversation(conversationId: string, userId: string) {
    try {
      const { error } = await supabase
        .from("conversation_participants")
        .update({ is_active: false, left_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .eq("user_id", userId);

      if (error) {
        console.error("Error removing user from conversation:", error);
        throw error;
      }
    } catch (error) {
      console.error("removeUserFromConversation error:", error);
      throw error;
    }
  }

  // Delete message (soft delete by setting content to null)
  async deleteMessage(messageId: string) {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("messages")
        .update({ content: null, edited_at: new Date().toISOString() })
        .eq("id", messageId)
        .eq("sender_id", currentUser.user.id);

      if (error) {
        console.error("Error deleting message:", error);
        throw error;
      }
    } catch (error) {
      console.error("deleteMessage error:", error);
      throw error;
    }
  }

  // Edit message
  async editMessage(messageId: string, newContent: string) {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("messages")
        .update({ content: newContent, edited_at: new Date().toISOString() })
        .eq("id", messageId)
        .eq("sender_id", currentUser.user.id);

      if (error) {
        console.error("Error editing message:", error);
        throw error;
      }
    } catch (error) {
      console.error("editMessage error:", error);
      throw error;
    }
  }

  // React to message
  async reactToMessage(messageId: string, emoji: string) {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("message_reactions").upsert(
        {
          message_id: messageId,
          user_id: currentUser.user.id,
          emoji,
        },
        { onConflict: "message_id,user_id,emoji" }
      );

      if (error) {
        console.error("Error reacting to message:", error);
        throw error;
      }
    } catch (error) {
      console.error("reactToMessage error:", error);
      throw error;
    }
  }

  // Remove reaction
  async removeReaction(messageId: string, emoji: string) {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("message_reactions")
        .delete()
        .eq("message_id", messageId)
        .eq("user_id", currentUser.user.id)
        .eq("emoji", emoji);

      if (error) {
        console.error("Error removing reaction:", error);
        throw error;
      }
    } catch (error) {
      console.error("removeReaction error:", error);
      throw error;
    }
  }

  // Initialize user presence when app starts
  async initializePresence() {
    try {
      await this.updateUserPresence(true, "online");
    } catch (error) {
      console.error("Error initializing presence:", error);
      // Don't throw here - presence is not critical for app functionality
    }
  }

  // Cleanup presence when app closes/user logs out
  async cleanupPresence() {
    try {
      await this.updateUserPresence(false, "offline");
    } catch (error) {
      console.error("Error cleaning up presence:", error);
      // Don't throw here - it's a cleanup operation
    }
  }

  // Check if user has permission to perform action in conversation
  async checkConversationPermission(
    conversationId: string,
    requiredRole?: string
  ) {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("conversation_participants")
        .select("role, is_active")
        .eq("conversation_id", conversationId)
        .eq("user_id", currentUser.user.id)
        .single();

      if (error) {
        console.error("Error checking conversation permission:", error);
        return false;
      }

      if (!data || !data.is_active) {
        return false;
      }

      if (requiredRole) {
        const roleHierarchy = { admin: 3, moderator: 2, member: 1 };
        const userLevel =
          roleHierarchy[data.role as keyof typeof roleHierarchy] || 0;
        const requiredLevel =
          roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
        return userLevel >= requiredLevel;
      }

      return true;
    } catch (error) {
      console.error("checkConversationPermission error:", error);
      return false;
    }
  }

  // Get conversation details
  async getConversationDetails(conversationId: string) {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select(
          `
          *,
          participants:conversation_participants(
            *,
            user:profiles(
              id,
              username,
              full_name,
              display_name,
              avatar_url,
              bio
            )
          )
        `
        )
        .eq("id", conversationId)
        .eq("participants.is_active", true)
        .single();

      if (error) {
        console.error("Error fetching conversation details:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("getConversationDetails error:", error);
      throw error;
    }
  }

  // Search messages in a conversation
  async searchMessages(
    conversationId: string,
    searchQuery: string,
    limit = 20
  ) {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:profiles(
            id,
            username,
            full_name,
            display_name,
            avatar_url
          )
        `
        )
        .eq("conversation_id", conversationId)
        .textSearch("content", searchQuery)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error searching messages:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("searchMessages error:", error);
      throw error;
    }
  }
}

const messengerQueries = new MessengerQueries();
export default messengerQueries;
