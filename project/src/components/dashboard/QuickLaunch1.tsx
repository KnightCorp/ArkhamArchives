import React, { useState, useEffect } from "react";
import {
  Brain,
  Eye,
  Terminal,
  Users,
  Briefcase,
  Swords,
  Radio,
  GraduationCap,
  Network,
  Scroll,
  Lock,
  Bell,
  Plus,
  Trash,
  Edit,
  Shield,
  ChevronRight,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import supabase from "../../lib/supabaseClient";

interface News {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "update" | "notification";
}

interface QuickLaunchProps {
  logout?: () => void;
}

const QuickLaunch: React.FC<QuickLaunchProps> = () => {
  const [showAddNews, setShowAddNews] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const { user, signOut } = useAuth();

  const [news, setNews] = useState<News[]>([
    {
      id: "1",
      title: "New AI Features Released",
      content: "We've added new AI capabilities to our app builder.",
      date: "2024-03-20",
      type: "update",
    },
    {
      id: "2",
      title: "System Maintenance",
      content: "Scheduled maintenance on March 25th.",
      date: "2024-03-22",
      type: "notification",
    },
  ]);

  const [newNewsItem, setNewNewsItem] = useState<Partial<News>>({
    title: "",
    content: "",
    type: "update",
  });

  // Check admin status from database
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) {
        setAdminLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.is_admin || false);
          console.log("Admin status:", data?.is_admin);
        }
      } catch (err) {
        console.error("Unexpected error checking admin status:", err);
        setIsAdmin(false);
      } finally {
        setAdminLoading(false);
      }
    };

    checkAdminStatus();
  }, [user?.id]);

  // Debug effect to check user and admin status
  useEffect(() => {
    console.log("Auth user in QuickLaunch:", user);
    console.log("Is admin status:", isAdmin);
    console.log("Admin loading:", adminLoading);
  }, [user, isAdmin, adminLoading]);

  // Handle logout with Supabase signOut
  const handleLogout = async () => {
    console.log("Logout clicked, calling signOut function");
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const tools = [
    { icon: Brain, name: "AI App Builder", path: "/ai-builder", locked: true },
    { icon: Eye, name: "AI Research", path: "/ai-research", locked: true },
    {
      icon: Terminal,
      name: "AI Playground",
      path: "/playground",
      locked: true,
    },
    { icon: Users, name: "Social Media", path: "/social", locked: false },
    { icon: Briefcase, name: "Freelancer", path: "/freelancer", locked: true },
    { icon: Swords, name: "Arkham Experience", path: "/arkham", locked: true },
    { icon: Radio, name: "Sound Manager", path: "/sound", locked: true },
    { icon: GraduationCap, name: "EdTech", path: "/edtech", locked: false },
    { icon: Network, name: "K-Protocol", path: "/protocol", locked: true },
    { icon: Scroll, name: "Careers", path: "/careers", locked: false },
  ];

  const handleAddNews = () => {
    if (newNewsItem.title && newNewsItem.content) {
      const newsItem: News = {
        id: Date.now().toString(),
        title: newNewsItem.title,
        content: newNewsItem.content,
        date: new Date().toISOString().split("T")[0],
        type: newNewsItem.type as "update" | "notification",
      };
      setNews([newsItem, ...news]);
      setNewNewsItem({ title: "", content: "", type: "update" });
      setShowAddNews(false);
    }
  };

  const handleEditNews = (newsItem: News) => {
    setEditingNews(newsItem);
    setNewNewsItem(newsItem);
    setShowAddNews(true);
  };

  const handleUpdateNews = () => {
    if (editingNews && newNewsItem.title && newNewsItem.content) {
      setNews(
        news.map((item) =>
          item.id === editingNews.id
            ? { ...(newNewsItem as News), id: item.id }
            : item
        )
      );
      setNewNewsItem({ title: "", content: "", type: "update" });
      setEditingNews(null);
      setShowAddNews(false);
    }
  };

  const handleDeleteNews = (id: string) => {
    setNews(news.filter((item) => item.id !== id));
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 pr-4">
        <div className="glass p-6 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Quick Launch</h2>
            <div className="flex gap-2">
              {/* Logout button */}
              <button
                className="flex gap-2 items-center bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded-lg"
                onClick={handleLogout}
              >
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Admin status indicator - only visible if user is admin */}
              {adminLoading ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 rounded-lg">
                  <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full" />
                  <span className="hidden sm:inline text-gray-300">
                    Checking...
                  </span>
                </div>
              ) : (
                isAdmin && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-lg">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="hidden sm:inline text-green-300">
                      Admin
                    </span>
                  </div>
                )
              )}

              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="cta-button bg-transparent"
              >
                {showSidebar ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronLeft className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <div key={tool.name} className="relative">
                {tool.locked ? (
                  <div
                    className="glass p-4 flex flex-col items-center justify-center text-center opacity-50 cursor-not-allowed group"
                    title="Coming Soon"
                  >
                    <tool.icon className="w-8 h-8 text-white mb-2" />
                    <span className="text-sm text-gray-300">{tool.name}</span>
                    <Lock className="w-4 h-4 text-white absolute top-2 right-2" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm">Coming Soon</span>
                    </div>
                  </div>
                ) : (
                  <a
                    href={tool.path}
                    className="glass p-4 flex flex-col items-center justify-center text-center
           hover:bg-white/5 transition-all duration-300 group"
                  >
                    <tool.icon className="w-8 h-8 text-white mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-gray-300 group-hover:text-white">
                      {tool.name}
                    </span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`glass bg-black/40 w-96 p-6 rounded-lg transition-all duration-300 transform ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        } fixed right-0 top-0 h-full`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Bell className="w-6 h-6 text-red-500 mr-3" />
            <h3 className="text-xl font-bold text-white">News & Updates</h3>
          </div>
          {!adminLoading && isAdmin && (
            <button
              onClick={() => {
                setEditingNews(null);
                setNewNewsItem({ title: "", content: "", type: "update" });
                setShowAddNews(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Add New
            </button>
          )}
        </div>

        {!adminLoading && isAdmin && showAddNews && (
          <div className="mb-6 space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={newNewsItem.title}
              onChange={(e) =>
                setNewNewsItem({ ...newNewsItem, title: e.target.value })
              }
              className="w-full p-2 bg-black/50 border border-white/10 rounded-lg"
            />
            <textarea
              placeholder="Content"
              value={newNewsItem.content}
              onChange={(e) =>
                setNewNewsItem({ ...newNewsItem, content: e.target.value })
              }
              className="w-full p-2 bg-black/50 border border-white/10 rounded-lg"
              rows={3}
            />
            <select
              value={newNewsItem.type}
              onChange={(e) =>
                setNewNewsItem({
                  ...newNewsItem,
                  type: e.target.value as "update" | "notification",
                })
              }
              className="w-full p-2 bg-black/50 border border-white/10 rounded-lg"
            >
              <option value="update">Update</option>
              <option value="notification">Notification</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={editingNews ? handleUpdateNews : handleAddNews}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                {editingNews ? "Update" : "Add"}
              </button>
              <button
                onClick={() => {
                  setShowAddNews(false);
                  setEditingNews(null);
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="h-[calc(100vh-180px)] overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item.id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <p className="text-sm text-gray-400">
                      {format(new Date(item.date), "MMM d, yyyy")}
                    </p>
                  </div>
                  {!adminLoading && isAdmin && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="p-1 hover:bg-red-900/20 rounded"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditNews(item)}
                        className="p-1 hover:bg-white/10 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-300">{item.content}</p>
                <span
                  className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                    item.type === "update"
                      ? "bg-blue-900/50 text-blue-200"
                      : "bg-yellow-900/50 text-yellow-200"
                  }`}
                >
                  {item.type === "update" ? "Update" : "Notification"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLaunch;
