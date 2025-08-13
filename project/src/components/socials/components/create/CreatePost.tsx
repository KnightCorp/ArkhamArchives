import React, { useState, useRef } from "react";
import {
  Image,
  Video,
  Smile,
  MapPin,
  Users,
  X,
  Loader2,
  Hash,
  ChevronDown,
} from "lucide-react";

interface CreatePostProps {
  onCreatePost?: (
    caption: string,
    imageUrl: string,
    tags?: string[],
    category?: string
  ) => Promise<void>;
}

// Custom Dropdown Component
const CustomDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, options, placeholder, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropDirection, setDropDirection] = useState<"down" | "up">("down");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const dropdownHeight = Math.min(options.length, 4) * 32 + 8; // 4 items max, 32px each + padding

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropDirection("up");
      } else {
        setDropDirection("down");
      }
    }
  }, [isOpen, options.length]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between text-left text-sm"
      >
        <span className={selectedOption ? "text-white" : "text-white/50"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 w-full bg-gray-800 border border-white/20 rounded-lg overflow-hidden shadow-xl ${
            dropDirection === "up" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
          style={{
            zIndex: 9999,
            maxHeight: "128px", // 4 items * 32px each
            overflowY: "auto",
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-white hover:bg-white/10 transition-colors border-none bg-transparent block text-sm"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const CreatePost: React.FC<CreatePostProps> = ({ onCreatePost }) => {
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [location, setLocation] = useState("");
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState<"public" | "friends" | "private">(
    "public"
  );

  // New state for tags and category
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [category, setCategory] = useState<string>("");
  const [showTagInput, setShowTagInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Predefined categories
  const categories = [
    "lifestyle",
    "travel",
    "food",
    "fitness",
    "technology",
    "art",
    "music",
    "fashion",
    "business",
    "education",
    "entertainment",
    "sports",
    "nature",
    "photography",
  ];

  // Privacy options
  const privacyOptions = [
    { value: "public", label: "🌍 Public" },
    { value: "friends", label: "👥 Friends" },
    { value: "private", label: "🔒 Private" },
  ];

  // Category options
  const categoryOptions = [
    { value: "", label: "Select a category..." },
    ...categories.map((cat) => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
    })),
  ];

  // Common emojis for quick access
  const commonEmojis = [
    "😊",
    "😍",
    "🤩",
    "😎",
    "🥳",
    "😂",
    "❤️",
    "🔥",
    "✨",
    "🌟",
    "👍",
    "🙌",
  ];

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simple validation
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("Image size should be less than 5MB");
      return;
    }

    setSelectedImage(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCaption = caption.slice(0, start) + emoji + caption.slice(end);
      setCaption(newCaption);

      // Reset cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  const handleLocationAdd = () => {
    const userLocation = prompt("Enter location:");
    if (userLocation) {
      setLocation(userLocation);
    }
  };

  const handleUserTag = () => {
    const username = prompt("Tag a user (enter username):");
    if (username && !taggedUsers.includes(username)) {
      setTaggedUsers([...taggedUsers, username]);
    }
  };

  const removeTag = (username: string) => {
    setTaggedUsers(taggedUsers.filter((user) => user !== username));
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

  const extractHashtagsFromCaption = () => {
    const hashtagRegex = /#(\w+)/g;
    const matches = caption.match(hashtagRegex);
    if (matches) {
      const extractedTags = matches.map((tag) => tag.slice(1).toLowerCase());
      const newTags = extractedTags.filter((tag) => !tags.includes(tag));
      if (newTags.length > 0 && tags.length + newTags.length <= 10) {
        setTags([...tags, ...newTags]);
      }
    }
  };

  const handleSubmit = async () => {
    if (!caption.trim() && !selectedImage) {
      setError("Please add some content to your post");
      return;
    }

    setIsPosting(true);
    setError(null);

    try {
      let imageUrl = "";

      // Simulate image upload
      if (selectedImage) {
        setIsUploading(true);
        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        imageUrl = "https://example.com/uploaded-image.jpg";
        setIsUploading(false);
      }

      // Extract hashtags from caption before creating post
      extractHashtagsFromCaption();

      // Create the post with tags and category
      if (onCreatePost) {
        await onCreatePost(
          caption.trim(),
          imageUrl,
          tags,
          category || undefined
        );
      }

      // Reset form
      setCaption("");
      setSelectedImage(null);
      setImagePreview(null);
      setLocation("");
      setTaggedUsers([]);
      setTags([]);
      setCurrentTag("");
      setCategory("");
      setPrivacy("public");
      setShowTagInput(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      console.log("Post created successfully!");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setIsUploading(false);
      setIsPosting(false);
    }
  };

  const isFormValid = caption.trim() || selectedImage;
  const isSubmitting = isUploading || isPosting;

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Create Post</h3>
          <CustomDropdown
            value={privacy}
            onChange={(value) =>
              setPrivacy(value as "public" | "friends" | "private")
            }
            options={privacyOptions}
            className="w-32"
          />
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What's happening? Use #hashtags to make your post discoverable!"
            className="w-full bg-transparent border border-white/20 rounded-lg p-4 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            maxLength={500}
          />
          <div className="absolute bottom-2 right-2 text-xs text-white/50">
            {caption.length}/500
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Category (Optional)
          </label>
          <CustomDropdown
            value={category}
            onChange={setCategory}
            options={categoryOptions}
            placeholder="Select a category..."
          />
        </div>

        {/* Tags Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-white/70">
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
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={30}
              />
              <button
                type="button"
                onClick={() => addTag()}
                disabled={!currentTag.trim() || tags.length >= 10}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400 text-white rounded-lg text-sm transition-colors"
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

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-h-96 object-cover rounded-lg border border-white/20"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tagged Users */}
        {taggedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {taggedUsers.map((username) => (
              <span
                key={username}
                className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-sm"
              >
                @{username}
                <button
                  type="button"
                  onClick={() => removeTag(username)}
                  className="hover:text-green-100 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Location */}
        {location && (
          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
            <button
              type="button"
              onClick={() => setLocation("")}
              className="text-white/50 hover:text-white/70 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="bg-black/40 border border-white/20 rounded-lg p-3 grid grid-cols-6 gap-2">
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className="p-2 hover:bg-white/10 rounded text-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-4">
            {/* Image Upload */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Photo</span>
            </button>

            {/* Video Upload (placeholder) */}
            {/* <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors opacity-50 cursor-not-allowed"
              disabled
            >
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline">Video</span>
            </button> */}

            {/* Emoji Picker Toggle */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <Smile className="w-4 h-4" />
            </button>

            {/* Location */}
            <button
              type="button"
              onClick={handleLocationAdd}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <MapPin className="w-4 h-4" />
            </button>

            {/* Tag Users */}
            <button
              type="button"
              onClick={handleUserTag}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <Users className="w-4 h-4" />
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              isFormValid && !isSubmitting
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {isUploading ? "Uploading..." : "Posting..."}
              </div>
            ) : (
              "Post"
            )}
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};
