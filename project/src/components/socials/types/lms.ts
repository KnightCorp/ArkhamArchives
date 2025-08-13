export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  lessons: number;
  progress: number;
  completed: boolean;
  hoursSpent: number;
}