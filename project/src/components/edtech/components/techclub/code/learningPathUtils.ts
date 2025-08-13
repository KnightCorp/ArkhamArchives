// Learning Path Utilities
// Handles loading and managing learning path data from JSON files

export interface LearningPathQuestion {
  title: string;
  instructions: string;
  hint: string;
}

export interface LearningPathData {
  [language: string]: LearningPathQuestion[];
}

// Import all learning path data
import pythonData from './learning_paths/python.json';
import javaData from './learning_paths/java.json';
import cppData from './learning_paths/cpp.json';
import cData from './learning_paths/c.json';
import javascriptData from './learning_paths/javascript.json';

// Map language IDs to their JSON data
const learningPathData: Record<string, LearningPathQuestion[]> = {
  python: pythonData,
  java: javaData,
  cpp: cppData,
  c: cData,
  javascript: javascriptData,
};

// Get all questions for a specific language
export const getLearningPathQuestions = (language: string): LearningPathQuestion[] => {
  return learningPathData[language] || [];
};

// Get a specific question by index
export const getQuestionByIndex = (language: string, index: number): LearningPathQuestion | null => {
  const questions = getLearningPathQuestions(language);
  return questions[index] || null;
};

// Get total number of questions for a language
export const getTotalQuestions = (language: string): number => {
  return getLearningPathQuestions(language).length;
};

// Check if a question is completed (for tracking progress)
export const isQuestionCompleted = (
  completedQuestions: number[],
  questionIndex: number
): boolean => {
  return completedQuestions.includes(questionIndex);
};

// Get next uncompleted question index
export const getNextUncompletedQuestion = (
  language: string,
  completedQuestions: number[]
): number => {
  const totalQuestions = getTotalQuestions(language);
  for (let i = 0; i < totalQuestions; i++) {
    if (!completedQuestions.includes(i)) {
      return i;
    }
  }
  return -1; // All questions completed
};

// Get progress percentage
export const getProgressPercentage = (
  language: string,
  completedQuestions: number[]
): number => {
  const totalQuestions = getTotalQuestions(language);
  if (totalQuestions === 0) return 0;
  return (completedQuestions.length / totalQuestions) * 100;
};

// Get available languages
export const getAvailableLanguages = (): string[] => {
  return Object.keys(learningPathData);
};

// Validate language exists
export const isValidLanguage = (language: string): boolean => {
  return getAvailableLanguages().includes(language);
}; 