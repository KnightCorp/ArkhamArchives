import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  ExternalLink,
  Clock,
  Trophy,
  Bell,
  Plus,
  Send,
  Users,
  TrendingUp,
  Star,
  BookOpen,
  Calendar,
  Award,
  Eye,
  ThumbsUp,
  Filter,
  Search,
  User,
  Bookmark,
  MoreHorizontal,
  Image,
  Link,
  Hash,
} from "lucide-react";
import { socialService, utilityService } from "./services/lmsService";

type PostType = "milestone" | "announcement" | "tips" | "general";

type Post = {
  id: string | number;
  teacher_id?: string | number;
  teacher_name?: string;
  type: PostType;
  content: string;
  created_at?: string;
  likes_count?: number;
  comments_count?: number;
  views_count?: number;
  // Add other fields as needed
};

const SocialFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState<{ content: string; type: PostType }>({
    content: "",
    type: "general",
  });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [commentInputs, setCommentInputs] = useState<
    Record<string | number, string>
  >({});
  const [showComments, setShowComments] = useState<
    Record<string | number, boolean>
  >({});
  const [likedPosts, setLikedPosts] = useState<Set<string | number>>(new Set());
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadSocialFeed();
  }, []);

  const loadSocialFeed = async () => {
    try {
      setLoading(true);
      const feedData = await socialService.getSocialFeed(20);
      setPosts(feedData);
    } catch (error) {
      console.error("Error loading social feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.content.trim()) {
      alert("Please enter some content for your post");
      return;
    }

    try {
      const success = await socialService.createPost({
        content: newPost.content,
        type: newPost.type,
      });

      if (success) {
        setNewPost({ content: "", type: "general" });
        setShowCreatePost(false);
        loadSocialFeed(); // Refresh feed
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  interface HandleLikeFn {
    (postId: string | number): Promise<void>;
  }

  interface ToggleLikeResponse {
    success: boolean;
  }

  const handleLike: HandleLikeFn = async (postId) => {
    try {
      const success: boolean = await socialService.toggleLike(String(postId));
      if (success) {
        // Update liked posts state
        setLikedPosts((prev: Set<string | number>) => {
          const newSet = new Set(prev);
          if (newSet.has(postId)) {
            newSet.delete(postId);
          } else {
            newSet.add(postId);
          }
          return newSet;
        });

        // Update posts with new like count
        setPosts((prev: Post[]) =>
          prev.map((post: Post) => {
            if (post.id === postId) {
              const isLiked = likedPosts.has(postId);
              return {
                ...post,
                likes_count: isLiked
                  ? (post.likes_count || 0) - 1
                  : (post.likes_count || 0) + 1,
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  interface HandleCommentFn {
    (postId: string | number, comment: string): Promise<void>;
  }

  const handleComment: HandleCommentFn = async (postId, comment) => {
    try {
      const success: boolean = await socialService.addComment(
        String(postId),
        comment
      );
      if (success) {
        // Optionally refresh comments or update UI here
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  interface CommentInputs {
    [postId: string]: string;
  }

  interface ShowComments {
    [postId: string]: boolean;
  }

  const handleCommentSubmit = (postId: string | number) => {
    const comment = (commentInputs as CommentInputs)[postId]?.trim();
    if (comment) {
      handleComment(postId, comment);
    }
  };

  interface ToggleCommentsFn {
    (postId: string | number): void;
  }

  const toggleComments: ToggleCommentsFn = (postId) => {
    setShowComments((prev: ShowComments) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  interface GetPostIconFn {
    (type: PostType): JSX.Element;
  }

  const getPostIcon: GetPostIconFn = (type) => {
    switch (type) {
      case "milestone":
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case "announcement":
        return <Bell className="w-5 h-5 text-blue-400" />;
      case "tips":
        return <Star className="w-5 h-5 text-green-400" />;
      default:
        return <MessageCircle className="w-5 h-5 text-white/60" />;
    }
  };

  interface GetPostTypeLabelFn {
    (type: PostType): string;
  }

  const getPostTypeLabel: GetPostTypeLabelFn = (type) => {
    switch (type) {
      case "milestone":
        return "MILESTONE";
      case "announcement":
        return "ANNOUNCEMENT";
      case "tips":
        return "TIPS & TRICKS";
      default:
        return "GENERAL";
    }
  };

  interface FormatDateFn {
    (date: string | number | Date | undefined): string;
  }

  const formatDate: FormatDateFn = (date) => {
    if (!date) return "N/A";

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "Invalid Date";

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return dateObj.toLocaleDateString();
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesFilter = activeFilter === "all" || post.type === activeFilter;
    const matchesSearch =
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.teacher_name &&
        post.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 font-mono">
                SOCIAL_FEED.EXE
              </h1>
              <p className="text-white/60">
                Connect with teachers and stay updated on the latest learning
                milestones
              </p>
            </div>
            <button
              onClick={() => setShowCreatePost(!showCreatePost)}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 border border-white/30 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>CREATE POST</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts or teachers..."
                className="w-full bg-black/50 border border-white/20 text-white pl-10 pr-4 py-3 focus:border-white focus:outline-none"
              />
            </div>
            <div className="flex space-x-2">
              {["all", "milestone", "announcement", "tips", "general"].map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 border text-sm transition-colors ${
                      activeFilter === filter
                        ? "bg-white/30 text-white border-white/50"
                        : "bg-black/30 text-white/70 border-white/20 hover:bg-white/20"
                    }`}
                  >
                    {filter.toUpperCase()}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Create Post Form */}
            {showCreatePost && (
              <div className="bg-black/50 border border-white/20 p-6 mb-6">
                <h3 className="text-white font-bold mb-4 flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  CREATE NEW POST
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Post Type
                    </label>
                    <select
                      value={newPost.type}
                      onChange={(e) =>
                        setNewPost((prev) => ({
                          ...prev,
                          type: e.target.value as PostType,
                        }))
                      }
                      className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 focus:border-white focus:outline-none"
                    >
                      <option value="general">General Update</option>
                      <option value="milestone">Milestone</option>
                      <option value="announcement">Announcement</option>
                      <option value="tips">Tips & Tricks</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Content
                    </label>
                    <textarea
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      placeholder="Share your thoughts, milestones, or announcements..."
                      rows={4}
                      className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 focus:border-white focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-white/40 text-sm">
                      <button className="flex items-center space-x-1 hover:text-white/60">
                        <Image className="w-4 h-4" />
                        <span>Add Image</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-white/60">
                        <Link className="w-4 h-4" />
                        <span>Add Link</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-white/60">
                        <Hash className="w-4 h-4" />
                        <span>Add Tags</span>
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowCreatePost(false)}
                        className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreatePost}
                        className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-6 py-2 border border-white/30 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        <span>POST</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <p className="text-white/60 mt-4">Loading feed...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="bg-black/50 border border-white/20 p-12 text-center">
                  <MessageCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-white/60 text-xl mb-2">No posts found</h3>
                  <p className="text-white/40">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Be the first to share something!"}
                  </p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-black/50 border border-white/20 hover:border-white/30 transition-colors"
                  >
                    {/* Post Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white/20 border border-white/30 flex items-center justify-center">
                            {getPostIcon(post.type)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-white font-bold">
                                {post.teacher_name ||
                                  `Teacher #${post.teacher_id}`}
                              </span>
                              <span className="px-2 py-1 bg-white/10 text-white/80 text-xs border border-white/20">
                                {getPostTypeLabel(post.type)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-white/60 text-sm">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(post.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button className="text-white/40 hover:text-white/60 transition-colors">
                            <Bookmark className="w-5 h-5" />
                          </button>
                          <button className="text-white/40 hover:text-white/60 transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                          {post.content}
                        </p>
                      </div>
                    </div>

                    {/* Interaction Bar */}
                    <div className="px-6 py-4 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-2 transition-colors ${
                              likedPosts.has(post.id)
                                ? "text-red-400"
                                : "text-white/60 hover:text-red-400"
                            }`}
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                likedPosts.has(post.id) ? "fill-current" : ""
                              }`}
                            />
                            <span className="text-sm">
                              {post.likes_count || 0}
                            </span>
                          </button>

                          <button
                            onClick={() => toggleComments(post.id)}
                            className="flex items-center space-x-2 text-white/60 hover:text-blue-400 transition-colors"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm">
                              {post.comments_count || 0}
                            </span>
                          </button>

                          <button className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors">
                            <Share className="w-5 h-5" />
                            <span className="text-sm">Share</span>
                          </button>
                        </div>

                        <div className="flex items-center space-x-4 text-white/40 text-sm">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views_count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {showComments[post.id] && (
                      <div className="px-6 pb-6 pt-0 border-t border-white/10 space-y-4">
                        {/* Add Comment */}
                        <div className="flex space-x-3">
                          <div className="w-8 h-8 bg-white/20 border border-white/30 flex items-center justify-center">
                            <User className="w-4 h-4 text-white/60" />
                          </div>
                          <div className="flex-1 flex space-x-2">
                            <input
                              type="text"
                              value={commentInputs[post.id] || ""}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({
                                  ...prev,
                                  [post.id]: e.target.value,
                                }))
                              }
                              onKeyPress={(e) =>
                                e.key === "Enter" &&
                                handleCommentSubmit(post.id)
                              }
                              className="flex-1 bg-black/50 border border-white/20 text-white px-3 py-2 text-sm focus:border-white focus:outline-none"
                              placeholder="Add a comment..."
                            />
                            <button
                              onClick={() => handleCommentSubmit(post.id)}
                              className="px-4 py-2 bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-colors text-sm"
                            >
                              POST
                            </button>
                          </div>
                        </div>

                        {/* Comments would be loaded here */}
                        <div className="text-white/40 text-sm text-center py-4">
                          Comments will appear here once loaded from the
                          database
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-black/50 border border-white/20 p-6">
              <h3 className="text-white font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                COMMUNITY STATS
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Active Teachers</span>
                  <span className="text-white font-mono">142</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Posts Today</span>
                  <span className="text-white font-mono">28</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">
                    Total Interactions
                  </span>
                  <span className="text-white font-mono">1,247</span>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-black/50 border border-white/20 p-6">
              <h3 className="text-white font-bold mb-4 flex items-center">
                <Hash className="w-5 h-5 mr-2" />
                TRENDING TOPICS
              </h3>
              <div className="space-y-2">
                {[
                  "#webdevelopment",
                  "#datascience",
                  "#machinelearning",
                  "#javascript",
                  "#python",
                ].map((tag) => (
                  <button
                    key={tag}
                    className="block w-full text-left text-white/70 hover:text-white text-sm py-1 hover:bg-white/5 px-2 -mx-2 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Teachers */}
            <div className="bg-black/50 border border-white/20 p-6">
              <h3 className="text-white font-bold mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                TOP TEACHERS
              </h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 border border-white/30 flex items-center justify-center">
                      <User className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-bold">
                        Teacher #{i}
                      </div>
                      <div className="text-white/60 text-xs">
                        4.9★ • 156 students
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;
