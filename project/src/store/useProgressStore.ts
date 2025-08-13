import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import useAuthStore from "./useAuthStore";

interface LessonProgress {
  percent: number;
  completedQuestions: number[];
}

interface LanguageProgress {
  [topic: string]: LessonProgress;
}

interface ProgressState {
  xp: number;
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  progress: {
    [language: string]: LanguageProgress;
  };
  isLoading: boolean;
  fetchProgress: () => Promise<void>;
  saveProgress: () => Promise<void>;
  updateProgress: (
    language: string,
    topic: string,
    percent: number,
    completedQuestions: number[]
  ) => void;
  addXP: (amount: number) => void;
  isLevelUnlocked: (language: string, levelOrder: string[], currentLevel: string) => boolean;
  getXPForNextLevel: (level: number) => number;
  isLessonComplete: (language: string, topic: string, totalQuestions: number) => boolean;
  resetProgress: () => void;
}

const useProgressStore = create<ProgressState>((set, get) => {
  // No localStorage usage; everything is backend-driven
  return {
    xp: 0,
    totalXP: 0,
    level: 1,
    xpToNextLevel: 1000,
    progress: {},
    isLoading: false,

    fetchProgress: async () => {
      set({ isLoading: true });
      try {
        const user = useAuthStore.getState().authUser;
        if (!user || !user._id) throw new Error("User not logged in");
        const res = await axiosInstance.get("/user/progress", { params: { user_id: user._id } });
        const totalXP = res.data.totalXP || 0;
        const level = res.data.level || 1;
        const xpForNext = get().getXPForNextLevel(level);
        set({
          xp: totalXP % xpForNext,
          totalXP,
          level,
          xpToNextLevel: xpForNext,
          progress: res.data.progress || {},
        });
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to fetch progress");
      } finally {
        set({ isLoading: false });
      }
    },

    saveProgress: async () => {
      const user = useAuthStore.getState().authUser;
      if (!user || !user._id) return;
      const { totalXP, level, progress } = get();
      try {
        await axiosInstance.post("/user/progress", { user_id: user._id, totalXP, level, progress });
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to save progress");
      }
    },

    updateProgress: (language, topic, percent, completedQuestions) => {
      set((state) => {
        const lang = state.progress[language] || {};
        return {
          progress: {
            ...state.progress,
            [language]: {
              ...lang,
              [topic]: { percent, completedQuestions },
            },
          },
        };
      });
      get().saveProgress();
    },

    addXP: (amount) => {
      set((state) => {
        let newTotalXP = state.totalXP + amount;
        let newLevel = state.level;
        let xpForNext = get().getXPForNextLevel(newLevel);
        while (newTotalXP >= (newLevel * 1000 + 200 * (newLevel - 1))) {
          newLevel += 1;
          xpForNext = get().getXPForNextLevel(newLevel);
        }
        return {
          xp: newTotalXP % xpForNext,
          totalXP: newTotalXP,
          level: newLevel,
          xpToNextLevel: xpForNext,
        };
      });
      get().saveProgress();
    },

    isLevelUnlocked: (language, levelOrder, currentLevel) => {
      // Only unlocked if all previous levels are 100% complete
      const langProgress = get().progress[language] || {};
      const idx = levelOrder.indexOf(currentLevel);
      if (idx === 0) return true;
      for (let i = 0; i < idx; i++) {
        const prev = langProgress[levelOrder[i]];
        if (!prev || prev.percent < 100) return false;
      }
      return true;
    },

    getXPForNextLevel: (level) => 1000 + 200 * level,

    isLessonComplete: (language, topic, totalQuestions) => {
      const langProgress = get().progress[language] || {};
      const lesson = langProgress[topic];
      return lesson && lesson.completedQuestions.length >= totalQuestions;
    },

    resetProgress: () => {
      set({ xp: 0, totalXP: 0, level: 1, xpToNextLevel: 1000, progress: {} });
    },
  };
});

export default useProgressStore; 