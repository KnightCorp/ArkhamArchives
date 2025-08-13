import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Clock,
  Users,
  Calendar,
  Star,
  BookOpen,
} from "lucide-react";
import { Class, Teacher } from "../../../types";
import {
  uploadTeacherNotes,
  uploadStudentSubmission,
  listTeacherFiles,
  listStudentSubmissions,
  downloadFile,
  generateQuizFromFile,
  gradeSubmissionFromFile,
  saveQuizToBackend,
  fetchSavedQuizzes,
  assignQuizToClass,
  fetchAssignedQuizzes,
} from "./services/lmsApi";
import { StudentQuizInterface } from "./components/StudentQuizInterface";
import { QuizResultsView } from "./components/QuizResultsView";

const mockClasses: Class[] = [
  {
    id: "1",
    teacherId: "1",
    title: "Introduction to Machine Learning",
    topic: "AI & Technology",
    description:
      "Learn the fundamentals of machine learning including supervised and unsupervised learning, neural networks, and practical applications.",
    dateTime: new Date("2024-01-20T10:00:00"),
    price: 99,
    priceType: "session",
    topicsCovered: [
      "Linear Regression",
      "Neural Networks",
      "Data Preprocessing",
      "Model Evaluation",
    ],
    enrolledStudents: ["student1", "student2", "student3"],
    isLive: false,
    tags: ["AI", "Machine Learning", "Python", "Data Science"],
    difficulty: "beginner",
    category: "Technology",
    duration: 120,
  },
  {
    id: "2",
    teacherId: "2",
    title: "Advanced React Development",
    topic: "Web Development",
    description:
      "Master advanced React concepts including hooks, context API, performance optimization, and modern patterns.",
    dateTime: new Date("2024-01-22T14:00:00"),
    price: 149,
    priceType: "session",
    topicsCovered: [
      "Advanced Hooks",
      "Performance Optimization",
      "State Management",
      "Testing",
    ],
    enrolledStudents: ["student4", "student5"],
    isLive: false,
    tags: ["React", "JavaScript", "Web Development", "Frontend"],
    difficulty: "advanced",
    category: "Technology",
    duration: 180,
  },
  {
    id: "3",
    teacherId: "3",
    title: "French Pastry Masterclass",
    topic: "Cooking & Culinary Arts",
    description:
      "Learn to create authentic French pastries including croissants, éclairs, and macarons with professional techniques.",
    dateTime: new Date("2024-01-25T16:00:00"),
    price: 89,
    priceType: "session",
    topicsCovered: [
      "Croissant Making",
      "Choux Pastry",
      "Macaron Techniques",
      "Plating & Presentation",
    ],
    enrolledStudents: ["student6", "student7", "student8", "student9"],
    isLive: false,
    tags: ["Cooking", "Baking", "French Cuisine", "Pastry"],
    difficulty: "intermediate",
    category: "Cooking",
    duration: 150,
  },
  {
    id: "4",
    teacherId: "4",
    title: "Complete Fitness Transformation",
    topic: "Health & Fitness",
    description:
      "12-week program covering strength training, cardio, nutrition planning, and lifestyle changes for total body transformation.",
    dateTime: new Date("2024-01-18T09:00:00"),
    price: 299,
    priceType: "monthly",
    topicsCovered: [
      "Strength Training",
      "Cardio Workouts",
      "Nutrition Planning",
      "Progress Tracking",
    ],
    enrolledStudents: ["student10", "student11"],
    isLive: false,
    tags: ["Fitness", "Nutrition", "Weight Training", "Health"],
    difficulty: "beginner",
    category: "Fitness",
    duration: 60,
  },
  {
    id: "5",
    teacherId: "1",
    title: "Deep Learning with TensorFlow",
    topic: "AI & Technology",
    description:
      "Advanced deep learning course covering CNNs, RNNs, and transformer models using TensorFlow and Keras.",
    dateTime: new Date("2024-01-30T11:00:00"),
    price: 199,
    priceType: "session",
    topicsCovered: [
      "CNN Architecture",
      "RNN & LSTM",
      "Transformer Models",
      "Model Deployment",
    ],
    enrolledStudents: ["student12"],
    isLive: false,
    tags: ["Deep Learning", "TensorFlow", "AI", "Neural Networks"],
    difficulty: "advanced",
    category: "Technology",
    duration: 200,
  },
  {
    id: "6",
    teacherId: "3",
    title: "Mediterranean Cooking Essentials",
    topic: "Cooking & Culinary Arts",
    description:
      "Explore the flavors of the Mediterranean with authentic recipes and cooking techniques from Greece, Italy, and Spain.",
    dateTime: new Date("2024-01-28T18:00:00"),
    price: 79,
    priceType: "session",
    topicsCovered: [
      "Greek Classics",
      "Italian Pasta",
      "Spanish Tapas",
      "Olive Oil & Herbs",
    ],
    enrolledStudents: ["student13", "student14", "student15"],
    isLive: false,
    tags: [
      "Mediterranean",
      "Cooking",
      "International Cuisine",
      "Healthy Eating",
    ],
    difficulty: "beginner",
    category: "Cooking",
    duration: 90,
  },
];

