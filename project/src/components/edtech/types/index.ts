export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  createdAt: Date;
  xpPoints: number;
  followedTeachers: string[];
}

export interface Teacher {
  id: string;
  userId: string;
  name: string;
  bio: string;
  professionalBackground: string;
  tags: string[];
  expertise: string;
  profilePhoto?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  isApproved: boolean;
  rating: number;
  totalStudents: number;
  totalClasses: number;
  createdAt: Date;
}

export interface Class {
  id: string;
  teacherId: string;
  title: string;
  topic: string;
  description: string;
  dateTime: Date;
  price: number;
  priceType: 'session' | 'monthly';
  topicsCovered: string[];
  homework?: Homework[];
  quizzes?: Quiz[];
  maxStudents?: number;
  enrolledStudents: string[];
  isLive: boolean;
  agoraChannelId?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Homework {
  id: string;
  classId: string;
  title: string;
  description: string;
  questions: HomeworkQuestion[];
  xpReward: number;
  dueDate: Date;
  submissions: HomeworkSubmission[];
}

export interface HomeworkQuestion {
  id: string;
  question: string;
  type: 'text' | 'multiple-choice' | 'code';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export interface HomeworkSubmission {
  id: string;
  studentId: string;
  homeworkId: string;
  answers: { questionId: string; answer: string }[];
  score: number;
  feedback: string;
  submittedAt: Date;
  aiEvaluated: boolean;
}

export interface Quiz {
  id: string;
  classId: string;
  title: string;
  questions: QuizQuestion[];
  xpReward: number;
  timeLimit: number; // in minutes
  attempts: QuizAttempt[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string;
  points: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  answers: { questionId: string; answer: string }[];
  score: number;
  completedAt: Date;
  timeSpent: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  enrolledAt: Date;
  progress: number;
  lastAccessedAt: Date;
  completedHomework: string[];
  completedQuizzes: string[];
}

export interface SocialPost {
  id: string;
  teacherId: string;
  content: string;
  type: 'milestone' | 'announcement' | 'achievement';
  attachments?: string[];
  likes: string[];
  comments: Comment[];
  createdAt: Date;
  sharedToSocial: {
    twitter: boolean;
    linkedin: boolean;
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
  tags: string[];
  priceRange: [number, number];
  difficulty: string[];
  rating: number;
  availability: 'all' | 'upcoming' | 'ongoing';
}