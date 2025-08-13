// LMS API integration for FastAPI backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function uploadTeacherNotes(files: File[], teacher: string, course: string, description: string) {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  formData.append('teacher', teacher);
  formData.append('course', course);
  formData.append('description', description);

  const response = await fetch(`${API_URL}/lms/upload/`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to upload teacher notes');
  return await response.json();
}

export async function uploadStudentSubmission(file: File, student: string, assignment: string, notes: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('student', student);
  formData.append('assignment', assignment);
  formData.append('notes', notes);

  const response = await fetch(`${API_URL}/lms/submission/`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to upload student submission');
  return await response.json();
}

export async function listTeacherFiles() {
  const response = await fetch(`${API_URL}/lms/files/`);
  if (!response.ok) throw new Error('Failed to fetch teacher files');
  return await response.json();
}

export async function listStudentSubmissions() {
  const response = await fetch(`${API_URL}/lms/submissions/`);
  if (!response.ok) throw new Error('Failed to fetch student submissions');
  return await response.json();
}

export function downloadFile(type: 'notes' | 'submissions', filename: string) {
  window.open(`${API_URL}/lms/download/${type}/${filename}`, '_blank');
}

export async function generateQuizFromFile(fileUrl: string, instructions: string = "Generate a quiz from this file.") {
  const response = await fetch(`${API_URL}/lms/ai/generate-quiz/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_url: fileUrl, instructions }),
  });
  if (!response.ok) throw new Error('Failed to generate quiz');
  return await response.json();
}

export async function gradeSubmissionFromFile(fileUrl: string, studentAnswer: string, instructions: string = "Grade this answer based on the file.") {
  const response = await fetch(`${API_URL}/lms/ai/grade-submission/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_url: fileUrl, student_answer: studentAnswer, instructions }),
  });
  if (!response.ok) throw new Error('Failed to grade submission');
  return await response.json();
}

export async function saveQuizToBackend(quiz: any) {
  const response = await fetch(`${API_URL}/lms/quiz/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quiz),
  });
  if (!response.ok) throw new Error('Failed to save quiz');
  return await response.json();
}

export async function fetchSavedQuizzes() {
  const response = await fetch(`${API_URL}/lms/quiz/`);
  if (!response.ok) throw new Error('Failed to fetch saved quizzes');
  return await response.json();
}

export async function assignQuizToClass(quiz_id: string, class_id: string) {
  const response = await fetch(`${API_URL}/lms/quiz/assign/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quiz_id, class_id }),
  });
  if (!response.ok) throw new Error('Failed to assign quiz to class');
  return await response.json();
}

export async function fetchAssignedQuizzes(class_id: string) {
  const response = await fetch(`${API_URL}/lms/quiz/assigned/${class_id}`);
  if (!response.ok) throw new Error('Failed to fetch assigned quizzes');
  return await response.json();
} 