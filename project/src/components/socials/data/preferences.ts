export const preferenceCategories = {
  interests: {
    title: "Interests & Hobbies",
    description: "What topics and activities do you enjoy?",
    suggestions: [
      // Music & Audio
      "music",
      "jazz",
      "hiphop",
      "electronic",
      "rock",
      "classical",
      "indie",

      // Visual Arts & Tech
      "art",
      "photography",
      "painting",
      "digital-art",
      "tech",
      "gaming",
      "coding",
      "ai",
      "crypto",

      // Lifestyle & Activities
      "fitness",
      "yoga",
      "cooking",
      "travel",
      "nature",
      "fashion",
      "beauty",
      "wellness",

      // Specialized Interests
      "spirituality",
      "science",
      "politics",
      "business",
      "education",
      "diy",
      "pets",
      "family",

      // Additional interests
      "sports",
      "reading",
      "movies",
      "investing",
      "web-development",
      "design",
      "writing",
      "podcasts",
      "social-media",
      "streaming",
      "animation",
    ],
  },

  aesthetics: {
    title: "Aesthetic Preferences",
    description: "What visual styles and themes appeal to you?",
    suggestions: [
      // Core aesthetics from your DB
      "minimalism",
      "vintage",
      "cyberpunk",
      "gothic",
      "bohemian",
      "urban",
      "street-art",
      "cottagecore",
      "dark-academia",
      "vaporwave",
      "y2k",
      "grunge",
      "kawaii",
      "industrial",

      // Additional aesthetic options
      "modern",
      "futuristic",
      "retro",
      "neon",
      "abstract",
      "geometric",
      "organic",
      "monochrome",
      "gradient",
      "glitch",
      "synthwave",
      "brutalist",
      "art-deco",
      "japanese",
      "scandinavian",
      "pastel",
      "bold-colors",
    ],
  },

  genres: {
    title: "Content Genres",
    description: "What types of content do you prefer?",
    suggestions: [
      // Entertainment genres from your DB
      "comedy",
      "drama",
      "horror",
      "romance",
      "action",
      "documentary",

      // Additional content genres
      "tutorial",
      "educational",
      "sci-fi",
      "fantasy",
      "mystery",
      "thriller",
      "adventure",
      "news",
      "reviews",
      "tech-reviews",
      "lifestyle",
      "vlog",
      "music-videos",
      "animation",
      "experimental",
      "art-films",
      "short-films",
      "live-streams",
      "asmr",
      "meditation",
      "gaming-content",
      "cooking-shows",
      "travel-vlogs",
      "fitness-content",
    ],
  },

  moods: {
    title: "Preferred Moods",
    description: "What kind of emotional tone do you enjoy in content?",
    suggestions: [
      // Mood-based tags from your DB
      "chill",
      "energetic",
      "inspiring",
      "melancholic",
      "mysterious",
      "uplifting",
      "nostalgic",

      // Additional mood options
      "relaxing",
      "motivational",
      "peaceful",
      "exciting",
      "contemplative",
      "playful",
      "dramatic",
      "intense",
      "calming",
      "empowering",
      "thought-provoking",
      "humorous",
      "romantic",
      "adventurous",
    ],
  },
};

// Helper function to get all available tags by category
export interface PreferenceCategory {
  title: string;
  description: string;
  suggestions: string[];
}

export interface PreferenceCategories {
  [key: string]: PreferenceCategory;
}

export type PreferenceCategoryKey = keyof typeof preferenceCategories;

export const getTagsByCategory = (
  category: PreferenceCategoryKey
): string[] => {
  return preferenceCategories[category]?.suggestions || [];
};

// Helper function to validate if a tag exists in any category
export interface IsValidTagFn {
  (tag: string): boolean;
}

export const isValidTag: IsValidTagFn = (tag) => {
  return Object.values(preferenceCategories).some((category) =>
    category.suggestions.includes(tag)
  );
};

// Helper function to get category for a specific tag
export interface GetCategoryForTagFn {
  (tag: string): PreferenceCategoryKey | null;
}

export const getCategoryForTag: GetCategoryForTagFn = (tag) => {
  for (const [categoryName, categoryData] of Object.entries(
    preferenceCategories
  )) {
    if (categoryData.suggestions.includes(tag)) {
      return categoryName as PreferenceCategoryKey;
    }
  }
  return null;
};
