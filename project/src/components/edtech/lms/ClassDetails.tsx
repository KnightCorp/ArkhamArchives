import React, { useState, useEffect } from "react";
import {
  Video,
  Mic,
  Settings,
  Users,
  Calendar,
  Clock,
  Book,
  ArrowLeft,
  Play,
  Square,
  MicOff,
  VideoOff,
  Copy,
  CheckCircle,
} from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
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

// Utility function to format date and time together
const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return "N/A";

  const dateObj = date instanceof Date ? date : new Date(date);

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) return "Invalid Date";

  return dateObj.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Utility function to format just time
const formatTime = (date: Date | string | null | undefined): string => {
  if (!date) return "N/A";

  const dateObj = date instanceof Date ? date : new Date(date);

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) return "Invalid Time";

  return dateObj.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

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

interface ClassDetailsProps {
  classData: any;
  user: any;
  teachers: any[];
  isTeacher: () => boolean;
  onBack: () => void;
}

export const ClassDetails: React.FC<ClassDetailsProps> = ({
  classData,
  user,
  teachers,
  isTeacher,
  onBack,
}) => {
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isClassTime, setIsClassTime] = useState(false);
  const [hostSessionId, setHostSessionId] = useState("");
  const [attendeeSessionId, setAttendeeSessionId] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [showQuizInterface, setShowQuizInterface] = useState(false);
  const [showResultsView, setShowResultsView] = useState(false);
  const [selectedQuizForResults, setSelectedQuizForResults] = useState<string | null>(null);

  const teacher = teachers.find((t) => t.id === classData?.teacherId);
  const isCurrentUserTeacher = isTeacher() && teacher?.user_id === user?.id;

  // Add isAdmin stub if not present
  const isAdmin = () => false; // TODO: Replace with real admin check if available

  // Load existing links from Supabase
  useEffect(() => {
    const loadLinks = async () => {
      if (!classData?.id) return;

      try {
        const { data, error } = await supabase
          .from("live_session_links")
          .select("host_link, attendee_link")
          .eq("class_id", classData.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "not found" error
          console.error("Error loading session links:", error);
          return;
        }

        if (data) {
          setHostSessionId(data.host_link || "");
          setAttendeeSessionId(data.attendee_link || "");
        }
      } catch (error) {
        console.error("Error loading session links:", error);
      }
    };

    loadLinks();
  }, [classData?.id]);

  // Save links to Supabase whenever they change
  const saveLinksToSupabase = async (
    newHostSessionId: string,
    newAttendeeSessionId: string
  ) => {
    if (!classData?.id || !user?.id) return;

    try {
      const { error } = await supabase.from("live_session_links").upsert(
        {
          class_id: classData.id,
          host_link: newHostSessionId,
          attendee_link: newAttendeeSessionId,
          teacher_id: user.id,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "class_id",
        }
      );

      if (error) {
        console.error("Error saving session links:", error);
      } else {
        console.log("Session links saved successfully");
      }
    } catch (error) {
      console.error("Error saving session links:", error);
    }
  };

  // Check if it's class time (within 10 minutes of scheduled time)
  useEffect(() => {
    if (!classData?.dateTime) return;

    const checkClassTime = () => {
      const now = new Date();
      const classTime = new Date(classData.dateTime);
      const timeDiff = classTime.getTime() - now.getTime();
      const minutesDiff = timeDiff / (1000 * 60);

      // Class time is considered active 10 minutes before to 2 hours after
      setIsClassTime(minutesDiff <= 10 && minutesDiff >= -120);
    };

    checkClassTime();
    const interval = setInterval(checkClassTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [classData?.dateTime]);

  const handleStartStream = () => {
    // Just open Agora for the teacher - they'll populate links manually
    window.open("https://web-dun-iota.vercel.app/", "_blank");
    console.log("Opening Agora live streaming platform...");
  };

  const handleEndStream = () => {
    setIsLive(false);
    setViewerCount(0);
    setHostSessionId("");
    setAttendeeSessionId("");
    console.log("Ending live stream...");
  };

  const joinStream = () => {
    // Always redirect to the main Agora platform
    // Students will manually enter the room ID there
    const streamUrl = "https://web-dun-iota.vercel.app/";
    window.open(streamUrl, "_blank");
    console.log(
      "Opening Agora platform for student to join with room ID:",
      attendeeSessionId
    );
  };

  const handleHostSessionIdChange = (newSessionId: string) => {
    setHostSessionId(newSessionId);
    if (isCurrentUserTeacher) {
      saveLinksToSupabase(newSessionId, attendeeSessionId);
    }
  };

  const handleAttendeeSessionIdChange = (newSessionId: string) => {
    setAttendeeSessionId(newSessionId);
    if (isCurrentUserTeacher) {
      saveLinksToSupabase(hostSessionId, newSessionId);
    }
  };

  // Validate if a string is a valid session ID (UUID format)
  const isValidSessionId = (sessionId: string): boolean => {
    if (!sessionId || !sessionId.trim()) return false;
    const sessionIdPattern =
      /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
    return sessionIdPattern.test(sessionId.trim());
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
      console.log(`${type} link copied to clipboard`);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // --- LMS State and Handlers (add inside ClassDetails component, before return) ---
  const [teacherFiles, setTeacherFiles] = useState<any[]>([]);
  const [teacherUploadFiles, setTeacherUploadFiles] = useState<File[]>([]);
  const [teacherUploadLoading, setTeacherUploadLoading] = useState(false);
  const [teacherUploadError, setTeacherUploadError] = useState<string | null>(null);
  const [aiInstructions, setAiInstructions] = useState("");
  const [selectedTeacherFileUrl, setSelectedTeacherFileUrl] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<string | null>(null);
  const [savedQuizzes, setSavedQuizzes] = useState<any[]>([]);
  const [assignStatus, setAssignStatus] = useState<{[quizId: string]: string}>({});
  const [assignedQuizzes, setAssignedQuizzes] = useState<any[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<{[quizId: string]: string[]}>({});
  const [gradingResult, setGradingResult] = useState<{[quizId: string]: string}>({});
  const [gradingLoading, setGradingLoading] = useState<{[quizId: string]: boolean}>({});
  const [gradingError, setGradingError] = useState<{[quizId: string]: string}>({});
  const [longAnswers, setLongAnswers] = useState<{[quizId: string]: string}>({});
  const [longFiles, setLongFiles] = useState<{[quizId: string]: File | null}>({});
  const [longGradingResult, setLongGradingResult] = useState<{[quizId: string]: string}>({});
  const [longGradingLoading, setLongGradingLoading] = useState<{[quizId: string]: boolean}>({});
  const [longGradingError, setLongGradingError] = useState<{[quizId: string]: string}>({});
  const [aiLoading, setAiLoading] = useState(false);
  const [completedQuizzes, setCompletedQuizzes] = useState<{[quizId: string]: {score: number, answers: string[]}}>({});

  useEffect(() => {
    listTeacherFiles().then(setTeacherFiles).catch(() => setTeacherFiles([]));
    fetchSavedQuizzes().then(setSavedQuizzes).catch(() => setSavedQuizzes([]));
    console.log('Fetching assigned quizzes for class:', classData.id);
    fetchAssignedQuizzes(classData.id).then(quizzes => {
      console.log('Fetched assigned quizzes:', quizzes);
      setAssignedQuizzes(quizzes);
    }).catch(err => {
      console.error('Error fetching assigned quizzes:', err);
      setAssignedQuizzes([]);
    });
    
    // Load completed quiz data for this student
    const loadCompletedQuizzes = async () => {
      try {
        const response = await fetch(`http://localhost:8000/get-quiz-results?studentId=${user?.id || "student_1"}&classId=${classData.id}`);
        if (response.ok) {
          const results = await response.json();
          const completedData: {[quizId: string]: {score: number, answers: string[]}} = {};
          results.forEach((result: any) => {
            completedData[result.quizId] = {
              score: result.score,
              answers: result.answers || []
            };
          });
          setCompletedQuizzes(completedData);
          console.log('Loaded completed quizzes:', completedData);
        }
      } catch (error) {
        console.error('Error loading completed quizzes:', error);
      }
    };
    
    loadCompletedQuizzes();
  }, [classData.id, user?.id]);

  const handleTeacherUpload = async () => {
    setTeacherUploadLoading(true);
    setTeacherUploadError(null);
    try {
      await uploadTeacherNotes(teacherUploadFiles, "Demo Teacher", classData.title, "Class notes upload");
      setTeacherUploadFiles([]);
      const files = await listTeacherFiles();
      setTeacherFiles(files);
    } catch (err: any) {
      setTeacherUploadError(err.message || "Upload failed");
    } finally {
      setTeacherUploadLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!aiInstructions.trim()) return;
    setAiLoading(true);
    try {
      let quizData: any = {};
      let quizQuestions: any[] = [];

      // Check if there's a file from the upload section above
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (file) {
        // Create FormData to send the file + description
        const formData = new FormData();
        formData.append('file', file);
        formData.append('instructions', aiInstructions);

        // Send file + description to backend for processing
        const response = await fetch('http://localhost:8000/lms/ai/generate-quiz-from-file/', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to generate quiz from file');
        }

        const result = await response.json();
        quizData = result;
        quizQuestions = result.quiz;
      } else {
        // Generate quiz from description only - use the same endpoint with a dummy file
        const description = aiInstructions.trim();
        if (!description) {
          throw new Error('Please provide a description for quiz generation.');
        }
        
        // Create a dummy file with the description as content
        const dummyFile = new File([description], "description.txt", { type: "text/plain" });
        
        const formData = new FormData();
        formData.append('file', dummyFile);
        formData.append('instructions', description);

        const response = await fetch('http://localhost:8000/lms/ai/generate-quiz-from-file/', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to generate quiz from description');
        }

        const result = await response.json();
        quizData = result;
        quizQuestions = result.quiz;
      }

      setQuizResult(JSON.stringify(quizQuestions));
      
      // Save to backend
      const savedQuiz = await saveQuizToBackend({
        fileUrl: file ? URL.createObjectURL(file) : undefined, // Pass undefined if no file was uploaded
        fileName: file ? file.name : "Generated Quiz",
        instructions: aiInstructions,
        quiz: quizQuestions,
        classId: classData.id,
        className: classData.title,
        teacherId: user?.id,
        teacherName: user?.name,
      });
      console.log('Saved quiz result:', savedQuiz);
      const quizzes = await fetchSavedQuizzes();
      console.log('All saved quizzes:', quizzes);
      setSavedQuizzes(quizzes);
    } catch (err: any) {
      console.error('Quiz generation error:', err);
      alert(err.message || "Failed to generate quiz");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAssignQuiz = async (quizId: string) => {
    try {
      console.log('Assigning quiz:', quizId, 'to class:', classData.id);
      const result = await assignQuizToClass(quizId, classData.id);
      console.log('Assignment result:', result);
      setAssignStatus(prev => ({ ...prev, [quizId]: 'Assigned!' }));
      const quizzes = await fetchAssignedQuizzes(classData.id);
      console.log('Fetched assigned quizzes:', quizzes);
      setAssignedQuizzes(quizzes);
    } catch (err: any) {
      console.error('Assignment error:', err);
      setAssignStatus(prev => ({ ...prev, [quizId]: err.message || 'Failed to assign.' }));
    }
  };

  const handleMCQAnswerChange = (quizId: string, qIdx: number, value: string) => {
    setStudentAnswers(prev => {
      const arr = prev[quizId] ? [...prev[quizId]] : [];
      arr[qIdx] = value;
      return { ...prev, [quizId]: arr };
    });
  };

  const handleSubmitMCQAnswers = async (quiz: any) => {
    const quizId = quiz.id;
    setGradingLoading(prev => ({ ...prev, [quizId]: true }));
    setGradingError(prev => ({ ...prev, [quizId]: '' }));
    setGradingResult(prev => ({ ...prev, [quizId]: '' }));
    try {
      const answers = studentAnswers[quizId] || [];
      const answerObj = quiz.parsedQuiz.map((q: any, idx: number) => ({
        question: q.question,
        selected: answers[idx] || '',
      }));
      const studentAnswerStr = JSON.stringify(answerObj);
      const result = await gradeSubmissionFromFile(quiz.fileUrl, studentAnswerStr, 'Grade these MCQ answers.');
      setGradingResult(prev => ({ ...prev, [quizId]: result.grade }));
    } catch (err: any) {
      setGradingError(prev => ({ ...prev, [quizId]: err.message || 'Failed to grade.' }));
    } finally {
      setGradingLoading(prev => ({ ...prev, [quizId]: false }));
    }
  };

  const handleLongAnswerChange = (quizId: string, value: string) => {
    setLongAnswers(prev => ({ ...prev, [quizId]: value }));
  };
  const handleLongFileChange = (quizId: string, file: File | null) => {
    setLongFiles(prev => ({ ...prev, [quizId]: file }));
  };
  const handleSubmitLongAnswer = async (quiz: any) => {
    const quizId = quiz.id;
    setLongGradingLoading(prev => ({ ...prev, [quizId]: true }));
    setLongGradingError(prev => ({ ...prev, [quizId]: '' }));
    setLongGradingResult(prev => ({ ...prev, [quizId]: '' }));
    try {
      let answer = longAnswers[quizId] || '';
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
    console.log('DEBUG: Quiz completed with score:', score, 'answers:', answers);
    
    if (selectedQuiz) {
      // Save completed quiz data
      setCompletedQuizzes(prev => ({
        ...prev,
        [selectedQuiz.id]: { score, answers }
      }));
      
      // Save to backend
      try {
        const response = await fetch('http://localhost:8000/lms/quiz/result/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quizId: selectedQuiz.id,
            studentId: user?.id || "student_1",
            studentName: user?.name || "Student",
            classId: classData.id,
            score: score,
            answers: answers,
            completedAt: new Date().toISOString()
          }),
        });
        
        if (response.ok) {
          console.log('Quiz result saved successfully');
        } else {
          console.error('Failed to save quiz result');
        }
      } catch (error) {
        console.error('Error saving quiz result:', error);
      }
    }
    
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

  if (!classData) {
    return (
      <div className="text-center py-8">
        <p className="text-white/60">Class not found</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="glass-panel p-6 rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Classes</span>
          </button>
          {isClassTime && (
            <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">Class Time</span>
            </div>
          )}
        </div>

        {/* Class Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold chrome-text mb-4">
            {classData.title}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-white/60" />
                <span className="text-white">
                  {formatDateTime(classData.dateTime)}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-white/60" />
                <span className="text-white">
                  {formatTime(classData.dateTime)} ({classData.duration} min)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-white/60" />
                <span className="text-white">
                  {classData.enrolledStudents?.length || 0} enrolled
                </span>
              </div>
            </div>

            {teacher && (
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-silver to-white rounded-full flex items-center justify-center text-black font-bold">
                  {teacher.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{teacher.name}</h3>
                  <div className="flex items-center space-x-1 text-white/60">
                    <span>⭐ {teacher.rating}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Stream Section */}
        {isClassTime && (
          <div className="mb-8">
            <div className="bg-black/30 rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-white flex items-center space-x-2">
                  <Video className="w-6 h-6" />
                  <span>Live Session</span>
                </h3>
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isLive ? "bg-red-500 animate-pulse" : "bg-white/30"
                    }`}
                  />
                  <span className="text-sm text-white/60">
                    {isLive ? "Live" : "Offline"}
                  </span>
                  {/* Debug info */}
                  <span className="text-xs text-white/40 ml-2">
                    (Teacher: {isCurrentUserTeacher ? "Yes" : "No"}, Live:{" "}
                    {isLive ? "Yes" : "No"})
                  </span>
                </div>
              </div>

              {isCurrentUserTeacher ? (
                // Teacher Controls - Always show share links when it's class time
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                      onClick={() => setIsVideoOff(!isVideoOff)}
                    >
                      {isVideoOff ? (
                        <VideoOff className="w-5 h-5 text-red-400" />
                      ) : (
                        <Video className="w-5 h-5 text-white/60" />
                      )}
                      <span className="text-white/80">Test Video</span>
                    </button>
                    <button
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? (
                        <MicOff className="w-5 h-5 text-red-400" />
                      ) : (
                        <Mic className="w-5 h-5 text-white/60" />
                      )}
                      <span className="text-white/80">Test Audio</span>
                    </button>
                  </div>

                  <button
                    onClick={handleStartStream}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Live Session</span>
                  </button>

                  {/* Teacher can manually populate live session IDs */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h4 className="text-white font-semibold">
                      Live Session Room IDs
                    </h4>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        🎯 Host Room ID (For Co-teachers)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={hostSessionId}
                          onChange={(e) =>
                            handleHostSessionIdChange(e.target.value)
                          }
                          placeholder="3e971f5c-0666-4f46-85bf-7852fe5a48ae"
                          className={`w-full bg-black/50 border ${
                            hostSessionId && !isValidSessionId(hostSessionId)
                              ? "border-red-500/50"
                              : hostSessionId && isValidSessionId(hostSessionId)
                              ? "border-green-500/50"
                              : "border-white/20"
                          } text-white px-3 py-2 rounded text-sm font-mono`}
                        />
                        {hostSessionId && (
                          <div className="absolute right-2 top-2">
                            {isValidSessionId(hostSessionId) ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <span className="text-red-400 text-xs">⚠️</span>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-white/50 text-xs mt-1">
                        Room ID for co-hosts to join as broadcasters
                      </p>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        👥 Student Room ID
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={attendeeSessionId}
                          onChange={(e) =>
                            handleAttendeeSessionIdChange(e.target.value)
                          }
                          placeholder="3e971f5c-0666-4f46-85bf-7852fe5a48ae"
                          className={`w-full bg-black/50 border ${
                            attendeeSessionId &&
                            !isValidSessionId(attendeeSessionId)
                              ? "border-red-500/50"
                              : attendeeSessionId &&
                                isValidSessionId(attendeeSessionId)
                              ? "border-green-500/50"
                              : "border-white/20"
                          } text-white px-3 py-2 rounded text-sm font-mono`}
                        />
                        {attendeeSessionId && (
                          <div className="absolute right-2 top-2">
                            {isValidSessionId(attendeeSessionId) ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <span className="text-red-400 text-xs">⚠️</span>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-white/50 text-xs mt-1">
                        Room ID for students to enter on the Agora platform
                      </p>
                    </div>

                    {(hostSessionId || attendeeSessionId) && (
                      <div className="space-y-2">
                        {isValidSessionId(attendeeSessionId) ? (
                          <div className="flex items-center space-x-2 text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>
                              Valid room ID! Students can now join your session.
                            </span>
                          </div>
                        ) : attendeeSessionId &&
                          !isValidSessionId(attendeeSessionId) ? (
                          <div className="flex items-center space-x-2 text-red-400 text-sm">
                            <span className="text-xs">⚠️</span>
                            <span>
                              Invalid room ID format. Please use UUID format.
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                            <span className="text-xs">ℹ️</span>
                            <span>
                              Add the student room ID to allow students to join.
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Controls section */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-4">
                      <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        <Settings className="w-5 h-5 text-white/60" />
                      </button>
                      <div className="flex items-center space-x-2 text-white/60">
                        <Users className="w-5 h-5" />
                        <span>{viewerCount} students</span>
                      </div>
                    </div>

                    {isLive && (
                      <button
                        onClick={handleEndStream}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Square className="w-4 h-4" />
                        <span>End Session</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                // Student View - Show session access if enrolled and teacher has provided session ID
                <div className="space-y-4">
                  {attendeeSessionId ? (
                    <div className="space-y-4">
                      <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center border border-white/10">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-white">
                            Live Session Available
                          </span>
                          <p className="text-white/60 text-sm mt-1">
                            Teacher has shared the session
                          </p>
                        </div>
                      </div>

                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <h4 className="text-green-400 font-semibold mb-3 flex items-center space-x-2">
                          <Video className="w-5 h-5" />
                          <span>Join Live Session</span>
                        </h4>

                        <div className="bg-black/30 rounded p-3 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white/60 text-sm">
                              Room ID to Enter:
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(attendeeSessionId, "Room ID")
                              }
                              className="p-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                              title="Copy room ID"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <code className="text-green-400 font-mono text-sm break-all block bg-black/30 p-2 rounded">
                            {attendeeSessionId}
                          </code>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3 mb-3">
                          <p className="text-blue-400 text-sm">
                            📋 <strong>Instructions:</strong>
                          </p>
                          <ol className="text-white/70 text-sm mt-2 space-y-1 list-decimal list-inside">
                            <li>Click "Open Agora Platform" below</li>
                            <li>Copy the Room ID above</li>
                            <li>
                              Paste it in the room ID field on the platform
                            </li>
                            <li>Click Join to enter the live session</li>
                          </ol>
                        </div>

                        <button
                          onClick={joinStream}
                          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Video className="w-5 h-5" />
                          <span>Open Agora Platform</span>
                        </button>

                        <p className="text-white/50 text-xs mt-2 text-center">
                          Will open: https://web-dun-iota.vercel.app/
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Video className="w-12 h-12 text-white/30 mx-auto mb-4" />
                      <p className="text-white/60">
                        Waiting for teacher to start the session...
                      </p>
                      <p className="text-white/40 text-sm mt-2">
                        You'll see the session access here when the teacher
                        provides it
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Class Description */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Book className="w-6 h-6" />
            <span>About This Class</span>
          </h3>
          <p className="text-white/80 mb-4">{classData.description}</p>

          {classData.topicsCovered && classData.topicsCovered.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2">Topics Covered:</h4>
              <ul className="list-disc list-inside space-y-1 text-white/70">
                {classData.topicsCovered
                  .filter((topic: string) => topic.trim())
                  .map((topic: string, index: number) => (
                    <li key={index}>{topic}</li>
                  ))}
              </ul>
            </div>
          )}

          {classData.tags && classData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {classData.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Class Materials */}
        <div className="bg-black/20 rounded-lg p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Class Materials</h3>
          <div className="space-y-2 text-white/60">
            <p>📚 Lecture notes will be available after the session</p>
            <p>📝 Homework assignments will be posted here</p>
            <p>🎯 Practice exercises and resources</p>
          </div>
        </div>

        {/* --- Unified LMS Workflow (restyled) --- */}
        <div className="max-w-7xl mx-auto">
          {/* Teacher Section (role-based) */}
          {(isTeacher() || isAdmin()) && (
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h2 className="text-xl font-bold mb-4">Teacher Tools</h2>
              {/* Upload notes/assignments */}
              <h3 className="text-lg font-semibold mb-2">Upload Class Notes/Assignments</h3>
              <input type="file" multiple onChange={e => setTeacherUploadFiles(Array.from(e.target.files || []))} className="mb-2 w-full" />
              <button onClick={handleTeacherUpload} disabled={teacherUploadLoading || teacherUploadFiles.length === 0} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 mb-4">
                {teacherUploadLoading ? "Uploading..." : "Upload"}
              </button>
              {teacherUploadError && <div className="text-red-400 mb-2">{teacherUploadError}</div>}
              <ul>
                {teacherFiles
                  .filter(file => file.teacher === user?.name || file.teacher === user?.id)
                  .map((file, idx) => (
                    <li key={idx} className="bg-white/10 px-3 py-2 rounded mb-2 flex items-center justify-between">
                      <span>{file.filename}</span>
                      <button onClick={() => downloadFile("notes", file.filename)} className="text-blue-400 hover:underline ml-4">Download</button>
                    </li>
                  ))}
              </ul>
              {/* Generate quiz/assignment with AI */}
              <h3 className="text-lg font-semibold mb-2 mt-6">Generate Quiz/Assignment (AI)</h3>
              <p className="text-silver text-sm mb-2">Provide a description to generate quiz questions. You can also upload a file in the section above for additional context.</p>
              
              {/* Description Option */}
              <div className="mb-4">
                <label className="text-white text-sm mb-2 block">Description/Instructions</label>
                <textarea 
                  value={aiInstructions} 
                  onChange={e => setAiInstructions(e.target.value)} 
                  placeholder="Describe the topic or provide content for quiz generation (e.g., 'Generate 5 MCQs about machine learning algorithms including supervised learning, unsupervised learning, and neural networks')" 
                  className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 mb-2" 
                  rows={4}
                />
              </div>
              
              <button
                onClick={handleGenerateQuiz}
                disabled={!aiInstructions.trim() || aiLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center gap-2 mb-4"
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
              
              {/* Saved quizzes and assign to class */}
              <h3 className="text-lg font-semibold mb-2 mt-6">Saved Quizzes/Assignments</h3>
              <ul>
                {savedQuizzes
                  .filter(q => q.classId === classData.id)
                  .filter(q => q.teacherId === user?.id || q.teacherName === user?.name)
                  .map((quiz, idx) => {
                  const mcqArray = extractMCQArray(quiz.quiz);
                  return (
                    <li key={quiz.id || idx} className="bg-black/30 p-3 rounded mb-2">
                      <div className="text-silver text-sm mb-1"><b>File:</b> {quiz.fileName}</div>
                      <div className="text-silver text-xs mb-1"><b>Instructions:</b> {quiz.instructions}</div>
                      {mcqArray && mcqArray.length > 0 ? (
                        <div className="mb-3">
                          <div className="text-white font-semibold mb-2">Quiz Questions:</div>
                          {mcqArray.map((q: any, qIdx: number) => (
                            <div key={qIdx} className="mb-3 p-3 bg-black/20 rounded border border-white/10">
                              <div className="text-white font-medium mb-2">{qIdx + 1}. {q.question}</div>
                              <div className="ml-4 space-y-1">
                                {q.options && q.options.map((opt: string, oIdx: number) => (
                                  <div key={oIdx} className="text-silver text-sm">
                                    {String.fromCharCode(65 + oIdx)}. {opt}
                                  </div>
                                ))}
                              </div>
                              {(q.answer || q.correct_answer) && (
                                <div className="text-green-400 text-xs mt-2">
                                  <b>Answer:</b> {q.answer || q.correct_answer}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-silver mb-2">No valid questions found for this quiz.</div>
                      )}
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleAssignQuiz(quiz.id)} className="bg-blue-500 text-white px-3 py-1 rounded">Assign to this class</button>
                        <button 
                          onClick={() => handleViewResults(quiz.id)} 
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          View Results
                        </button>
                      </div>
                      {assignStatus[quiz.id] && <span className="ml-2 text-xs text-green-400">{assignStatus[quiz.id]}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {/* Student Section (role-based) */}
          {(!isTeacher() || isAdmin()) && (
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h2 className="text-xl font-bold mb-4">Student Tools</h2>
              <h3 className="text-lg font-semibold mb-2">Assigned Quizzes/Assignments</h3>
              <ul>
                {assignedQuizzes.map((quiz, idx) => {
                  const parsedQuiz = extractMCQArray(quiz.quiz);
                  quiz.parsedQuiz = parsedQuiz;
                  const isCompleted = completedQuizzes[quiz.id];
                  
                  return (
                    <li key={quiz.id || idx} className="bg-black/30 p-3 rounded mb-4">
                      <div className="text-silver text-sm mb-1"><b>File:</b> {quiz.fileName}</div>
                      <div className="text-silver text-xs mb-1"><b>Instructions:</b> {quiz.instructions}</div>
                      {parsedQuiz && parsedQuiz.length > 0 ? (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">
                              {parsedQuiz.length} Questions Available
                            </span>
                            {isCompleted ? (
                              <div className="flex items-center gap-4">
                                <div className="text-white">
                                  <span className="font-bold text-lg">{isCompleted.score}%</span>
                                  <span className="text-sm ml-2">Score</span>
                                </div>
                                <button
                                  disabled
                                  className="bg-white text-black px-4 py-2 rounded opacity-50 cursor-not-allowed"
                                >
                                  Completed ✓
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleStartQuiz(quiz)}
                                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                              >
                                Start Quiz
                              </button>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">
                            {isCompleted ? 
                              "Quiz completed - View your score above" : 
                              "Click 'Start Quiz' to begin the assessment"
                            }
                          </div>
                        </div>
                      ) : (
                        <div className="text-silver">No valid questions found for this quiz.</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Quiz Interface Modal */}
          {showQuizInterface && selectedQuiz && (
            <StudentQuizInterface
              quiz={selectedQuiz}
              onComplete={handleQuizComplete}
              onClose={() => {
                setShowQuizInterface(false);
                setSelectedQuiz(null);
              }}
              studentId={user?.id || "student_1"}
              studentName={user?.name || "Student"}
              classId={classData.id}
            />
          )}

          {/* Quiz Results Modal */}
          {showResultsView && selectedQuizForResults && (
            <QuizResultsView
              quizId={selectedQuizForResults}
              classId={classData.id}
              onClose={() => {
                setShowResultsView(false);
                setSelectedQuizForResults(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
