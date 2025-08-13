// Core data models for the LMS marketplace

export interface Teacher {
  id: string;
  userId: string;
  name: string;
  bio: string;
  professionalBackground: string;
  tags: string[];
  expertise: string;
  isApproved: boolean;
  rating: number;
  totalStudents: number;
  totalClasses: number;
  createdAt: Date;
  profilePhoto?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
}

export interface Class {
  id: string;
  teacherId: string;
  title: string;
  topic: string; // Can be any subject: "Technology", "Cooking", "Fitness", "Music", etc.
  description: string;
  dateTime: Date;
  price: number;
  priceType: "session" | "monthly" | "course";
  topicsCovered: string[];
  enrolledStudents: string[];
  isLive: boolean;
  tags: string[]; // Open to any tags, not just tech
  difficulty: "beginner" | "intermediate" | "advanced";
  category:
    | "Technology"
    | "Cooking"
    | "Fitness"
    | "Music"
    | "Art"
    | "Business"
    | "Language"
    | "Science"
    | "Health"
    | "Other";
  duration: number; // in minutes
  prerequisites?: string[];
  certificateOffered?: boolean;
  homeworkTasks?: HomeworkTask[];
  quizzes?: Quiz[];
}

export interface HomeworkTask {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  xpReward: number;
  isCompleted: boolean;
  submissionDate?: Date;
  aiEvaluation?: {
    score: number;
    feedback: string;
    evaluatedAt: Date;
  };
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  xpReward: number;
  timeLimit?: number;
  isCompleted: boolean;
  score?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  totalXP: number;
  level: number;
  enrolledClasses: string[];
  followedTeachers: string[];
  completedTasks: string[];
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface SocialPost {
  id: string;
  teacherId: string;
  content: string;
  type: "milestone" | "announcement" | "achievement";
  likes: string[];
  comments: Comment[];
  createdAt: Date;
  sharedToSocial?: {
    twitter?: boolean;
    linkedin?: boolean;
    instagram?: boolean;
  };
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  likes: string[];
}

export interface SearchFilters {
  tags?: string[];
  priceRange?: [number, number];
  difficulty?: string[];
  rating?: number;
  availability?: "live" | "recorded" | "both";
}

export interface UserRole {
  type: "student" | "teacher" | "admin";
  permissions: string[];
}

export interface Subscription {
  id: string;
  studentId: string;
  teacherId?: string;
  classId?: string;
  type: "teacher" | "class" | "monthly_bundle";
  startDate: Date;
  endDate: Date;
  price: number;
  isActive: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  riddle: string;
  difficulty: "NOVICE" | "APPRENTICE" | "EXPERT" | "MASTER";
  totalXP: number;
  currentXP: number;
  level: number;
  totalLevels: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  icon: React.ReactNode;
  prerequisites?: string[];
  imageUrl: string;
}
