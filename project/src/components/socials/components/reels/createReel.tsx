import React, { useState, useRef } from "react";
import { Upload, X, Play, Loader2, Hash } from "lucide-react";
import { reelStorage, reelQueries, reelUtils } from "../../lib/reelQueries";
import { supabase } from "../../../../lib/supabaseClient";

interface CreateReelProps {
  onClose: () => void;
  onReelCreated: (reel: any) => void;
}

export const CreateReel: React.FC<CreateReelProps> = ({
  onClose,
  onReelCreated,
}) => {
  const [step, setStep] = useState<"upload" | "details" | "uploading">(
    "upload"
  );
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // Add these after the existing state variables
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [category, setCategory] = useState<string>("");
  const [showTagInput, setShowTagInput] = useState(false);

  // Add this ref
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Add categories array
  const categories = [
    "entertainment",
    "comedy",
    "dance",
    "music",
    "lifestyle",
    "travel",
    "food",
    "fitness",
    "education",
    "art",
    "fashion",
    "sports",
    "tech",
    "gaming",
  ];

  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = reelUtils.validateVideoFile(file);
    if (!validation.isValid) {
      setError(validation.error || "Invalid video file");
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setError(null);

    // Auto-generate thumbnail
    try {
      const thumbnailBlob = await reelStorage.generateVideoThumbnail(file);
      const thumbnailFile = new File([thumbnailBlob], "thumbnail.jpg", {
        type: "image/jpeg",
      });
      setThumbnailFile(thumbnailFile);
      setThumbnailPreview(URL.createObjectURL(thumbnailBlob));
    } catch (err) {
      console.error("Error generating thumbnail:", err);
    }

    setStep("details");
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = reelUtils.validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || "Invalid image file");
      return;
    }

    setThumbnailFile(file);
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailPreview(URL.createObjectURL(file));
    setError(null);
  };
  // Tag management functions
  const addTag = (tagToAdd?: string) => {
    const tag = (tagToAdd || currentTag).trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setCurrentTag("");
    }
  };

  const removeContentTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };
  const handleSubmit = async () => {
    if (!videoFile || !formData.title.trim()) {
      setError("Please provide a video and title");
      return;
    }

    setStep("uploading");
    setUploading(true);
    setUploadProgress(0);

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Not authenticated");

      // Upload video
      setUploadProgress(20);
      const videoUpload = await reelStorage.uploadReelVideo(videoFile, user.id);
      if (videoUpload.error) throw videoUpload.error;

      // Upload thumbnail
      setUploadProgress(60);
      let thumbnailUrl = "";
      if (thumbnailFile) {
        const thumbnailUpload = await reelStorage.uploadReelThumbnail(
          thumbnailFile,
          user.id
        );
        if (thumbnailUpload.error) throw thumbnailUpload.error;
        thumbnailUrl = thumbnailUpload.data!.url;
      }

      // Get video duration
      setUploadProgress(80);
      const duration = await reelStorage.getVideoDuration(videoFile);

      // Create reel record
      setUploadProgress(90);
      // Update the reelData object in handleSubmit to include:
      const reelData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        video_url: videoUpload.data!.url,
        thumbnail_url: thumbnailUrl || undefined,
        duration,
        file_size: videoFile.size,
        video_format: videoFile.type,
        tags: tags, // Add this
        category: category || undefined, // Add this
      };

      const { data: reel, error: createError } = await reelQueries.createReel(
        reelData
      );
      if (createError) throw createError;

      setUploadProgress(100);
      onReelCreated(reel);
      onClose();
    } catch (err: any) {
      console.error("Error creating reel:", err);
      setError(err.message || "Failed to create reel");
      setStep("details");
    } finally {
      setUploading(false);
    }
  };

  const cleanup = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
  };

  React.useEffect(() => {
    return cleanup;
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-700">
          <h2 className="text-xl font-semibold text-white">Create Reel</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "upload" && (
            <div className="text-center">
              <div className="border-2 border-dashed border-zinc-600 rounded-lg p-12 hover:border-zinc-500 transition-colors">
                <Upload className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                <h3 className="text-lg text-white mb-2">Upload Video</h3>
                <p className="text-zinc-400 mb-6">
                  Select a video file to create your reel
                </p>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleVideoSelect}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors"
                >
                  Choose Video
                </label>
              </div>
              <p className="text-sm text-zinc-500 mt-4">
                Supported formats: MP4, WebM, OGG, MOV (Max 100MB)
              </p>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-6">
              {/* Video Preview */}
              {videoPreview && (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Give your reel a title..."
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Describe your reel..."
                    rows={3}
                    maxLength={500}
                  />
                </div>
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select a category...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-white">
                      Tags ({tags.length}/10)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTagInput(!showTagInput);
                        if (!showTagInput) {
                          setTimeout(() => tagInputRef.current?.focus(), 100);
                        }
                      }}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      <Hash className="w-4 h-4" />
                      Add Tags
                    </button>
                  </div>

                  {/* Tag Input */}
                  {showTagInput && (
                    <div className="flex gap-2">
                      <input
                        ref={tagInputRef}
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={handleTagKeyPress}
                        placeholder="Enter tag and press Enter"
                        className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                        maxLength={30}
                      />
                      <button
                        type="button"
                        onClick={() => addTag()}
                        disabled={!currentTag.trim() || tags.length >= 10}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-400 text-white rounded text-sm transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  )}

                  {/* Display Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeContentTag(tag)}
                            className="hover:text-blue-100 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Thumbnail
                  </label>
                  <div className="flex items-center space-x-4">
                    {thumbnailPreview && (
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail"
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleThumbnailSelect}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <label
                        htmlFor="thumbnail-upload"
                        className="inline-block px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded cursor-pointer transition-colors"
                      >
                        {thumbnailFile
                          ? "Change Thumbnail"
                          : "Upload Thumbnail"}
                      </label>
                      <p className="text-xs text-zinc-500 mt-1">
                        Auto-generated if not provided
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep("upload")}
                  className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.title.trim()}
                  className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-400 text-white rounded-lg transition-colors"
                >
                  Create Reel
                </button>
              </div>
            </div>
          )}

          {step === "uploading" && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg text-white mb-2">Creating Your Reel</h3>
              <p className="text-zinc-400 mb-6">
                Please wait while we upload your video...
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-700 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-zinc-500">
                {uploadProgress}% complete
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
