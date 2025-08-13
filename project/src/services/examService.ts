import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // AutoTrainerX backend URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface UploadResponse {
  message: string;
  data_count: number;
}

export interface FileInfo {
  filename: string;
  size: number;
  last_modified: number;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const examService = {
  // Upload study materials
  uploadFiles: async (files: File[], stream: string, exam: string, subject: string): Promise<UploadResponse> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('stream', stream);
    formData.append('exam', exam);
    formData.append('subject', subject);
    const response = await api.post('/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get list of uploaded files
  getFiles: async (): Promise<FileInfo[]> => {
    const response = await api.get('/files/');
    return response.data;
  },

  // Query the AI model with a specific question
  queryModel: async (prompt: string): Promise<string> => {
    const response = await api.post('/query/', { prompt });
    return response.data.response;
  },

  // Generate questions based on uploaded files or a specific file
  generateQuestions: async (subject: string, topic: string, questionCount: number = 5, fileName?: string): Promise<Question[]> => {
    const body: any = {
      subject,
      topic,
      prompt: `Generate ${questionCount} multiple choice questions about ${topic} for ${subject} exam preparation. Include options and explanations.`,
      question_count: questionCount
    };
    if (fileName) {
      body.fileName = fileName;
    }
    const response = await api.post('/generate-questions/', body);
    return response.data.questions;
  },

  // Check answer using backend
  checkAnswer: async (question: string, options: string[], userAnswer: string, correctAnswer: string): Promise<boolean> => {
    try {
      const response = await api.post('/check-answer/', {
        question,
        options,
        userAnswer,
        correctAnswer
      }, {
        timeout: 10000 // 10 second timeout
      });
      return response.data.isCorrect;
    } catch (error: any) {
      console.error('Error checking answer:', error);
      // Fallback to local checking if backend fails
      const normalize = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const userNorm = normalize(userAnswer);
      const correctNorm = normalize(correctAnswer);
      return userNorm === correctNorm;
    }
  }
}; 