import React, { useState } from "react";
import { X, Calendar, DollarSign, Plus, Trash2 } from "lucide-react";

interface ClassCreationProps {
  onSubmit: (data: ClassFormData) => void;
  onCancel: () => void;
}

interface ClassFormData {
  title: string;
  topic: string;
  description: string;
  dateTime: string;
  price: number;
  priceType: "session" | "monthly";
  topicsCovered: string[];
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  isLive: boolean;
  category: string;
  duration: number; // Added duration field
}

const ClassCreation: React.FC<ClassCreationProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ClassFormData>({
    title: "",
    topic: "",
    description: "",
    dateTime: "",
    price: 0, // Ensure initialized to 0
    priceType: "session",
    topicsCovered: [""],
    tags: [],
    difficulty: "beginner",
    isLive: true,
    category: "English & Languages",
    duration: 0, // Ensure initialized to 0
  });
  const [newTopic, setNewTopic] = useState("");
  const [customTag, setCustomTag] = useState("");
  const [error, setError] = useState<string | null>(null);

  const availableTags = [
    "English",
    "Grammar",
    "Literature",
    "Writing",
    "Creative Writing",
    "Academic Writing",
    "IELTS",
    "TOEFL",
    "Business English",
    "Conversation",
    "Pronunciation",
    "Vocabulary",
    "Reading Comprehension",
    "Public Speaking",
    "Essay Writing",
    "Poetry",
    "AI",
    "Machine Learning",
    "Deep Learning",
    "React",
    "JavaScript",
    "Python",
    "Data Science",
    "Web Development",
    "Mobile Development",
    "Blockchain",
    "Cybersecurity",
    "Cloud Computing",
    "DevOps",
    "Product Management",
    "UI/UX Design",
    "Digital Marketing",
    "Finance",
    "Business Strategy",
  ];

  const handleInputChange = (field: keyof ClassFormData, value: any) => {
    // For number fields, always parse as number and default to 0
    if (field === "price" || field === "duration") {
      setFormData((prev) => ({ ...prev, [field]: Number(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const addCustomTag = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, customTag.trim()],
      }));
      setCustomTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addTopic = () => {
    if (newTopic.trim()) {
      setFormData((prev) => ({
        ...prev,
        topicsCovered: [
          ...prev.topicsCovered.filter((t) => t.trim()),
          newTopic.trim(),
          "",
        ],
      }));
      setNewTopic("");
    }
  };

  const removeTopic = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      topicsCovered: prev.topicsCovered.filter((_, i) => i !== index),
    }));
  };

  const updateTopic = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      topicsCovered: prev.topicsCovered.map((topic, i) =>
        i === index ? value : topic
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // Convert datetime-local to proper ISO string with timezone
      const localDateTime = formData.dateTime;
      console.log("Original datetime-local value:", localDateTime);

      // datetime-local gives us YYYY-MM-DDTHH:MM format
      // We need to treat this as local time, not UTC
      const dateTimeWithTimezone = new Date(localDateTime);
      console.log("Parsed as Date object:", dateTimeWithTimezone);
      console.log(
        "Will be stored as ISO string:",
        dateTimeWithTimezone.toISOString()
      );

      const submissionData = {
        ...formData,
        dateTime: dateTimeWithTimezone.toISOString(),
      };

      await onSubmit(submissionData);
    } catch (err: any) {
      setError(
        "Failed to create class. Please check your input and try again."
      );
      console.error("Class creation error:", err);
    }
  };

  const isFormValid = () => {
    return (
      formData.title &&
      formData.topic &&
      formData.description &&
      formData.dateTime &&
      formData.price > 0 &&
      formData.topicsCovered.some((topic) => topic.trim()) &&
      formData.tags.length > 0
    );
  };

  // Get minimum date (today)
  const today = new Date();
  const minDateTime = today.toISOString().slice(0, 16);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
      <div className="bg-black border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">
                CLASS_CREATION.EXE
              </h2>
              <p className="text-white/60 text-sm">
                Schedule and manage your class
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-white font-bold mb-4">CLASS_DETAILS</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Class Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 focus:border-white focus:outline-none"
                  placeholder="e.g., Advanced React Patterns"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Main Topic *
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => handleInputChange("topic", e.target.value)}
                  className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 focus:border-white focus:outline-none"
                  placeholder="e.g., Advanced Grammar, Creative Writing, Business English"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 focus:border-white focus:outline-none"
                >
                  <option value="English & Languages">
                    English & Languages
                  </option>
                  <option value="Programming">Programming</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 h-24 focus:border-white focus:outline-none resize-none"
                  placeholder="Describe what students will learn in this class..."
                />
              </div>
            </div>
          </div>

          {/* Scheduling & Pricing */}
          <div>
            <h3 className="text-white font-bold mb-4">SCHEDULE_&_PRICING</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) =>
                    handleInputChange("dateTime", e.target.value)
                  }
                  min={minDateTime}
                  className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Price *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={formData.price ?? 0}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    min="0"
                    step="0.01"
                    className="flex-1 bg-black/50 border border-white/20 text-white px-3 py-2 focus:border-white focus:outline-none"
                    placeholder="0.00"
                  />
                  <select
                    value={formData.priceType}
                    onChange={(e) =>
                      handleInputChange("priceType", e.target.value)
                    }
                    className="bg-black/50 border border-white/20 text-white px-3 py-2 focus:border-white focus:outline-none"
                  >
                    <option value="session">Per Session</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    handleInputChange("difficulty", e.target.value)
                  }
                  className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 focus:border-white focus:outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Class Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={formData.isLive}
                      onChange={() => handleInputChange("isLive", true)}
                      className="text-white"
                    />
                    <span className="text-white/80 text-sm">Live Session</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={!formData.isLive}
                      onChange={() => handleInputChange("isLive", false)}
                      className="text-white"
                    />
                    <span className="text-white/80 text-sm">Recorded</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Topics Covered */}
          <div>
            <h3 className="text-white font-bold mb-4">TOPICS_COVERED *</h3>

            <div className="space-y-2">
              {formData.topicsCovered.map((topic, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => updateTopic(index, e.target.value)}
                    className="flex-1 bg-black/50 border border-white/20 text-white px-3 py-2 focus:border-white focus:outline-none"
                    placeholder={`Topic ${index + 1}`}
                  />
                  {formData.topicsCovered.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addTopic}
                className="flex items-center space-x-2 text-white hover:text-silver text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Topic</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-white font-bold mb-4">
              TAGS * (Select at least one)
            </h3>

            {/* Custom Tag Input */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Add custom tag (e.g., Advanced Grammar, Creative Writing)"
                  className="flex-1 bg-black border border-white/30 text-white px-3 py-2 text-sm focus:outline-none focus:border-white/50"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCustomTag())
                  }
                />
                <button
                  type="button"
                  onClick={addCustomTag}
                  className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-3 py-2 text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-white/60 text-xs mt-1">
                Perfect for English teachers: Add specific topics like "Essay
                Writing", "IELTS Preparation", etc.
              </p>
            </div>

            {/* Available Tags */}
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto mb-4">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 text-xs border transition-colors ${
                    formData.tags.includes(tag)
                      ? "bg-white/20 text-white border-white/30"
                      : "text-white/80 border-white/20 hover:border-white/50"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="mb-4">
                <h4 className="text-white/80 text-sm mb-2">Selected Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 text-white border border-white/30 text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-white/80 hover:text-white ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border text-white border-white/20 hover:border-white/50"
            >
              [CANCEL]
            </button>
            <button
              type="submit"
              className={`px-6 py-2 border ${
                isFormValid()
                  ? "text-white border-white/30 bg-white/10 hover:bg-white/20"
                  : "text-white/40 border-white/10 cursor-not-allowed"
              }`}
              disabled={!isFormValid()}
            >
              [CREATE_CLASS]
            </button>
          </div>
          {/* Show error if present */}
          {error && (
            <div className="mb-4 text-red-400 bg-red-900/40 px-4 py-2 rounded">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ClassCreation;
