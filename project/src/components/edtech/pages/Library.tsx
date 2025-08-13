import React, { useState, useEffect } from "react";
import {
  Search,
  Play,
  Book,
  Film,
  Music,
  Heart,
  Eye,
  Clock,
  Star,
  Users,
  X,
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import supabase from "../../../lib/supabaseClient";
import toast from "react-hot-toast";
import {
  cloudinaryUploader,
  type CloudinaryUploadResult,
  type UploadProgress,
} from "../../../services/cloudinaryUploadService";

interface ContentItem {
  id: string;
  title: string;
  type: "video" | "audio";
  duration: string;
  thumbnail?: string; // OPTIONAL
  instructor: string;
  department: string;
  views: number;
  rating: number;
  description?: string; // OPTIONAL
  tags: string[]; // OPTIONAL (defaults to empty array)
  preview_url?: string; // OPTIONAL
  video_url?: string; // OPTIONAL
  file_path?: string; // OPTIONAL - for uploaded files
  file_size?: number; // OPTIONAL
  file_type?: string; // OPTIONAL
  is_featured?: boolean; // OPTIONAL (defaults to false)
  is_popular?: boolean; // OPTIONAL (defaults to false)
  is_new_arrival?: boolean; // OPTIONAL (defaults to false)
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

interface ContentFormData {
  title: string;
  type: "video" | "audio";
  duration: string;
  thumbnail: string;
  instructor: string;
  department: string;
  description: string;
  tags: string;
  preview_url: string;
  video_url: string;
  is_featured: boolean;
  is_popular: boolean;
  is_new_arrival: boolean;
  // File upload fields
  content_file?: File | null;
  thumbnail_file?: File | null;
  preview_file?: File | null;
}

interface Category {
  id: string;
  label: string;
  icon: typeof Book;
}

const Library: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any>(null);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(
    null
  );
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: UploadProgress;
  }>({});
  const [formData, setFormData] = useState<ContentFormData>({
    title: "",
    type: "video",
    duration: "",
    thumbnail: "",
    instructor: "",
    department: "",
    description: "",
    tags: "",
    preview_url: "",
    video_url: "",
    is_featured: false,
    is_popular: false,
    is_new_arrival: false,
    content_file: null,
    thumbnail_file: null,
    preview_file: null,
  });

  const location = useLocation();

  console.log("Current location:", location.pathname);

  // Supabase helper functions
  const fetchAllContent = async () => {
    try {
      const { data, error } = await supabase
        .from("content_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching content:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in fetchAllContent:", error);
      return [];
    }
  };

  const fetchUserFavorites = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_favorites")
        .select("content_id")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching user favorites:", error);
        return [];
      }

      return data?.map((fav) => fav.content_id) || [];
    } catch (error) {
      console.error("Error in fetchUserFavorites:", error);
      return [];
    }
  };

  const addToFavorites = async (contentId: string) => {
    if (!user) {
      toast.error("Please log in to add favorites");
      return;
    }

    try {
      const { error } = await supabase
        .from("user_favorites")
        .insert({ user_id: user.id, content_id: contentId });

      if (error) {
        console.error("Error adding to favorites:", error);
        toast.error("Failed to add to favorites");
        return;
      }

      setUserFavorites((prev) => [...prev, contentId]);
      toast.success("Added to favorites!");
    } catch (error) {
      console.error("Error in addToFavorites:", error);
      toast.error("Failed to add to favorites");
    }
  };

  const removeFromFavorites = async (contentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("content_id", contentId);

      if (error) {
        console.error("Error removing from favorites:", error);
        toast.error("Failed to remove from favorites");
        return;
      }

      setUserFavorites((prev) => prev.filter((id) => id !== contentId));
      toast.success("Removed from favorites!");
    } catch (error) {
      console.error("Error in removeFromFavorites:", error);
      toast.error("Failed to remove from favorites");
    }
  };

  const recordView = async (contentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("content_views")
        .insert({ user_id: user.id, content_id: contentId });

      if (error) {
        console.error("Error recording view:", error);
      }
    } catch (error) {
      console.error("Error in recordView:", error);
    }
  };

  const createContent = async (data: ContentFormData) => {
    if (!user) {
      toast.error("Please log in to create content");
      return;
    }

    try {
      console.log("Form data being submitted:", data);

      let thumbnailUrl = data.thumbnail;
      let videoUrl = data.video_url;
      let previewUrl = data.preview_url;
      let filePath = null;
      let fileSize = null;
      let fileType = null;

      console.log("Initial video URL:", videoUrl);

      // Upload thumbnail file if provided
      if (data.thumbnail_file) {
        const result = await uploadFileToCloudinary(
          data.thumbnail_file,
          "image"
        );
        if (result) {
          thumbnailUrl = result.secure_url;
        }
      }

      // Upload main content file if provided
      if (data.content_file) {
        const contentType = data.content_file.type.startsWith("video/")
          ? "video"
          : "audio";
        const result = await uploadFileToCloudinary(
          data.content_file,
          contentType
        );
        if (result) {
          videoUrl = result.secure_url;
          filePath = result.public_id;
          fileSize = result.bytes;
          fileType = result.format;

          // Auto-generate thumbnail from video if no thumbnail provided
          if (!thumbnailUrl && contentType === "video" && result.public_id) {
            thumbnailUrl = cloudinaryUploader.generateThumbnailUrl(
              result.public_id
            );
          }
        }
      }

      // Upload preview file if provided
      if (data.preview_file) {
        const previewType = data.preview_file.type.startsWith("video/")
          ? "video"
          : "audio";
        const result = await uploadFileToCloudinary(
          data.preview_file,
          previewType
        );
        if (result) {
          previewUrl = result.secure_url;
        }
      }

      console.log("Final video URL before saving:", videoUrl);

      const { error } = await supabase.from("content_items").insert({
        title: data.title,
        type: data.type,
        duration: data.duration,
        thumbnail: thumbnailUrl || null,
        instructor: data.instructor,
        department: data.department,
        description: data.description || null,
        tags: data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        preview_url: previewUrl || null,
        video_url: videoUrl || null,
        file_path: filePath,
        file_size: fileSize,
        file_type: fileType,
        is_featured: data.is_featured,
        is_popular: data.is_popular,
        is_new_arrival: data.is_new_arrival,
        created_by: user.id,
      });

      if (error) {
        console.error("Error creating content:", error);
        toast.error("Failed to create content");
        return;
      }

      toast.success("Content created successfully!");
      setShowAddForm(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Error in createContent:", error);
      toast.error("Failed to create content");
    }
  };

  const updateContent = async (id: string, data: ContentFormData) => {
    if (!user) {
      toast.error("Please log in to update content");
      return;
    }

    try {
      let thumbnailUrl = data.thumbnail;
      let videoUrl = data.video_url;
      let previewUrl = data.preview_url;
      let filePath = null;
      let fileSize = null;
      let fileType = null;

      // Upload new thumbnail if file provided
      if (data.thumbnail_file) {
        const result = await uploadFileToCloudinary(
          data.thumbnail_file,
          "image"
        );
        if (result) {
          thumbnailUrl = result.secure_url;
        }
      }

      // Upload new content file if provided
      if (data.content_file) {
        const contentType = data.content_file.type.startsWith("video/")
          ? "video"
          : "audio";
        const result = await uploadFileToCloudinary(
          data.content_file,
          contentType
        );
        if (result) {
          videoUrl = result.secure_url;
          filePath = result.public_id;
          fileSize = result.bytes;
          fileType = result.format;

          // Auto-generate thumbnail from video if no thumbnail provided
          if (!thumbnailUrl && contentType === "video" && result.public_id) {
            thumbnailUrl = cloudinaryUploader.generateThumbnailUrl(
              result.public_id
            );
          }
        }
      }

      // Upload new preview file if provided
      if (data.preview_file) {
        const previewType = data.preview_file.type.startsWith("video/")
          ? "video"
          : "audio";
        const result = await uploadFileToCloudinary(
          data.preview_file,
          previewType
        );
        if (result) {
          previewUrl = result.secure_url;
        }
      }

      const updateData: any = {
        title: data.title,
        type: data.type,
        duration: data.duration,
        instructor: data.instructor,
        department: data.department,
        description: data.description || null,
        tags: data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        is_featured: data.is_featured,
        is_popular: data.is_popular,
        is_new_arrival: data.is_new_arrival,
        updated_at: new Date().toISOString(),
      };

      // Only update URLs if new files were uploaded or URLs were changed
      if (thumbnailUrl !== data.thumbnail)
        updateData.thumbnail = thumbnailUrl || null;
      if (videoUrl !== data.video_url) updateData.video_url = videoUrl || null;
      if (previewUrl !== data.preview_url)
        updateData.preview_url = previewUrl || null;
      if (filePath) {
        updateData.file_path = filePath;
        updateData.file_size = fileSize;
        updateData.file_type = fileType;
      }

      const { error } = await supabase
        .from("content_items")
        .update(updateData)
        .eq("id", id)
        .eq("created_by", user.id);

      if (error) {
        console.error("Error updating content:", error);
        toast.error("Failed to update content");
        return;
      }

      toast.success("Content updated successfully!");
      setEditingContent(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Error in updateContent:", error);
      toast.error("Failed to update content");
    }
  };

  const deleteContent = async (id: string) => {
    if (!user) {
      toast.error("Please log in to delete content");
      return;
    }

    if (!confirm("Are you sure you want to delete this content?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("content_items")
        .delete()
        .eq("id", id)
        .eq("created_by", user.id);

      if (error) {
        console.error("Error deleting content:", error);
        toast.error("Failed to delete content");
        return;
      }

      toast.success("Content deleted successfully!");
      loadData();
    } catch (error) {
      console.error("Error in deleteContent:", error);
      toast.error("Failed to delete content");
    }
  };

  // Cloudinary upload helper function
  const uploadFileToCloudinary = async (
    file: File,
    type: "video" | "audio" | "image"
  ): Promise<CloudinaryUploadResult | null> => {
    if (!user) return null;

    try {
      console.log("🚀 Starting Cloudinary upload:", {
        name: file.name,
        type: file.type,
        size: file.size,
        uploadType: type,
      });

      // Validate file before upload
      const validation = cloudinaryUploader.validateFile(file, type);
      if (!validation.valid) {
        alert(validation.error);
        return null;
      }

      // Track upload progress
      const progressKey = file.name;
      setUploadProgress((prev) => ({
        ...prev,
        [progressKey]: { loaded: 0, total: file.size, percentage: 0 },
      }));

      // Upload to Cloudinary with progress tracking
      const result = await cloudinaryUploader.uploadFile(
        file,
        type,
        (progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [progressKey]: progress,
          }));
        }
      );

      console.log("✅ Cloudinary upload successful:", result);

      // Clear progress tracking
      setUploadProgress((prev) => {
        const updated = { ...prev };
        delete updated[progressKey];
        return updated;
      });

      return result;
    } catch (error) {
      console.error("❌ Cloudinary upload failed:", error);
      alert(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );

      // Clear progress tracking on error
      setUploadProgress((prev) => {
        const updated = { ...prev };
        delete updated[file.name];
        return updated;
      });

      return null;
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "video",
      duration: "",
      thumbnail: "",
      instructor: "",
      department: "",
      description: "",
      tags: "",
      preview_url: "",
      video_url: "",
      is_featured: false,
      is_popular: false,
      is_new_arrival: false,
      content_file: null,
      thumbnail_file: null,
      preview_file: null,
    });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const content = await fetchAllContent();
      setAllContent(content);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const favorites = await fetchUserFavorites(user.id);
        setUserFavorites(favorites);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleContentClick = (content: ContentItem) => {
    setSelectedContent(content);
    setIsPlaying(false); // Reset playing state when selecting new content
    setVideoUrl(""); // Reset processed video URL
    recordView(content.id);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContent) {
      updateContent(editingContent.id, formData);
    } else {
      createContent(formData);
    }
  };

  const startEdit = (content: ContentItem) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      type: content.type,
      duration: content.duration,
      thumbnail: content.thumbnail || "",
      instructor: content.instructor,
      department: content.department,
      description: content.description || "",
      tags: content.tags.join(", "),
      preview_url: content.preview_url || "",
      video_url: content.video_url || "",
      is_featured: content.is_featured || false,
      is_popular: content.is_popular || false,
      is_new_arrival: content.is_new_arrival || false,
      content_file: null,
      thumbnail_file: null,
      preview_file: null,
    });
    setShowAddForm(true);
  };

  // Filter content based on search and category
  const filteredContent = allContent.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      activeCategory === "all" || content.type === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredContent = filteredContent.filter(
    (content) => content.is_featured
  );
  const newArrivals = filteredContent.filter(
    (content) => content.is_new_arrival
  );
  const popularContent = filteredContent.filter(
    (content) => content.is_popular
  );

  // Content that doesn't belong to any special category
  const generalContent = filteredContent.filter(
    (content) =>
      !content.is_featured && !content.is_new_arrival && !content.is_popular
  );

  const categories: Category[] = [
    { id: "all", label: "All Content", icon: Book },
    { id: "video", label: "Video Lectures", icon: Film },
    { id: "audio", label: "Audio Content", icon: Music },
  ];

  const handleModalClose = () => {
    setSelectedContent(null);
    setIsPlaying(false); // Reset playing state when closing modal
    setVideoUrl(""); // Reset processed video URL
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  const validateSupabaseFile = async (videoUrl: string) => {
    if (
      !videoUrl.includes(
        "supabase.co/storage/v1/object/public/content-uploads/"
      )
    ) {
      return {
        valid: true,
        message: "Not a Supabase Storage URL - skipping validation",
      };
    }

    try {
      // Extract file path from URL
      const urlParts = videoUrl.split(
        "/storage/v1/object/public/content-uploads/"
      );
      if (urlParts.length !== 2) {
        return { valid: false, message: "Invalid Supabase Storage URL format" };
      }

      const filePath = urlParts[1];
      console.log("Checking file path:", filePath);

      // Check if file exists in storage
      const { data, error } = await supabase.storage
        .from("content-uploads")
        .list(filePath.substring(0, filePath.lastIndexOf("/")), {
          search: filePath.substring(filePath.lastIndexOf("/") + 1),
        });

      if (error) {
        console.error("Storage list error:", error);
        return { valid: false, message: `Storage error: ${error.message}` };
      }

      if (!data || data.length === 0) {
        return { valid: false, message: "File not found in Supabase Storage" };
      }

      const fileInfo = data[0];
      console.log("File info from storage:", fileInfo);

      // Check file properties
      if (fileInfo.metadata) {
        console.log("File metadata:", fileInfo.metadata);
        console.log("File size:", fileInfo.metadata.size);
        console.log("File type:", fileInfo.metadata.mimetype);

        // Validate MIME type
        const validVideoTypes = [
          "video/mp4",
          "video/webm",
          "video/ogg",
          "video/avi",
          "video/mov",
          "video/quicktime",
        ];
        if (
          fileInfo.metadata.mimetype &&
          !validVideoTypes.includes(fileInfo.metadata.mimetype)
        ) {
          return {
            valid: false,
            message: `Unsupported video format: ${fileInfo.metadata.mimetype}. Use MP4, WebM, or OGG.`,
          };
        }
      }

      return { valid: true, message: "File exists and appears valid" };
    } catch (error) {
      console.error("Error validating file:", error);
      return { valid: false, message: `Validation error: ${error}` };
    }
  };

  // Cache-busting function for video URLs (not needed for Cloudinary)
  const getVideoUrlWithCacheBust = (url: string) => {
    // Cloudinary handles caching automatically, but keep function for compatibility
    return url;
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-serif">Loading Dark Archives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black z-50">
      {/* Smoke Effect Background */}
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1557683311-eeb2f49a8532?w=1920')] bg-cover bg-center opacity-5">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 space-y-4 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-serif text-white tracking-wider">
              Dark Archives
            </h1>
            <p className="text-white/60 font-serif italic">
              Where knowledge dwells in eternal twilight
            </p>
          </div>
          {user && (
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setEditingContent(null);
                  resetForm();
                }}
                className="px-6 py-3 bg-white/10 border border-white/30 rounded-lg text-white hover:bg-white/20 transition-all flex items-center space-x-2 font-serif"
              >
                <Plus className="w-5 h-5" />
                <span>Add Content</span>
              </button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex space-x-4 mb-12">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search the darkness..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/50 transition-all font-serif"
            />
            <div className="absolute inset-0 shadow-[0_0_15px_rgba(192,192,192,0.1)] opacity-0 group-hover:opacity-100 pointer-events-none rounded-lg transition-opacity" />
          </div>
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 border rounded-lg transition-all flex items-center space-x-2 font-serif ${
                  activeCategory === category.id
                    ? "bg-white/20 border-white/50 text-white"
                    : "bg-black/50 border-white/30 text-white/70 hover:bg-white/10"
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Content */}
        {featuredContent.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-serif text-white mb-8">
              Featured in the Shadows
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredContent.map((content) => (
                <div
                  key={content.id}
                  onClick={() => handleContentClick(content)}
                  className="group cursor-pointer"
                >
                  <div className="relative bg-black/60 rounded-lg overflow-hidden border border-white/20 transition-all hover:border-white/40">
                    <div className="relative aspect-video">
                      <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-16 h-16 rounded-full bg-white/20 border border-white/40 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-white transform translate-x-0.5" />
                        </button>
                      </div>
                      <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 rounded-full text-sm text-white font-serif">
                        {content.duration}
                      </div>
                      {user && content.created_by === user.id && (
                        <div className="absolute top-4 right-4 flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(content);
                            }}
                            className="w-8 h-8 rounded-full bg-black/70 border border-white/40 flex items-center justify-center text-white hover:bg-white/20"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteContent(content.id);
                            }}
                            className="w-8 h-8 rounded-full bg-black/70 border border-red-400/40 flex items-center justify-center text-red-400 hover:bg-red-400/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl text-white font-serif mb-2">
                        {content.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70 font-serif">
                          {content.instructor}
                        </span>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-white/70">
                            <Eye className="w-4 h-4 mr-1" />
                            <span>{content.views}</span>
                          </div>
                          <div className="flex items-center text-white/70">
                            <Star className="w-4 h-4 mr-1" />
                            <span>{content.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-serif text-white mb-8">
              Fresh from the Crypt
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newArrivals.map((content) => (
                <div
                  key={content.id}
                  onClick={() => handleContentClick(content)}
                  className="group cursor-pointer"
                >
                  <div className="bg-black/60 rounded-lg overflow-hidden border border-white/20 transition-all hover:border-white/40">
                    <div className="relative aspect-video">
                      <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-12 h-12 text-white" />
                      </button>
                      {user && content.created_by === user.id && (
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(content);
                            }}
                            className="w-6 h-6 rounded bg-black/70 border border-white/40 flex items-center justify-center text-white hover:bg-white/20"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteContent(content.id);
                            }}
                            className="w-6 h-6 rounded bg-black/70 border border-red-400/40 flex items-center justify-center text-red-400 hover:bg-red-400/20"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg text-white font-serif mb-2">
                        {content.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-white/70">
                        <span>{content.instructor}</span>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{content.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Content */}
        {popularContent.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-serif text-white mb-8">
              Dark Favorites
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularContent.map((content) => (
                <div
                  key={content.id}
                  onClick={() => handleContentClick(content)}
                  className="group cursor-pointer"
                >
                  <div className="bg-black/60 rounded-lg overflow-hidden border border-white/20 transition-all hover:border-white/40">
                    <div className="relative aspect-video">
                      <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-12 h-12 text-white" />
                      </button>
                      {user && content.created_by === user.id && (
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(content);
                            }}
                            className="w-6 h-6 rounded bg-black/70 border border-white/40 flex items-center justify-center text-white hover:bg-white/20"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteContent(content.id);
                            }}
                            className="w-6 h-6 rounded bg-black/70 border border-red-400/40 flex items-center justify-center text-red-400 hover:bg-red-400/20"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg text-white font-serif mb-2">
                        {content.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-white/70">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{content.views}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          <span>{content.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* General Content - Content without special flags */}
        {generalContent.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-serif text-white mb-8">
              The Archive Collection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generalContent.map((content) => (
                <div
                  key={content.id}
                  onClick={() => handleContentClick(content)}
                  className="group cursor-pointer"
                >
                  <div className="bg-black/60 rounded-lg overflow-hidden border border-white/20 transition-all hover:border-white/40">
                    <div className="relative aspect-video">
                      <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-12 h-12 text-white" />
                      </button>
                      {user && content.created_by === user.id && (
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(content);
                            }}
                            className="w-6 h-6 rounded bg-black/70 border border-white/40 flex items-center justify-center text-white hover:bg-white/20"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteContent(content.id);
                            }}
                            className="w-6 h-6 rounded bg-black/70 border border-red-400/40 flex items-center justify-center text-red-400 hover:bg-red-400/20"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg text-white font-serif mb-2">
                        {content.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-white/70">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{content.views}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          <span>{content.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* No Content Message */}
        {filteredContent.length === 0 && !loading && (
          <div className="text-center py-16">
            <Book className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl text-white/60 font-serif mb-2">
              No content found
            </h3>
            <p className="text-white/40 font-serif">
              {searchTerm
                ? "Try adjusting your search terms or browse other categories"
                : "Be the first to add content to the archives"}
            </p>
          </div>
        )}

        {/* Content Modal */}
        {selectedContent && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center p-8 z-50"
            onClick={handleModalClick}
          >
            <div
              className="bg-black/80 rounded-lg w-full max-w-4xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                {isPlaying && selectedContent.video_url ? (
                  <div className="relative w-full h-full">
                    {selectedContent.type === "video" ? (
                      <video
                        key={videoUrl || selectedContent.video_url} // Force re-render on URL change
                        src={videoUrl || selectedContent.video_url}
                        controls
                        className="w-full h-full object-cover"
                        preload="metadata"
                        playsInline
                        crossOrigin="anonymous"
                        onEnded={() => setIsPlaying(false)}
                        onError={(e) => {
                          const videoElement =
                            e.currentTarget as HTMLVideoElement;
                          const currentUrl =
                            videoUrl || selectedContent.video_url;

                          console.error("❌ Video failed to load:", currentUrl);
                          console.error("Video error details:", e);

                          if (videoElement && videoElement.error) {
                            const errorCode = videoElement.error.code;
                            const errorMessage = videoElement.error.message;
                            console.error(
                              "Video element error code:",
                              errorCode
                            );
                            console.error(
                              "Video element error message:",
                              errorMessage
                            );
                            console.error(
                              "Video network state:",
                              videoElement.networkState
                            );
                            console.error(
                              "Video ready state:",
                              videoElement.readyState
                            );

                            // Map error codes to human-readable messages
                            let errorDescription = "";
                            switch (errorCode) {
                              case 1:
                                errorDescription =
                                  "MEDIA_ERR_ABORTED: The video download was aborted by the user.";
                                break;
                              case 2:
                                errorDescription =
                                  "MEDIA_ERR_NETWORK: A network error caused the video download to fail.";
                                break;
                              case 3:
                                errorDescription =
                                  "MEDIA_ERR_DECODE: The video is corrupted or not supported by your browser.";
                                break;
                              case 4:
                                errorDescription =
                                  "MEDIA_ERR_SRC_NOT_SUPPORTED: The video format is not supported.";
                                break;
                              default:
                                errorDescription = "Unknown error occurred.";
                            }

                            console.error(
                              "Error description:",
                              errorDescription
                            );

                            // Show user-friendly error message
                            if (errorCode === 4) {
                              alert(
                                `Video format not supported or file corrupted!\n\nURL: ${currentUrl}\n\nThis usually means:\n1. The video file is corrupted during upload\n2. Unsupported video format\n3. File is incomplete or damaged\n\nPlease try:\n1. Re-uploading the video in MP4 format\n2. Checking if the file plays locally\n3. Using a different video file`
                              );
                            } else if (errorCode === 2) {
                              alert(
                                `Network error loading video!\n\nURL: ${currentUrl}\n\nThis usually means:\n1. File doesn't exist or was deleted\n2. Network connectivity issues\n3. Server temporarily unavailable\n\nPlease check your internet connection and try again.`
                              );
                            }
                          }
                        }}
                        onLoadStart={() => {
                          console.log(
                            "🎬 Video started loading:",
                            videoUrl || selectedContent.video_url
                          );
                        }}
                        onCanPlay={() => {
                          console.log(
                            "✅ Video can start playing:",
                            videoUrl || selectedContent.video_url
                          );
                        }}
                        onLoadedData={() => {
                          console.log(
                            "📊 Video data loaded successfully:",
                            videoUrl || selectedContent.video_url
                          );
                        }}
                        onLoadedMetadata={() => {
                          console.log(
                            "📋 Video metadata loaded:",
                            videoUrl || selectedContent.video_url
                          );
                        }}
                        onProgress={() => {
                          console.log("⏳ Video loading progress...");
                        }}
                        onSuspend={() => {
                          console.log("⏸️ Video loading suspended");
                        }}
                        onStalled={() => {
                          console.log("⚠️ Video loading stalled");
                        }}
                        onWaiting={() => {
                          console.log("⏳ Video waiting for data...");
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <audio
                          src={videoUrl || selectedContent.video_url}
                          controls
                          autoPlay
                          className="w-full"
                          onEnded={() => setIsPlaying(false)}
                          onError={(e) => {
                            console.error(
                              "Audio failed to load:",
                              videoUrl || selectedContent.video_url
                            );
                            console.error("Audio error details:", e);
                            alert(
                              `Audio failed to load: ${
                                videoUrl || selectedContent.video_url
                              }\n\nThis might be due to:\n- Unsupported audio format\n- Network issues\n- CORS restrictions\n\nTry refreshing the page or contact support.`
                            );
                          }}
                          onLoadStart={() => {
                            console.log(
                              "Audio started loading:",
                              videoUrl || selectedContent.video_url
                            );
                          }}
                          onCanPlay={() => {
                            console.log(
                              "Audio can start playing:",
                              videoUrl || selectedContent.video_url
                            );
                          }}
                          crossOrigin="anonymous"
                        />
                      </div>
                    )}
                    <button
                      onClick={handleModalClose}
                      className="absolute top-4 right-4 text-white/60 hover:text-white w-8 h-8 flex items-center justify-center bg-black/50 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <img
                      src={selectedContent.thumbnail}
                      alt={selectedContent.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={handleModalClose}
                      className="absolute top-4 right-4 text-white/60 hover:text-white w-8 h-8 flex items-center justify-center bg-black/50 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center space-x-4">
                      <button
                        onClick={async () => {
                          if (selectedContent.video_url) {
                            console.log(
                              "Testing video URL accessibility:",
                              selectedContent.video_url
                            );

                            // Test if URL is accessible
                            try {
                              console.log(
                                "🔍 Step 1: Testing URL accessibility..."
                              );
                              const response = await fetch(
                                selectedContent.video_url,
                                { method: "HEAD" }
                              );
                              console.log("URL accessibility test:", {
                                url: selectedContent.video_url,
                                status: response.status,
                                statusText: response.statusText,
                                headers: Object.fromEntries(
                                  response.headers.entries()
                                ),
                              });

                              if (response.ok) {
                                console.log(
                                  "🔍 Step 2: Validating Supabase file..."
                                );
                                const validation = await validateSupabaseFile(
                                  selectedContent.video_url
                                );
                                console.log(
                                  "File validation result:",
                                  validation
                                );

                                if (!validation.valid) {
                                  alert(
                                    `❌ File validation failed: ${validation.message}\n\nURL: ${selectedContent.video_url}\n\nSuggestions:\n- Re-upload the video file\n- Check if file was deleted\n- Ensure proper video format (MP4 recommended)`
                                  );
                                  return;
                                }

                                console.log(
                                  "✅ Video URL is accessible and valid, starting playback"
                                );

                                // For Supabase Storage URLs, use original URL without modifications
                                if (
                                  selectedContent.video_url.includes(
                                    "supabase.co/storage/v1/object/public/"
                                  )
                                ) {
                                  console.log(
                                    "Using original Supabase Storage URL:",
                                    selectedContent.video_url
                                  );
                                  setVideoUrl(selectedContent.video_url);
                                } else {
                                  // For other URLs, apply cache-busting
                                  const finalUrl = getVideoUrlWithCacheBust(
                                    selectedContent.video_url
                                  );
                                  console.log(
                                    "Using cache-busted URL:",
                                    finalUrl
                                  );
                                  setVideoUrl(finalUrl);
                                }

                                setIsPlaying(true);
                              } else {
                                console.error(
                                  "❌ Video URL returned error:",
                                  response.status,
                                  response.statusText
                                );
                                alert(
                                  `Video URL returned error: ${response.status} ${response.statusText}\n\nURL: ${selectedContent.video_url}\n\nThe file might be corrupted, deleted, or have permission issues.`
                                );
                              }
                            } catch (error) {
                              console.error(
                                "❌ Failed to access video URL:",
                                error
                              );
                              const errorMessage =
                                error instanceof Error
                                  ? error.message
                                  : "Unknown error";
                              alert(
                                `Failed to access video URL: ${errorMessage}\n\nURL: ${selectedContent.video_url}\n\nThis might be due to:\n- Network connectivity issues\n- CORS restrictions\n- Invalid URL format`
                              );
                            }
                          } else {
                            console.log(
                              "No video URL available for:",
                              selectedContent.title
                            );
                            alert(
                              `No video URL available for "${selectedContent.title}". Please add a video URL or upload a video file.`
                            );
                          }
                        }}
                        className="w-20 h-20 rounded-full bg-white/20 border border-white/40 flex items-center justify-center hover:bg-white/30 transition-colors"
                        disabled={!selectedContent.video_url}
                      >
                        <Play className="w-10 h-10 text-white transform translate-x-1" />
                      </button>
                    </div>
                    {!selectedContent.video_url && (
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-red-500/70 rounded-full text-sm text-white">
                        No video available
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="p-8">
                <h2 className="text-2xl text-white font-serif mb-4">
                  {selectedContent.title}
                </h2>
                <p className="text-white/70 mb-6">
                  {selectedContent.description}
                </p>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-white font-serif mb-2">Instructor</h3>
                    <p className="text-white/70">
                      {selectedContent.instructor}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-serif mb-2">Department</h3>
                    <p className="text-white/70">
                      {selectedContent.department}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedContent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{selectedContent.views} views</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      <span>{selectedContent.rating} rating</span>
                    </div>
                  </div>
                  {user && (
                    <button
                      onClick={() => {
                        const isFavorited = userFavorites.includes(
                          selectedContent.id
                        );
                        if (isFavorited) {
                          removeFromFavorites(selectedContent.id);
                        } else {
                          addToFavorites(selectedContent.id);
                        }
                      }}
                      className={`flex items-center space-x-2 transition-colors ${
                        userFavorites.includes(selectedContent.id)
                          ? "text-red-400 hover:text-red-300"
                          : "text-white/60 hover:text-red-400"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          userFavorites.includes(selectedContent.id)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      <span>
                        {userFavorites.includes(selectedContent.id)
                          ? "Remove from Favorites"
                          : "Add to Favorites"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Content Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-8 z-50">
            <div className="bg-black/80 rounded-lg w-full max-w-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl text-white font-serif">
                    {editingContent ? "Edit Content" : "Add New Content"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingContent(null);
                      resetForm();
                    }}
                    className="text-white/60 hover:text-white w-8 h-8 flex items-center justify-center bg-white/10 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white font-serif mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full bg-black/50 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-serif mb-2">
                        Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as "video" | "audio",
                          })
                        }
                        className="w-full bg-black/50 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50"
                      >
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white font-serif mb-2">
                        Duration Range
                      </label>
                      <select
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                        className="w-full bg-black/50 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50"
                        required
                      >
                        <option value="">Select duration range</option>
                        <option value="<5 min">Less than 5 minutes</option>
                        <option value="5-20 min">5-20 minutes</option>
                        <option value=">20 min">More than 20 minutes</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-serif mb-2">
                        Instructor
                      </label>
                      <input
                        type="text"
                        value={formData.instructor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instructor: e.target.value,
                          })
                        }
                        className="w-full bg-black/50 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-serif mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            department: e.target.value,
                          })
                        }
                        className="w-full bg-black/50 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-serif mb-2">
                      Description
                      <span className="text-white/50 text-sm ml-2">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Enter content description..."
                      className="w-full bg-black/50 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-serif mb-2">
                      Tags
                      <span className="text-white/50 text-sm ml-2">
                        (Optional - comma-separated)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      placeholder="e.g., history, mythology, ancient"
                      className="w-full bg-black/50 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-serif mb-2">
                      Thumbnail
                      <span className="text-white/50 text-sm ml-2">
                        (Optional - URL or Upload)
                      </span>
                    </label>
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={formData.thumbnail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            thumbnail: e.target.value,
                          })
                        }
                        placeholder="Enter thumbnail URL"
                        className="w-full bg-black/50 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50"
                      />
                      <div className="text-white/60 text-center text-sm">
                        OR
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="flex-1 flex items-center justify-center px-4 py-3 bg-black/50 border border-white/30 rounded-lg text-white cursor-pointer hover:bg-white/10 transition-all">
                          <Upload className="w-4 h-4 mr-2" />
                          <span>Upload Thumbnail</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setFormData({
                                ...formData,
                                thumbnail_file: file,
                              });
                            }}
                            className="hidden"
                          />
                        </label>
                        {formData.thumbnail_file && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-400 text-sm">
                              {formData.thumbnail_file.name}
                            </span>
                            {uploadProgress[formData.thumbnail_file.name] && (
                              <div className="flex items-center space-x-2">
                                <div className="w-20 h-2 bg-black/50 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-400 transition-all duration-300"
                                    style={{
                                      width: `${
                                        uploadProgress[
                                          formData.thumbnail_file.name
                                        ].percentage
                                      }%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-green-400">
                                  {
                                    uploadProgress[formData.thumbnail_file.name]
                                      .percentage
                                  }
                                  %
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-serif mb-2">
                      Main Content File
                      <span className="text-white/50 text-sm ml-2">
                        (Optional - URL or Upload)
                      </span>
                    </label>
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={formData.video_url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            video_url: e.target.value,
                          })
                        }
                        placeholder="Enter video/audio URL"
                        className="w-full bg-black/50 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50"
                      />
                      <div className="text-white/60 text-center text-sm">
                        OR
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="flex-1 flex items-center justify-center px-4 py-3 bg-black/50 border border-white/30 rounded-lg text-white cursor-pointer hover:bg-white/10 transition-all">
                          <Upload className="w-4 h-4 mr-2" />
                          <span>
                            Upload{" "}
                            {formData.type === "video" ? "Video" : "Audio"}
                          </span>
                          <input
                            type="file"
                            accept={
                              formData.type === "video" ? "video/*" : "audio/*"
                            }
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setFormData({ ...formData, content_file: file });
                            }}
                            className="hidden"
                          />
                        </label>
                        {formData.content_file && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-400 text-sm">
                              {formData.content_file.name}
                            </span>
                            {uploadProgress[formData.content_file.name] && (
                              <div className="flex items-center space-x-2">
                                <div className="w-20 h-2 bg-black/50 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-400 transition-all duration-300"
                                    style={{
                                      width: `${
                                        uploadProgress[
                                          formData.content_file.name
                                        ].percentage
                                      }%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-blue-400">
                                  {
                                    uploadProgress[formData.content_file.name]
                                      .percentage
                                  }
                                  %
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {!formData.video_url && !formData.content_file && (
                        <div className="text-amber-400 text-xs mt-1 flex items-center">
                          <span>
                            ⚠️ Without a video/audio source, content will only
                            show as a preview
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-serif mb-2">
                      Preview File
                      <span className="text-white/50 text-sm ml-2">
                        (Optional - URL or Upload)
                      </span>
                    </label>
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={formData.preview_url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preview_url: e.target.value,
                          })
                        }
                        placeholder="Enter preview URL"
                        className="w-full bg-black/50 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50"
                      />
                      <div className="text-white/60 text-center text-sm">
                        OR
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="flex-1 flex items-center justify-center px-4 py-3 bg-black/50 border border-white/30 rounded-lg text-white cursor-pointer hover:bg-white/10 transition-all">
                          <Upload className="w-4 h-4 mr-2" />
                          <span>Upload Preview</span>
                          <input
                            type="file"
                            accept={
                              formData.type === "video" ? "video/*" : "audio/*"
                            }
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setFormData({ ...formData, preview_file: file });
                            }}
                            className="hidden"
                          />
                        </label>
                        {formData.preview_file && (
                          <span className="text-green-400 text-sm">
                            {formData.preview_file.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-serif mb-3">
                      Content Flags
                      <span className="text-white/50 text-sm ml-2">
                        (Optional - all default to false)
                      </span>
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <label className="flex items-center space-x-2 text-white">
                        <input
                          type="checkbox"
                          checked={formData.is_featured}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              is_featured: e.target.checked,
                            })
                          }
                          className="rounded"
                        />
                        <span>Featured</span>
                      </label>
                      <label className="flex items-center space-x-2 text-white">
                        <input
                          type="checkbox"
                          checked={formData.is_popular}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              is_popular: e.target.checked,
                            })
                          }
                          className="rounded"
                        />
                        <span>Popular</span>
                      </label>
                      <label className="flex items-center space-x-2 text-white">
                        <input
                          type="checkbox"
                          checked={formData.is_new_arrival}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              is_new_arrival: e.target.checked,
                            })
                          }
                          className="rounded"
                        />
                        <span>New Arrival</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingContent(null);
                        resetForm();
                      }}
                      className="px-6 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-white/20 border border-white/40 text-white rounded-lg hover:bg-white/30 transition-all flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingContent ? "Update" : "Create"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
