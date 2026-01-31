import { API_URL } from "@/config/api";
import { handleApiError } from "@/lib/apiHelpers";

// ===== TIPOS DE QUIZ =====
export type QuizQuestion = {
  id: string;
  question: string;
  description?: string;
  options: QuizOption[];
  correct_option_id: string;
  explanation?: string;
  order: number;
};

export type QuizOption = {
  id: string;
  text: string;
  order: number;
};

export type Quiz = {
  id: string;
  lesson_id: string;
  title: string;
  description?: string;
  pass_percentage: number; // Porcentaje requerido para pasar (ej: 70)
  total_questions: number;
  order: number;
};

export type QuizAnswer = {
  question_id: string;
  selected_option_id: string;
};

export type QuizSubmission = {
  id: string;
  quiz_id: string;
  user_id: string;
  answers: QuizAnswer[];
  score: number;
  percentage: number;
  passed: boolean;
  submitted_at: string;
  completed_at?: string;
};

export type QuizResultDto = {
  submission_id: string;
  quiz_id: string;
  score: number;
  total_score: number;
  percentage: number;
  passed: boolean;
  submitted_at: string;
  results: QuestionResult[];
  certificate?: Certificate; // Optional certificate info if generated after submission
};

export type QuestionResult = {
  question_id: string;
  question: string;
  selected_option_id: string;
  correct_option_id: string;
  is_correct: boolean;
  explanation?: string;
};

export type Certificate = {
  id: string;
  course_id: string;
  user_id: string;
  user_name: string;
  course_title: string;
  issue_date: string;
  completion_percentage: number;
  certificate_number: string;
};

// ===== API CALLS =====

/**
 * Obtiene el quiz asociado a una lección
 */
export async function getQuizByLesson(lessonId: string): Promise<Quiz> {
  const res = await fetch(`${API_URL}/api/quiz/lesson/${lessonId}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw handleApiError(res, "Error al cargar el quiz");
  }

  return res.json();
}

/**
 * Obtiene las preguntas de un quiz
 */
export async function getQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
  const res = await fetch(`${API_URL}/api/quiz/${quizId}/questions`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw handleApiError(res, "Error al cargar las preguntas del quiz");
  }

  return res.json();
}

/**
 * Envía las respuestas del quiz y obtiene el resultado
 */
export async function submitQuiz(
  quizId: string,
  answers: QuizAnswer[]
): Promise<QuizResultDto> {
  const res = await fetch(`${API_URL}/api/quiz/${quizId}/submit`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });

  if (!res.ok) {
    throw handleApiError(res, "Error al enviar el quiz");
  }

  return res.json();
}

/**
 * Obtiene el historial de intentos del usuario en un quiz
 */
export async function getQuizAttempts(quizId: string): Promise<QuizSubmission[]> {
  const res = await fetch(`${API_URL}/api/quiz/${quizId}/attempts`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw handleApiError(res, "Error al cargar el historial del quiz");
  }

  return res.json();
}

/**
 * Obtiene los detalles de un intento de quiz
 */
export async function getQuizAttemptDetails(
  submissionId: string
): Promise<QuizResultDto> {
  const res = await fetch(`${API_URL}/api/quiz/attempt/${submissionId}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw handleApiError(res, "Error al cargar los detalles del intento");
  }

  return res.json();
}

// ===== CERTIFICADOS =====

/**
 * Obtiene los certificados del usuario
 */
export async function getUserCertificates(): Promise<Certificate[]> {
  const res = await fetch(`${API_URL}/api/certificates`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw handleApiError(res, "Error al cargar los certificados");
  }

  return res.json();
}

/**
 * Obtiene un certificado específico
 */
export async function getCertificate(certificateId: string): Promise<Certificate> {
  const res = await fetch(`${API_URL}/api/certificates/${certificateId}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw handleApiError(res, "Error al cargar el certificado");
  }

  return res.json();
}

/**
 * Descarga un certificado como PDF
 */
export async function downloadCertificatePDF(
  certificateId: string
): Promise<Blob> {
  const res = await fetch(
    `${API_URL}/api/certificates/${certificateId}/download`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw handleApiError(res, "Error al descargar el certificado");
  }

  return res.blob();
}
