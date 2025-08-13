import React, { useState, useRef } from "react";
import {
  Book,
  Star,
  Trophy,
  Heart,
  Clock,
  Brain,
  Sparkles,
  Upload,
  Music,
  Image,
  X,
  Download,
  Play,
} from "lucide-react";

interface DialogueLine {
  character: string;
  text: string;
  emotion?: "happy" | "sad" | "angry" | "neutral";
}

interface VideoSettings {
  includeBackgroundMusic: boolean;
  includeVoiceOver: boolean;
  animationSpeed: "slow" | "normal" | "fast";
  videoResolution: "720p" | "1080p";
  customThumbnail?: File;
  customMusic?: File;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  karma: number;
  status: "locked" | "available" | "completed";
  videoGenerated: boolean;
  videoBlob?: Blob;
  achievements: {
    id: string;
    title: string;
    description: string;
    icon:
      | typeof Star
      | typeof Trophy
      | typeof Heart
      | typeof Clock
      | typeof Brain;
    unlocked: boolean;
  }[];
  reviews: {
    user: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

const initialChapters: Chapter[] = [
  {
    id: "ch1",
    title: "The Time Keeper's Apprentice",
    description:
      "Begin your journey into the mysterious world of temporal mechanics as you take your first steps as an apprentice.",
    thumbnail:
      "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&h=400&fit=crop",
    karma: 0,
    status: "available",
    videoGenerated: false,
    achievements: [
      {
        id: "first-steps",
        title: "First Steps",
        description: "Complete the introductory chapter",
        icon: Star,
        unlocked: false,
      },
      {
        id: "quick-learner",
        title: "Quick Learner",
        description: "Score 100% on your first test",
        icon: Brain,
        unlocked: false,
      },
    ],
    reviews: [
      {
        user: "Clara Night",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        rating: 5,
        comment:
          "An immersive start to the journey. The temporal mechanics concepts are well explained through the story.",
        date: "2024-03-15",
      },
    ],
  },
  {
    id: "ch2",
    title: "Echoes of Time",
    description:
      "Discover the intricate relationship between past and future as you delve deeper into your studies.",
    thumbnail:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=400&fit=crop",
    karma: 100,
    status: "locked",
    videoGenerated: false,
    achievements: [
      {
        id: "time-weaver",
        title: "Time Weaver",
        description: "Successfully navigate your first temporal paradox",
        icon: Clock,
        unlocked: false,
      },
    ],
    reviews: [
      {
        user: "Marcus Stone",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        rating: 4,
        comment:
          "The paradox puzzles are challenging but rewarding. Great chapter!",
        date: "2024-03-14",
      },
    ],
  },
];

export default function ExamVisualNovel() {
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [isGeneratingVideos, setIsGeneratingVideos] = useState(false);
  const [showVideoSettings, setShowVideoSettings] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [newChapter, setNewChapter] = useState({
    title: "",
    description: "",
    thumbnail: "",
    karma: 0,
    status: "available" as "locked" | "available" | "completed",
  });
  const [customThumbnailPreview, setCustomThumbnailPreview] = useState<
    string | null
  >(null);
  const [customMusicName, setCustomMusicName] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<{
    current: number;
    total: number;
    currentChapter: string;
  }>({ current: 0, total: 0, currentChapter: "" });

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);

  const [videoSettings, setVideoSettings] = useState<VideoSettings>({
    includeBackgroundMusic: true,
    includeVoiceOver: false,
    animationSpeed: "normal",
    videoResolution: "1080p",
  });
  const [dialogueLines, setDialogueLines] = useState<DialogueLine[]>([
    {
      character: "Narrator",
      text: "Welcome to the world of temporal mechanics...",
    },
    {
      character: "Master",
      text: "Your journey as a Time Keeper's apprentice begins now.",
    },
    {
      character: "You",
      text: "I'm ready to learn the secrets of time itself.",
    },
  ]);

  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setVideoSettings((prev) => ({ ...prev, customThumbnail: file }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMusicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setVideoSettings((prev) => ({ ...prev, customMusic: file }));
      setCustomMusicName(file.name);
    }
  };

  const clearThumbnail = () => {
    setVideoSettings((prev) => ({ ...prev, customThumbnail: undefined }));
    setCustomThumbnailPreview(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const clearMusic = () => {
    setVideoSettings((prev) => ({ ...prev, customMusic: undefined }));
    setCustomMusicName(null);
    if (musicInputRef.current) {
      musicInputRef.current.value = "";
    }
  };

  const generateVideoForChapter = async (
    chapter: Chapter
  ): Promise<Blob | null> => {
    try {
      // Simulate video generation with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create a mock video blob (in real implementation, use your video generation library)
      const mockVideoData = new Uint8Array(1024); // Mock video data
      const videoBlob = new Blob([mockVideoData], { type: "video/mp4" });

      return videoBlob;
    } catch (error) {
      console.error(`Video generation failed for ${chapter.title}:`, error);
      return null;
    }
  };

  const generateAllVideos = async () => {
    setIsGeneratingVideos(true);
    const availableChapters = chapters.filter(
      (ch) => ch.status === "available"
    );
    setGenerationProgress({
      current: 0,
      total: availableChapters.length,
      currentChapter: "",
    });

    const updatedChapters = [...chapters];

    for (let i = 0; i < availableChapters.length; i++) {
      const chapter = availableChapters[i];
      setGenerationProgress({
        current: i + 1,
        total: availableChapters.length,
        currentChapter: chapter.title,
      });

      const videoBlob = await generateVideoForChapter(chapter);

      if (videoBlob) {
        const chapterIndex = updatedChapters.findIndex(
          (ch) => ch.id === chapter.id
        );
        if (chapterIndex !== -1) {
          updatedChapters[chapterIndex] = {
            ...updatedChapters[chapterIndex],
            videoGenerated: true,
            videoBlob: videoBlob,
          };
        }
      }
    }

    setChapters(updatedChapters);
    setIsGeneratingVideos(false);
    setGenerationProgress({ current: 0, total: 0, currentChapter: "" });
  };

  const downloadChapterVideo = (chapter: Chapter) => {
    if (chapter.videoBlob) {
      const url = URL.createObjectURL(chapter.videoBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${chapter.title.replace(/\s+/g, "_")}_chapter.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const AddChapterModal = ({
    isOpen,
    onClose,
    onAdd,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (chapter: any) => void;
  }) => {
    const [chapterData, setChapterData] = useState({
      title: "",
      description: "",
      thumbnail: "",
      karma: 0,
      status: "available" as "locked" | "available" | "completed",
    });

    const handleThumbnailUpload = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setChapterData((prev) => ({
            ...prev,
            thumbnail: result,
          }));
        };
        reader.readAsDataURL(file);
      }
    };

    const handleAdd = () => {
      onAdd({
        ...chapterData,
        id: `ch${Date.now()}`,
        achievements: [],
        reviews: [],
        videoGenerated: false,
      });
      setChapterData({
        title: "",
        description: "",
        thumbnail: "",
        karma: 0,
        status: "available",
      });
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50">
        <div className="bg-black/90 border border-silver/20 rounded-lg w-full max-w-2xl p-6">
          <h3 className="text-xl text-silver font-alice mb-6">
            Add New Chapter
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-silver font-alice block mb-2">
                Chapter Title
              </label>
              <input
                type="text"
                value={chapterData.title}
                onChange={(e) =>
                  setChapterData({ ...chapterData, title: e.target.value })
                }
                className="w-full bg-black/50 border border-silver/20 rounded px-3 py-2 text-silver"
                placeholder="Enter chapter title"
              />
            </div>

            <div>
              <label className="text-silver font-alice block mb-2">
                Description
              </label>
              <textarea
                value={chapterData.description}
                onChange={(e) =>
                  setChapterData({
                    ...chapterData,
                    description: e.target.value,
                  })
                }
                className="w-full bg-black/50 border border-silver/20 rounded px-3 py-2 text-silver h-24 resize-none"
                placeholder="Enter chapter description"
              />
            </div>

            <div>
              <label className="text-silver font-alice block mb-2">
                Thumbnail Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="w-full bg-black/50 border border-silver/20 rounded px-3 py-2 text-silver"
              />
              {chapterData.thumbnail && (
                <div className="mt-2 relative">
                  <img
                    src={chapterData.thumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-32 object-cover rounded-lg border border-silver/20"
                  />
                  <button
                    onClick={() =>
                      setChapterData({ ...chapterData, thumbnail: "" })
                    }
                    className="absolute top-2 right-2 bg-black/70 text-silver/60 hover:text-silver rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-silver font-alice block mb-2">
                  Karma Required
                </label>
                <input
                  type="number"
                  value={chapterData.karma}
                  onChange={(e) =>
                    setChapterData({
                      ...chapterData,
                      karma: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-black/50 border border-silver/20 rounded px-3 py-2 text-silver"
                  min="0"
                />
              </div>

              <div>
                <label className="text-silver font-alice block mb-2">
                  Status
                </label>
                <select
                  value={chapterData.status}
                  onChange={(e) =>
                    setChapterData({
                      ...chapterData,
                      status: e.target.value as
                        | "locked"
                        | "available"
                        | "completed",
                    })
                  }
                  className="w-full bg-black/50 border border-silver/20 rounded px-3 py-2 text-silver"
                >
                  <option value="available">Available</option>
                  <option value="locked">Locked</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-black/50 text-silver/60 border border-silver/20 rounded hover:bg-silver/10"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!chapterData.title || !chapterData.description}
              className="flex-1 py-2 bg-silver/10 text-silver border border-silver/20 rounded hover:bg-silver/20 disabled:opacity-50"
            >
              Add Chapter
            </button>
          </div>
        </div>
      </div>
    );
  };

  const VideoSettingsModal = ({
    isOpen,
    onClose,
    onGenerate,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: () => void;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50">
        <div className="bg-black/90 border border-silver/20 rounded-lg w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl text-silver font-alice mb-6">
            Video Generation Settings
          </h3>

          <div className="space-y-6">
            {/* Custom Thumbnail Upload */}
            <div>
              <span className="text-silver font-alice block mb-3">
                Custom Thumbnail
              </span>
              <div className="space-y-3">
                {customThumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={customThumbnailPreview}
                      alt="Custom thumbnail preview"
                      className="w-full h-32 object-cover rounded-lg border border-silver/20"
                    />
                    <button
                      onClick={clearThumbnail}
                      className="absolute top-2 right-2 bg-black/70 text-silver/60 hover:text-silver rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="border-2 border-dashed border-silver/30 rounded-lg p-8 text-center cursor-pointer hover:border-silver/50 transition-colors"
                  >
                    <Image className="w-8 h-8 mx-auto mb-2 text-silver/40" />
                    <p className="text-silver/60 font-alice">
                      Click to upload thumbnail
                    </p>
                    <p className="text-silver/40 text-sm">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Custom Music Upload */}
            <div>
              <span className="text-silver font-alice block mb-3">
                Custom Background Music
              </span>
              <div className="space-y-3">
                {customMusicName ? (
                  <div className="flex items-center justify-between bg-black/50 border border-silver/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Music className="w-4 h-4 text-silver/60" />
                      <span className="text-silver font-alice text-sm">
                        {customMusicName}
                      </span>
                    </div>
                    <button
                      onClick={clearMusic}
                      className="text-silver/60 hover:text-silver"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => musicInputRef.current?.click()}
                    className="border-2 border-dashed border-silver/30 rounded-lg p-8 text-center cursor-pointer hover:border-silver/50 transition-colors"
                  >
                    <Music className="w-8 h-8 mx-auto mb-2 text-silver/40" />
                    <p className="text-silver/60 font-alice">
                      Click to upload music
                    </p>
                    <p className="text-silver/40 text-sm">
                      MP3, WAV up to 20MB
                    </p>
                  </div>
                )}
                <input
                  ref={musicInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleMusicUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Background Music Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-silver font-alice">
                Include Background Music
              </span>
              <button
                onClick={() =>
                  setVideoSettings((prev) => ({
                    ...prev,
                    includeBackgroundMusic: !prev.includeBackgroundMusic,
                  }))
                }
                className={`w-12 h-6 rounded-full transition-colors ${
                  videoSettings.includeBackgroundMusic
                    ? "bg-silver/40"
                    : "bg-silver/10"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-silver rounded-full transition-transform ${
                    videoSettings.includeBackgroundMusic
                      ? "translate-x-6"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Animation Speed */}
            <div>
              <span className="text-silver font-alice block mb-2">
                Animation Speed
              </span>
              <select
                value={videoSettings.animationSpeed}
                onChange={(e) =>
                  setVideoSettings((prev) => ({
                    ...prev,
                    animationSpeed: e.target.value as
                      | "slow"
                      | "normal"
                      | "fast",
                  }))
                }
                className="w-full bg-black/50 border border-silver/20 rounded px-3 py-2 text-silver"
              >
                <option value="slow">Slow</option>
                <option value="normal">Normal</option>
                <option value="fast">Fast</option>
              </select>
            </div>

            {/* Dialogue Lines Editor */}
            <div>
              <span className="text-silver font-alice block mb-2">
                Dialogue Lines
              </span>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {dialogueLines.map((line, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={line.character}
                      onChange={(e) => {
                        const newLines = [...dialogueLines];
                        newLines[index].character = e.target.value;
                        setDialogueLines(newLines);
                      }}
                      className="flex-1 bg-black/50 border border-silver/20 rounded px-2 py-1 text-silver text-sm"
                      placeholder="Character"
                    />
                    <input
                      type="text"
                      value={line.text}
                      onChange={(e) => {
                        const newLines = [...dialogueLines];
                        newLines[index].text = e.target.value;
                        setDialogueLines(newLines);
                      }}
                      className="flex-2 bg-black/50 border border-silver/20 rounded px-2 py-1 text-silver text-sm"
                      placeholder="Dialogue text"
                    />
                    <button
                      onClick={() => {
                        const newLines = dialogueLines.filter(
                          (_, i) => i !== index
                        );
                        setDialogueLines(newLines);
                      }}
                      className="text-silver/40 hover:text-silver/70 px-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  setDialogueLines([
                    ...dialogueLines,
                    { character: "", text: "" },
                  ])
                }
                className="mt-2 text-silver/60 hover:text-silver text-sm"
              >
                + Add Line
              </button>
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-black/50 text-silver/60 border border-silver/20 rounded hover:bg-silver/10"
            >
              Cancel
            </button>
            <button
              onClick={onGenerate}
              disabled={isGeneratingVideos}
              className="flex-1 py-2 bg-silver/10 text-silver border border-silver/20 rounded hover:bg-silver/20 disabled:opacity-50"
            >
              {isGeneratingVideos ? "Generating..." : "Generate All Videos"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-alice text-silver mb-4">
            Temporal Chronicles
          </h1>
          <p className="text-silver/60 font-alice">
            Interactive Visual Novel Experience
          </p>
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-black/50 border border-silver/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-silver/60 mb-2">
              <Star className="w-4 h-4" />
              <span className="font-alice">Karma Points</span>
            </div>
            <div className="text-2xl text-silver font-alice">1,250</div>
          </div>
          <div className="bg-black/50 border border-silver/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-silver/60 mb-2">
              <Trophy className="w-4 h-4" />
              <span className="font-alice">Achievements</span>
            </div>
            <div className="text-2xl text-silver font-alice">8/24</div>
          </div>
          <div className="bg-black/50 border border-silver/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-silver/60 mb-2">
              <Clock className="w-4 h-4" />
              <span className="font-alice">Time Played</span>
            </div>
            <div className="text-2xl text-silver font-alice">12h 30m</div>
          </div>
          <div className="bg-black/50 border border-silver/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-silver/60 mb-2">
              <Brain className="w-4 h-4" />
              <span className="font-alice">Knowledge</span>
            </div>
            <div className="text-2xl text-silver font-alice">Level 8</div>
          </div>
        </div>

        {/* Main Add Chapter Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowAddChapter(true)}
            className="px-8 py-4 bg-blue-900/20 text-blue-300 border border-blue-500/20 rounded-lg hover:bg-blue-900/30 transition-all font-alice flex items-center space-x-3 text-lg"
          >
            <Sparkles className="w-6 h-6" />
            <span>Add New Chapter</span>
          </button>
        </div>

        {/* Generation Progress */}
        {isGeneratingVideos && (
          <div className="bg-black/50 border border-silver/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-silver font-alice">
                Generating Videos
              </h3>
              <span className="text-silver/60">
                {generationProgress.current} / {generationProgress.total}
              </span>
            </div>
            <div className="w-full bg-silver/10 rounded-full h-3 mb-3">
              <div
                className="bg-purple-500/50 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (generationProgress.current / generationProgress.total) *
                    100
                  }%`,
                }}
              />
            </div>
            <p className="text-silver/60 font-alice">
              Currently generating: {generationProgress.currentChapter}
            </p>
          </div>
        )}

        {/* Chapter Selection */}
        <div className="grid grid-cols-2 gap-6">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className={`relative bg-black/50 border border-silver/20 rounded-lg overflow-hidden transition-transform hover:scale-[1.02] ${
                chapter.status === "locked" ? "opacity-50" : ""
              }`}
            >
              <div
                className="cursor-pointer"
                onClick={() =>
                  chapter.status !== "locked" && setSelectedChapter(chapter)
                }
              >
                <img
                  src={chapter.thumbnail}
                  alt={chapter.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl text-silver font-alice mb-2">
                    {chapter.title}
                  </h3>
                  <p className="text-silver/60 text-sm font-alice">
                    {chapter.description}
                  </p>
                  {chapter.status === "locked" && (
                    <div className="mt-2 flex items-center space-x-2 text-silver/40">
                      <Sparkles className="w-4 h-4" />
                      <span>{chapter.karma} Karma required</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Video Button */}
              {chapter.videoGenerated && chapter.videoBlob && (
                <button
                  onClick={() => downloadChapterVideo(chapter)}
                  className="absolute top-4 right-4 bg-green-900/70 text-green-300 border border-green-500/30 rounded-lg px-3 py-2 hover:bg-green-900/90 transition-all flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Download</span>
                </button>
              )}

              {/* Generate Video Button for individual chapters */}
              {!chapter.videoGenerated && chapter.status === "available" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedChapter(chapter);
                    setShowVideoSettings(true);
                  }}
                  className="absolute top-4 right-4 bg-purple-900/70 text-purple-300 border border-purple-500/30 rounded-lg px-3 py-2 hover:bg-purple-900/90 transition-all flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">Generate</span>
                </button>
              )}

              {/* Video Status Indicator */}
              <div className="absolute top-4 left-4">
                {chapter.videoGenerated ? (
                  <div className="bg-green-900/70 text-green-300 border border-green-500/30 rounded-full px-2 py-1 text-xs flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Video Ready</span>
                  </div>
                ) : (
                  <div className="bg-gray-900/70 text-gray-400 border border-gray-500/30 rounded-full px-2 py-1 text-xs flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <span>No Video</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chapter Details Modal */}
        {selectedChapter && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-40">
            <div className="bg-black/90 border border-silver/20 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="relative h-64">
                <img
                  src={selectedChapter.thumbnail}
                  alt={selectedChapter.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedChapter(null)}
                  className="absolute top-4 right-4 text-silver/60 hover:text-silver text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl text-silver font-alice mb-2">
                    {selectedChapter.title}
                  </h2>
                  <p className="text-silver/60 font-alice">
                    {selectedChapter.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Achievements */}
                  <div>
                    <h3 className="text-lg text-silver font-alice mb-4">
                      Achievements
                    </h3>
                    <div className="space-y-3">
                      {selectedChapter.achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg ${
                            achievement.unlocked
                              ? "bg-silver/10 text-silver"
                              : "bg-black/50 text-silver/40"
                          }`}
                        >
                          <achievement.icon className="w-5 h-5" />
                          <div>
                            <div className="font-alice">
                              {achievement.title}
                            </div>
                            <div className="text-sm">
                              {achievement.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reviews */}
                  <div>
                    <h3 className="text-lg text-silver font-alice mb-4">
                      Reviews
                    </h3>
                    <div className="space-y-4">
                      {selectedChapter.reviews.map((review, index) => (
                        <div key={index} className="bg-black/50 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <img
                              src={review.avatar}
                              alt={review.user}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <div className="text-silver font-alice">
                                {review.user}
                              </div>
                              <div className="text-silver/40 text-sm">
                                {review.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-silver"
                                    : "text-silver/20"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-silver/60">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="flex-1 py-3 bg-silver/10 text-silver border border-silver/20 rounded-lg hover:bg-silver/20 transition-all font-alice">
                    Begin Chapter
                  </button>
                  {selectedChapter.videoGenerated &&
                    selectedChapter.videoBlob && (
                      <button
                        onClick={() => downloadChapterVideo(selectedChapter)}
                        className="flex-1 py-3 bg-green-900/20 text-green-300 border border-green-500/20 rounded-lg hover:bg-green-900/30 transition-all font-alice flex items-center justify-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Video</span>
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}

        <AddChapterModal
          isOpen={showAddChapter}
          onClose={() => setShowAddChapter(false)}
          onAdd={(newChapterData) => {
            setChapters([
              ...chapters,
              {
                ...newChapterData,
                id: `ch${chapters.length + 1}`,
                achievements: [],
                reviews: [],
                videoGenerated: false,
              },
            ]);
            setShowAddChapter(false);
          }}
        />

        <VideoSettingsModal
          isOpen={showVideoSettings}
          onClose={() => setShowVideoSettings(false)}
          onGenerate={() => {
            setShowVideoSettings(false);
            generateAllVideos();
          }}
        />
      </div>
    </div>
  );
}
