import type { Course } from '../types/lms';

export const getLMSCourses = (): Course[] => [
  {
    id: 'journalism-101',
    title: 'Introduction to Journalism',
    description: 'Learn the fundamentals of journalistic writing and reporting',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop',
    duration: '8 weeks',
    lessons: 12,
    progress: 75,
    completed: false,
    hoursSpent: 24
  },
  {
    id: 'creative-writing',
    title: 'Creative Writing Essentials',
    description: 'Master the art of storytelling and narrative development',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop',
    duration: '6 weeks',
    lessons: 8,
    progress: 100,
    completed: true,
    hoursSpent: 18
  },
  {
    id: 'digital-media',
    title: 'Digital Media Production',
    description: 'Create compelling content for modern platforms',
    image: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800&h=400&fit=crop',
    duration: '10 weeks',
    lessons: 15,
    progress: 30,
    completed: false,
    hoursSpent: 12
  },
  {
    id: 'film-basics',
    title: 'Film Production Basics',
    description: 'Learn the fundamentals of filmmaking and cinematography',
    image: 'https://images.unsplash.com/photo-1500940405973-129682bd2795?w=800&h=400&fit=crop',
    duration: '12 weeks',
    lessons: 18,
    progress: 100,
    completed: true,
    hoursSpent: 36
  }
];