const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    userId: "user1",
    bio: "AI researcher and educator",
    professionalBackground: "PhD in Computer Science from MIT",
    tags: ["AI", "Machine Learning"],
    expertise: "Neural networks and deep learning",
    isApproved: true,
    rating: 4.9,
    totalStudents: 1250,
    totalClasses: 45,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "John Martinez",
    userId: "user2",
    bio: "Full-stack developer and startup founder",
    professionalBackground: "Senior Engineer at Facebook",
    tags: ["React", "JavaScript"],
    expertise: "Modern web development",
    isApproved: true,
    rating: 4.7,
    totalStudents: 890,
    totalClasses: 32,
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    userId: "user3",
    bio: "Professional chef and culinary instructor",
    professionalBackground: "Le Cordon Bleu graduate",
    tags: ["Cooking", "Baking"],
    expertise: "French cuisine and pastry arts",
    isApproved: true,
    rating: 4.8,
    totalStudents: 650,
    totalClasses: 28,
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "David Thompson",
    userId: "user4",
    bio: "Fitness trainer and nutrition expert",
    professionalBackground: "NASM certified personal trainer",
    tags: ["Fitness", "Nutrition"],
    expertise: "Strength training and body transformation",
    isApproved: true,
    rating: 4.6,
    totalStudents: 420,
    totalClasses: 18,
    createdAt: new Date(),
  },
];

// Utility to extract MCQ array from quiz.quiz (string or object)
function extractMCQArray(quizField: any): any[] | null {
  console.log('DEBUG: Extracting MCQ from:', quizField);
  
  if (!quizField) {
    console.log('DEBUG: No quiz field provided');
    return null;
  }

  // If it's already an array, return it
  if (Array.isArray(quizField)) {
    console.log('DEBUG: Quiz field is already an array');
    return quizField;
  }

  // If it's a string, try to parse it
  if (typeof quizField === 'string') {
    try {
      const parsed = JSON.parse(quizField);
      console.log('DEBUG: Parsed string to:', parsed);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // If it's an object with a quiz property
      if (parsed && typeof parsed === 'object' && parsed.quiz) {
        if (Array.isArray(parsed.quiz)) {
          return parsed.quiz;
        }
      }
    } catch (e) {
      console.log('DEBUG: Failed to parse string:', e);
    }
  }

  // If it's an object, check for quiz property
  if (quizField && typeof quizField === 'object') {
    if (quizField.quiz) {
      console.log('DEBUG: Found quiz property:', quizField.quiz);
      if (Array.isArray(quizField.quiz)) {
        return quizField.quiz;
      }
    }
    // If the object itself looks like a question array
    if (Array.isArray(quizField)) {
      return quizField;
    }
  }

  console.log('DEBUG: No valid MCQ array found');
  return null;
}

// Deduplicate quizzes by MCQ array content
function deduplicateQuizzesByContent(quizzes: any[]): any[] {
  const seen = new Set();
  const unique: any[] = [];
  for (const quiz of quizzes) {
    const mcqArray = extractMCQArray(quiz.quiz);
    const key = mcqArray ? JSON.stringify(mcqArray) : '';
    if (!seen.has(key)) {
      unique.push(quiz);
      seen.add(key);
    }
  }
  return unique;
}

const ClassesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredClasses, setFilteredClasses] = useState(mockClasses);

  // LMS upload state
  const [teacherFiles, setTeacherFiles] = useState<any[]>([]);
  const [teacherUploadFiles, setTeacherUploadFiles] = useState<File[]>([]);
  const [teacherUploadLoading, setTeacherUploadLoading] = useState(false);
  const [teacherUploadError, setTeacherUploadError] = useState<string | null>(null);
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [studentUploadLoading, setStudentUploadLoading] = useState(false);
  const [studentUploadError, setStudentUploadError] = useState<string | null>(null);
  const [studentSubmissions, setStudentSubmissions] = useState<any[]>([]);

  // New state for backend file uploads
  const [uploadedTeacherFile, setUploadedTeacherFile] = useState<any>(null);
  const [uploadedStudentFile, setUploadedStudentFile] = useState<any>(null);

  // New state for AI workflow
  const [aiInstructions, setAiInstructions] = useState("");
  const [selectedTeacherFileUrl, setSelectedTeacherFileUrl] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<string | null>(null);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [gradingInstructions, setGradingInstructions] = useState("");
  const [selectedStudentFileUrl, setSelectedStudentFileUrl] = useState<string | null>(null);
  const [gradeResult, setGradeResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const teacherFileInputRef = useRef<HTMLInputElement>(null);
  const studentFileInputRef = useRef<HTMLInputElement>(null);

  // Add state for saved quizzes/assignments
  const [savedQuizzes, setSavedQuizzes] = useState<any[]>([]);
  // Add state for assignment feedback
  const [assignStatus, setAssignStatus] = useState<{[quizId: string]: string}>({});
  const [selectedClassForQuiz, setSelectedClassForQuiz] = useState<{[quizId: string]: string}>({});

  // State for student class selection and assigned quizzes
  const [studentClassId, setStudentClassId] = useState<string>("");
  const [assignedQuizzes, setAssignedQuizzes] = useState<any[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<{[quizId: string]: string[]}>({});
  const [gradingResult, setGradingResult] = useState<{[quizId: string]: string}>({});
  const [gradingLoading, setGradingLoading] = useState<{[quizId: string]: boolean}>({});
  const [gradingError, setGradingError] = useState<{[quizId: string]: string}>({});

  // New state for long answer grading
  const [longAnswers, setLongAnswers] = useState<{[quizId: string]: string}>({});
  const [longFiles, setLongFiles] = useState<{[quizId: string]: File | null}>({});
  const [longGradingResult, setLongGradingResult] = useState<{[quizId: string]: string}>({});
  const [longGradingLoading, setLongGradingLoading] = useState<{[quizId: string]: boolean}>({});
  const [longGradingError, setLongGradingError] = useState<{[quizId: string]: string}>({});

  // Add at the top, after other useState hooks
  const [openQuizId, setOpenQuizId] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [showQuizInterface, setShowQuizInterface] = useState(false);
  const [showResultsView, setShowResultsView] = useState(false);
  const [selectedQuizForResults, setSelectedQuizForResults] = useState<string | null>(null);

  // Example user/teacher info (replace with real auth/user context)
  const teacherName = "Demo Teacher";
  const courseName = "Demo Course";
  const studentName = "Demo Student";
  const assignmentName = "Demo Assignment";

  const categories = [
    "all",
    "AI & Technology",
    "Web Development",
    "Cooking & Culinary Arts",
    "Health & Fitness",
    "Business & Marketing",
    "Arts & Design",
    "Music & Audio",
    "Languages",
    "Science & Mathematics",
  ];

  const difficulties = ["all", "beginner", "intermediate", "advanced"];
  const priceRanges = [
    { label: "All Prices", value: "all" },
    { label: "Free", value: "free" },
    { label: "Under $50", value: "under50" },
    { label: "$50 - $100", value: "50to100" },
    { label: "$100 - $200", value: "100to200" },
    { label: "Over $200", value: "over200" },
  ];

  useEffect(() => {
    let filtered = mockClasses;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (cls) =>
          cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cls.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cls.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cls.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((cls) => cls.topic === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (cls) => cls.difficulty === selectedDifficulty
      );
    }

    // Filter by price range
    if (priceRange !== "all") {
      filtered = filtered.filter((cls) => {
        const price = cls.price;
        switch (priceRange) {
          case "free":
            return price === 0;
          case "under50":
            return price < 50;
          case "50to100":
            return price >= 50 && price <= 100;
          case "100to200":
            return price >= 100 && price <= 200;
          case "over200":
            return price > 200;
          default:
            return true;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        filtered.sort(
          (a, b) => b.enrolledStudents.length - a.enrolledStudents.length
        );
        break;
    }

    setFilteredClasses(filtered);
  }, [searchQuery, selectedCategory, selectedDifficulty, priceRange, sortBy]);

  // Fetch teacher files and saved quizzes
  useEffect(() => {
    listTeacherFiles().then(setTeacherFiles).catch(() => setTeacherFiles([]));
    listStudentSubmissions().then(setStudentSubmissions).catch(() => setStudentSubmissions([]));
    fetchSavedQuizzes().then(setSavedQuizzes).catch(() => setSavedQuizzes([]));
  }, []);

  // Teacher upload handler
  const handleTeacherUpload = async () => {
    setTeacherUploadLoading(true);
    setTeacherUploadError(null);
    try {
      await uploadTeacherNotes(teacherUploadFiles, teacherName, courseName, "Class notes upload");
      setTeacherUploadFiles([]);
      const files = await listTeacherFiles();
      setTeacherFiles(files);
    } catch (err: any) {
      setTeacherUploadError(err.message || "Upload failed");
    } finally {
      setTeacherUploadLoading(false);
    }
  };

  // Student upload handler
  const handleStudentUpload = async () => {
    if (!studentFile) return;
    setStudentUploadLoading(true);
    setStudentUploadError(null);
    try {
      await uploadStudentSubmission(studentFile, studentName, assignmentName, "Assignment submission");
      setStudentFile(null);
      const submissions = await listStudentSubmissions();
      setStudentSubmissions(submissions);
    } catch (err: any) {
      setStudentUploadError(err.message || "Upload failed");
    } finally {
      setStudentUploadLoading(false);
    }
  };

  // Handler for teacher file upload (FastAPI backend)
  const handleTeacherFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      const result = await uploadTeacherNotes(files, "Demo Teacher", "Demo Course", "Class notes upload");
      setUploadedTeacherFile(result.uploaded[0]);
      setSelectedTeacherFileUrl(result.uploaded[0].public_url); // Use public_url for AI
    } catch (err: any) {
      setAiError(err.message || "Failed to upload teacher file");
    }
  };

  // Handler for student file upload (FastAPI backend)
  const handleStudentFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadStudentSubmission(file, "Demo Student", "Demo Assignment", "Assignment submission");
      setUploadedStudentFile(result.uploaded);
      setSelectedStudentFileUrl(result.uploaded.public_url); // Use public_url for AI
    } catch (err: any) {
      setAiError(err.message || "Failed to upload student file");
    }
  };

  // Handler for AI quiz generation
  const handleGenerateQuiz = async () => {
    if (!selectedTeacherFileUrl) return;
    setAiLoading(true);
    setAiError(null);
    setQuizResult(null);
    try {
      const result = await generateQuizFromFile(selectedTeacherFileUrl, aiInstructions);
      setQuizResult(result.quiz);
      // Save the generated quiz to the backend
      const quizData = {
        fileUrl: selectedTeacherFileUrl,
        fileName: teacherFiles.find(f => f.public_url === selectedTeacherFileUrl)?.filename || '',
        instructions: aiInstructions,
        quiz: result.quiz,
        // Optionally add teacher/course info if available
      };
      await saveQuizToBackend(quizData);
      // Refresh saved quizzes list
      const quizzes = await fetchSavedQuizzes();
      setSavedQuizzes(quizzes);
    } catch (err: any) {
      setAiError(err.message || "Failed to generate quiz");
    } finally {
      setAiLoading(false);
    }
  };

  // Handler for AI grading
  const handleGradeSubmission = async () => {
    if (!selectedTeacherFileUrl || !studentAnswer) return;
    setAiLoading(true);
    setAiError(null);
    setGradeResult(null);
    try {
      const result = await gradeSubmissionFromFile(selectedTeacherFileUrl, studentAnswer, gradingInstructions);
      setGradeResult(result.grade);
    } catch (err: any) {
      setAiError(err.message || "Failed to grade submission");
    } finally {
      setAiLoading(false);
    }
  };

  // Handler to assign quiz to class
  const handleAssignQuiz = async (quizId: string) => {
    const classId = selectedClassForQuiz[quizId];
    if (!classId) {
      setAssignStatus(prev => ({ ...prev, [quizId]: 'Please select a class.' }));
      return;
    }
    try {
      await assignQuizToClass(quizId, classId);
      setAssignStatus(prev => ({ ...prev, [quizId]: 'Assigned!' }));
    } catch (err: any) {
      setAssignStatus(prev => ({ ...prev, [quizId]: err.message || 'Failed to assign.' }));
    }
  };

  // Handler to fetch assigned quizzes for selected class
  const handleStudentClassChange = async (classId: string) => {
    setStudentClassId(classId);
    try {
      const quizzes = await fetchAssignedQuizzes(classId);
      setAssignedQuizzes(quizzes);
    } catch {
      setAssignedQuizzes([]);
    }
  };

  // Handler for MCQ answer change
  const handleMCQAnswerChange = (quizId: string, qIdx: number, value: string) => {
    setStudentAnswers(prev => {
      const arr = prev[quizId] ? [...prev[quizId]] : [];
      arr[qIdx] = value;
      return { ...prev, [quizId]: arr };
    });
  };

  // Handler to submit MCQ answers for grading
  const handleSubmitMCQAnswers = async (quiz: any) => {
    const quizId = quiz.id;
    setGradingLoading(prev => ({ ...prev, [quizId]: true }));
    setGradingError(prev => ({ ...prev, [quizId]: '' }));
    setGradingResult(prev => ({ ...prev, [quizId]: '' }));
    try {
      // Prepare student answer as JSON string
      const answers = studentAnswers[quizId] || [];
      const answerObj = quiz.parsedQuiz.map((q: any, idx: number) => ({
        question: q.question,
        selected: answers[idx] || '',
      }));
      const studentAnswerStr = JSON.stringify(answerObj);
      // Use the quiz's fileUrl as reference
      const result = await gradeSubmissionFromFile(quiz.fileUrl, studentAnswerStr, 'Grade these MCQ answers.');
      setGradingResult(prev => ({ ...prev, [quizId]: result.grade }));
    } catch (err: any) {
      setGradingError(prev => ({ ...prev, [quizId]: err.message || 'Failed to grade.' }));
    } finally {
      setGradingLoading(prev => ({ ...prev, [quizId]: false }));
    }
  };

  // Handler for long answer change
  const handleLongAnswerChange = (quizId: string, value: string) => {
    setLongAnswers(prev => ({ ...prev, [quizId]: value }));
  };
  const handleLongFileChange = (quizId: string, file: File | null) => {
    setLongFiles(prev => ({ ...prev, [quizId]: file }));
  };
  // Handler to submit long answer for grading
  const handleSubmitLongAnswer = async (quiz: any) => {
    const quizId = quiz.id;
    setLongGradingLoading(prev => ({ ...prev, [quizId]: true }));
    setLongGradingError(prev => ({ ...prev, [quizId]: '' }));
    setLongGradingResult(prev => ({ ...prev, [quizId]: '' }));
    try {
      let answer = longAnswers[quizId] || '';
      // If file is uploaded, read as text and append to answer
      const file = longFiles[quizId];
      if (file) {
        const fileText = await file.text();
        answer += '\n' + fileText;
      }
      const result = await gradeSubmissionFromFile(quiz.fileUrl, answer, 'Grade this long answer.');
      setLongGradingResult(prev => ({ ...prev, [quizId]: result.grade }));
    } catch (err: any) {
      setLongGradingError(prev => ({ ...prev, [quizId]: err.message || 'Failed to grade.' }));
    } finally {
      setLongGradingLoading(prev => ({ ...prev, [quizId]: false }));
    }
  };

  const handleQuizComplete = async (answers: string[], score: number) => {
    // Handle quiz completion - you can save results to backend here
    console.log('Quiz completed with score:', score);
    console.log('Answers:', answers);
    
    // You can add backend integration here to save the quiz results
    // For now, we'll just close the interface
    setShowQuizInterface(false);
    setSelectedQuiz(null);
  };

  const handleStartQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    setShowQuizInterface(true);
  };

  const handleViewResults = (quizId: string) => {
    setSelectedQuizForResults(quizId);
    setShowResultsView(true);
  };

  const getTeacherById = (teacherId: string) => {
    return mockTeachers.find((teacher) => teacher.id === teacherId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-white border-white";
      case "intermediate":
        return "text-yellow-400 border-yellow-400";
      case "advanced":
        return "text-red-400 border-red-400";
      default:
        return "text-white border-white";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source src="/lms.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 chrome-text">
            Discover Amazing Classes
          </h1>
          <p className="text-silver text-lg">
            Learn new skills from expert instructors across all subjects
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="glass-panel p-6 rounded-lg">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-silver" />
                <input
                  type="text"
                  placeholder="Search classes by title, topic, or instructor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-silver/30 rounded-lg text-white placeholder-silver/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-5 w-5 text-silver" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-black/50 border border-silver/30 rounded-lg text-white focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none cursor-pointer min-w-[180px]"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-black"
                    >
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="relative">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="pl-4 pr-8 py-3 bg-black/50 border border-silver/30 rounded-lg text-white focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none cursor-pointer"
                >
                  {difficulties.map((difficulty) => (
                    <option
                      key={difficulty}
                      value={difficulty}
                      className="bg-black"
                    >
                      {difficulty === "all"
                        ? "All Levels"
                        : difficulty.charAt(0).toUpperCase() +
                          difficulty.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="relative">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="pl-4 pr-8 py-3 bg-black/50 border border-silver/30 rounded-lg text-white focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none cursor-pointer"
                >
                  {priceRanges.map((range) => (
                    <option
                      key={range.value}
                      value={range.value}
                      className="bg-black"
                    >
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-4 pr-8 py-3 bg-black/50 border border-silver/30 rounded-lg text-white focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none cursor-pointer"
                >
                  <option value="newest" className="bg-black">
                    Newest
                  </option>
                  <option value="popular" className="bg-black">
                    Most Popular
                  </option>
                  <option value="price-low" className="bg-black">
                    Price: Low to High
                  </option>
                  <option value="price-high" className="bg-black">
                    Price: High to Low
                  </option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-silver text-sm">
              {filteredClasses.length} classes found
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => {
              const teacher = getTeacherById(cls.teacherId);
              return (
                <div
                  key={cls.id}
                  className="glass-panel p-6 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {/* Class Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-silver" />
                      <span className="text-sm text-silver">{cls.topic}</span>
                    </div>
                    <div
                      className={`px-2 py-1 border rounded-full text-xs ${getDifficultyColor(
                        cls.difficulty
                      )}`}
                    >
                      {cls.difficulty}
                    </div>
                  </div>

                  {/* Class Title */}
                  <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                    {cls.title}
                  </h3>

                  {/* Teacher Info */}
                  {teacher && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-silver to-white rounded-full flex items-center justify-center text-black font-bold text-sm">
                        {teacher.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="text-sm text-white">{teacher.name}</div>
                        <div className="flex items-center gap-1 text-xs text-silver">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{teacher.rating}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-silver text-sm mb-4 line-clamp-3">
                    {cls.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cls.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white"
                      >
                        {tag}
                      </span>
                    ))}
                    {cls.tags.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-silver">
                        +{cls.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Class Info */}
                  <div className="flex items-center justify-between text-sm text-silver mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{cls.dateTime.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{cls.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{cls.enrolledStudents.length} enrolled</span>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div className="text-white font-semibold">
                      ${cls.price}
                      <span className="text-sm text-silver ml-1">
                        /{cls.priceType}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                        Preview
                      </button>
                      <button className="bg-white hover:bg-silver text-black py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LMS File Uploads Section */}
        <div className="max-w-7xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Teacher Upload Section */}
          <div className="glass-panel p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Upload Class Notes/Assignments (Teacher)</h2>
            <input
              type="file"
              multiple
              onChange={e => setTeacherUploadFiles(Array.from(e.target.files || []))}
              className="mb-2"
            />
            <button
              onClick={handleTeacherUpload}
              disabled={teacherUploadLoading || teacherUploadFiles.length === 0}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {teacherUploadLoading ? "Uploading..." : "Upload"}
            </button>
            {teacherUploadError && <div className="text-red-400 mt-2">{teacherUploadError}</div>}
            <h3 className="mt-6 mb-2 font-semibold">Uploaded Files</h3>
            <ul className="space-y-2">
              {teacherFiles.map((file, idx) => (
                <li key={idx} className="flex items-center justify-between bg-white/10 px-3 py-2 rounded">
                  <span>{file.filename}</span>
                  <button
                    onClick={() => downloadFile("notes", file.filename)}
                    className="text-blue-400 hover:underline ml-4"
                  >
                    Download
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Student Submission Section */}
          <div className="glass-panel p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Submit Assignment (Student)</h2>
            {/* In the student section, remove the file upload input for assignment submission.
            Only show MCQ questions with radio options and a submit button. */}
            <h3 className="mt-6 mb-2 font-semibold">Your Submissions</h3>
            <ul className="space-y-2">
              {studentSubmissions.map((sub, idx) => (
                <li key={idx} className="flex items-center justify-between bg-white/10 px-3 py-2 rounded">
                  <span>{sub.filename}</span>
                  <button
                    onClick={() => downloadFile("submissions", sub.filename)}
                    className="text-green-400 hover:underline ml-4"
                  >
                    Download
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- LMS AI Workflow Section --- */}
        <div className="max-w-7xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Teacher AI Section */}
          <div className="glass-panel p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Teacher: Generate Quiz/Assignment from Uploaded Notes</h2>
            {/* Dropdown to select from uploaded files */}
            <select
              value={selectedTeacherFileUrl || ''}
              onChange={e => setSelectedTeacherFileUrl(e.target.value)}
              className="mb-2 w-full bg-black/50 border border-white/20 text-white px-3 py-2 rounded"
            >
              <option value="" disabled>Select a file to generate quiz/assignment</option>
              {teacherFiles.map((file, idx) => (
                <option key={idx} value={file.public_url}>{file.filename}</option>
              ))}
            </select>
            <textarea
              value={aiInstructions}
              onChange={e => setAiInstructions(e.target.value)}
              placeholder="AI instructions (e.g., Generate 5 MCQs, or include keywords X, Y, Z)"
              className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 mb-2"
            />
            <button
              onClick={handleGenerateQuiz}
              disabled={!selectedTeacherFileUrl || aiLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center gap-2"
            >
              {aiLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Quiz/Assignment'
              )}
            </button>
            {aiError && <div className="text-red-400 mt-2">{aiError}</div>}
            {quizResult && (
              <div className="mt-4 bg-white/10 p-4 rounded">
                <h3 className="font-semibold mb-2">AI-Generated Quiz/Assignment</h3>
                <pre className="whitespace-pre-wrap text-green-200">{quizResult}</pre>
              </div>
            )}
          </div>
          {/* Student AI Section */}
          <div className="glass-panel p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Student: Upload Answer & Get AI Feedback</h2>
            {/* In the student section, remove the file upload input for assignment submission.
            Only show MCQ questions with radio options and a submit button. */}
            <textarea
              value={studentAnswer}
              onChange={e => setStudentAnswer(e.target.value)}
              placeholder="Paste your answer here (or upload a file above)"
              className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 mb-2"
            />
            <textarea
              value={gradingInstructions}
              onChange={e => setGradingInstructions(e.target.value)}
              placeholder="Grading instructions (e.g., Must include keywords X, Y, Z)"
              className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 mb-2"
            />
            <button
              onClick={handleGradeSubmission}
              disabled={!selectedTeacherFileUrl || !studentAnswer || aiLoading}
              className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {aiLoading ? "Grading..." : "Submit for AI Grading"}
            </button>
            {aiError && <div className="text-red-400 mt-2">{aiError}</div>}
            {gradeResult && (
              <div className="mt-4 bg-white/10 p-4 rounded">
                <h3 className="font-semibold mb-2">AI-Generated Grade/Feedback</h3>
                <pre className="whitespace-pre-wrap text-green-200">{gradeResult}</pre>
              </div>
            )}
          </div>
        </div>
        {/* Below the AI generation section, display saved quizzes with assignment UI */}
        {savedQuizzes.length > 0 && (
          <div className="mt-8 bg-white/10 p-4 rounded">
            <h3 className="font-semibold mb-2 text-lg">Saved Quizzes/Assignments</h3>
            <ul className="space-y-4">
              {deduplicateQuizzesByContent(savedQuizzes).map((quiz, idx) => {
                const mcqArray = extractMCQArray(quiz.quiz);
                return (
                  <li key={quiz.id || idx} className="bg-black/30 p-3 rounded">
                    <div className="text-silver text-sm mb-1">
                      <span className="font-bold">File:</span> {quiz.fileName} <span className="ml-4 font-bold">Created:</span> {quiz.created_at ? new Date(quiz.created_at).toLocaleString() : ''}
                    </div>
                    <div className="text-silver text-xs mb-1"><span className="font-bold">Instructions:</span> {quiz.instructions}</div>
                    {mcqArray && mcqArray.length > 0 ? (
                      <div className="mb-2 space-y-4">
                        {mcqArray.map((q: any, qIdx: number) => (
                          <div key={qIdx} className="bg-black/60 border border-white/20 rounded-lg p-4 shadow-md">
                            <div className="text-lg font-bold text-white mb-2">{qIdx + 1}. {q.question}</div>
                            <ul className="ml-2 space-y-2">
                              {q.options && q.options.map((opt: string, oIdx: number) => (
                                <li key={oIdx} className="flex items-center gap-2">
                                  <span className="inline-block w-3 h-3 rounded-full border border-blue-400 bg-blue-600/30 mr-2"></span>
                                  <span className="text-silver hover:text-white transition-colors">{opt}</span>
                                </li>
                              ))}
                            </ul>
                            {(q.answer || q.correct_answer) && (
                              <div className="mt-3">
                                <span className="inline-block bg-green-700/80 text-green-200 text-xs font-semibold px-3 py-1 rounded-full shadow">Answer: {q.answer || q.correct_answer}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-silver">No valid questions found for this quiz.</div>
                    )}
                    {/* Assignment UI */}
                    <div className="flex items-center gap-2 mb-1">
                      <select
                        value={selectedClassForQuiz[quiz.id] || ''}
                        onChange={e => setSelectedClassForQuiz(prev => ({ ...prev, [quiz.id]: e.target.value }))}
                        className="bg-black/50 border border-white/20 text-white px-2 py-1 rounded"
                      >
                        <option value="" disabled>Select class to assign</option>
                        {mockClasses.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.title}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAssignQuiz(quiz.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Assign
                      </button>
                      <button 
                        onClick={() => handleViewResults(quiz.id)} 
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        View Results
                      </button>
                      {assignStatus[quiz.id] && <span className="ml-2 text-xs text-green-400">{assignStatus[quiz.id]}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* --- Student Assigned Quizzes Section --- */}
        <div className="max-w-7xl mx-auto mt-8 mb-8">
          <div className="glass-panel p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Assigned Quizzes/Assignments (Student)</h2>
            <div className="mb-4">
              <label className="mr-2">Select your class:</label>
              <select
                value={studentClassId}
                onChange={e => handleStudentClassChange(e.target.value)}
                className="bg-black/50 border border-white/20 text-white px-2 py-1 rounded"
              >
                <option value="" disabled>Select class</option>
                {mockClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.title}</option>
                ))}
              </select>
            </div>
            {studentClassId && (
              assignedQuizzes.length > 0 ? (
                <ul className="space-y-4">
                  {deduplicateQuizzesByContent(assignedQuizzes).map((quiz, idx) => {
                    const mcqArray = extractMCQArray(quiz.quiz);
                    quiz.parsedQuiz = mcqArray;
                    return (
                      <li key={quiz.id || idx} className="bg-black/30 p-3 rounded">
                        <div className="text-silver text-sm mb-1">
                          <span className="font-bold">File:</span> {quiz.fileName} <span className="ml-4 font-bold">Created:</span> {quiz.created_at ? new Date(quiz.created_at).toLocaleString() : ''}
                        </div>
                        <div className="text-silver text-xs mb-1"><span className="font-bold">Instructions:</span> {quiz.instructions}</div>
                        {mcqArray && mcqArray.length > 0 ? (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium">
                                {mcqArray.length} Questions Available
                              </span>
                              <button
                                onClick={() => handleStartQuiz(quiz)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                              >
                                Start Quiz
                              </button>
                            </div>
                            <div className="text-sm text-gray-400">
                              Click "Start Quiz" to begin the assessment
                            </div>
                          </div>
                        ) : (
                          <div className="text-silver">No valid questions found for this quiz.</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-silver">No quizzes/assignments assigned to this class yet.</div>
              )
            )}
          </div>
        </div>

        {/* Quiz Interface Modal */}
        {showQuizInterface && selectedQuiz && (
          <StudentQuizInterface
            quiz={selectedQuiz}
            onComplete={handleQuizComplete}
            onClose={() => {
              setShowQuizInterface(false);
              setSelectedQuiz(null);
            }}
            studentId="student_1"
            studentName="Demo Student"
            classId={studentClassId}
          />
        )}

        {/* Quiz Results Modal */}
        {showResultsView && selectedQuizForResults && (
          <QuizResultsView
            quizId={selectedQuizForResults}
            classId={studentClassId || "default_class"}
            onClose={() => {
              setShowResultsView(false);
              setSelectedQuizForResults(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ClassesPage;
