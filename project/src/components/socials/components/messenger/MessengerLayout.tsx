import React, { useState, useEffect } from "react";
import { MessageList } from "../messages/MessageList";
import { ChatWindow } from "../messages/ChatWindow";
import { ServerList } from "./ServerList";
import { Search, Plus, Link, Lock, Globe } from "lucide-react";
import messengerQueries, { Profile } from "../../lib/messengerQueries";
import { getCurrentUser } from "../../lib/socialMediaQueries";

export const MessengerLayout = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [serverPrivacy, setServerPrivacy] = useState<"public" | "private">(
    "private"
  );
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [inviteLink, setInviteLink] = useState("");

  // Initialize user and presence
  useEffect(() => {
    initializeUser();

    // Set up presence tracking
    const handleBeforeUnload = () => {
      messengerQueries.updateUserPresence(false, "offline");
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        messengerQueries.updateUserPresence(false, "away");
      } else {
        messengerQueries.updateUserPresence(true, "online");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Set user as online when component mounts
    messengerQueries.updateUserPresence(true, "online").catch(console.error);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // Set user as offline when component unmounts
      messengerQueries
        .updateUserPresence(false, "offline")
        .catch(console.error);
    };
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

  const handleChatSelect = (chatId: string, otherUser: Profile) => {
    setActiveChat(chatId);
    setActiveChatUser(otherUser);
  };

  const generateInviteLink = () => {
    const baseUrl = window.location.origin;
    const inviteCode = Math.random().toString(36).slice(2, 15);
    return `${baseUrl}/invite/${inviteCode}`;
  };

  const copyInviteLink = async () => {
    const link = generateInviteLink();
    setInviteLink(link);

    try {
      await navigator.clipboard.writeText(link);
      // You might want to show a toast notification here
      console.log("Invite link copied to clipboard");
    } catch (error) {
      console.error("Failed to copy invite link:", error);
      // Fallback: select the text
      const input = document.querySelector(
        "input[readonly]"
      ) as HTMLInputElement;
      if (input) {
        input.select();
        document.execCommand("copy");
      }
    }
  };

  const createNewGroup = async () => {
    // This would open a modal to create a new group
    // For now, just a placeholder
    console.log("Create new group functionality to be implemented");
  };

  if (!currentUser) {
    return (
      <div className="h-[calc(100vh-2rem)] max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-silver/60 academia-text">Loading messenger...</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-2rem)] max-w-7xl mx-auto">
      <div className="flex h-full bg-[#1a0f0f]/90 rounded-lg border border-[#8B0000]/30 academia-border">
        {/* Servers Sidebar */}
        <div className="w-20 border-r border-[#8B0000]/30 p-2 space-y-4 bg-[#0a0505]/80">
          <ServerList />
          <div className="space-y-2">
            <button
              onClick={createNewGroup}
              className="w-12 h-12 mx-auto flex items-center justify-center bg-[#8B0000]/10 hover:bg-[#8B0000]/20 rounded-full transition-colors border border-[#8B0000]/30"
              title="Create new group"
            >
              <Plus className="w-5 h-5 text-silver" />
            </button>
            <button
              onClick={() => {
                setInviteLink(generateInviteLink());
                setShowInviteModal(true);
              }}
              className="w-12 h-12 mx-auto flex items-center justify-center bg-[#8B0000]/10 hover:bg-[#8B0000]/20 rounded-full transition-colors border border-[#8B0000]/30"
              title="Generate invite link"
            >
              <Link className="w-5 h-5 text-silver" />
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="w-64 border-r border-[#8B0000]/30 bg-[#0a0505]/80">
          <div className="p-4 border-b border-[#8B0000]/30">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() =>
                  setServerPrivacy(
                    serverPrivacy === "public" ? "private" : "public"
                  )
                }
                className="flex items-center space-x-2 px-3 py-2 bg-[#8B0000]/10 rounded-lg hover:bg-[#8B0000]/20 transition-colors border border-[#8B0000]/30"
                title={`Switch to ${
                  serverPrivacy === "public" ? "private" : "public"
                } mode`}
              >
                {serverPrivacy === "public" ? (
                  <Globe className="w-4 h-4 text-silver" />
                ) : (
                  <Lock className="w-4 h-4 text-silver" />
                )}
                <span className="text-silver text-sm capitalize academia-text">
                  {serverPrivacy}
                </span>
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users or conversations..."
                className="w-full bg-[#8B0000]/10 border border-[#8B0000]/30 rounded-lg pl-10 pr-4 py-2 text-silver placeholder-silver/40 academia-text focus:outline-none focus:border-[#8B0000]/50"
              />
            </div>
          </div>
          <MessageList
            activeChat={activeChat}
            onChatSelect={handleChatSelect}
            searchQuery={searchQuery}
          />
        </div>

        {/* Chat Window */}
        {activeChat && activeChatUser ? (
          <ChatWindow
            conversationId={activeChat}
            otherUser={activeChatUser}
            isGroup={false} // This would need to be determined from conversation type
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-silver/40 bg-[#0a0505]/80 academia-text">
            <div className="text-center space-y-2">
              <p className="text-lg">Welcome to Messenger</p>
              <p className="text-sm">
                Select a conversation to start messaging
              </p>
              <p className="text-xs text-silver/30">
                Search for users above to start new conversations
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a0f0f]/95 rounded-lg p-6 w-full max-w-md border border-[#8B0000]/30 academia-border">
            <h3 className="text-xl text-silver academia-text mb-4">
              Invite People
            </h3>
            <p className="text-sm text-silver/60 mb-4 academia-text">
              Share this link with others to invite them to join
            </p>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 bg-[#8B0000]/10 border border-[#8B0000]/30 rounded-lg px-4 py-2 text-silver academia-text text-sm"
              />
              <button
                onClick={copyInviteLink}
                className="px-4 py-2 bg-[#8B0000]/20 text-silver border border-[#8B0000]/30 rounded-lg hover:bg-[#8B0000]/30 transition-colors academia-text"
              >
                Copy
              </button>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 bg-[#8B0000]/10 text-silver border border-[#8B0000]/30 rounded-lg hover:bg-[#8B0000]/20 transition-colors academia-text"
              >
                Close
              </button>
              <button
                onClick={() => {
                  copyInviteLink();
                  setShowInviteModal(false);
                }}
                className="flex-1 px-4 py-2 bg-[#8B0000]/30 text-silver border border-[#8B0000]/30 rounded-lg hover:bg-[#8B0000]/40 transition-colors academia-text"
              >
                Copy & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
