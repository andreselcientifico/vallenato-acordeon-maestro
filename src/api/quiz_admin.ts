import { API_URL } from "@/config/api";
import { handleApiError } from "@/lib/apiHelpers";

export type AdminOption = {
  text: string;
  is_correct: boolean;
  order: number;
};

export type AdminQuestion = {
  question: string;
  description?: string;
  explanation?: string;
  order: number;
  options: AdminOption[];
};

export type AdminCreateQuiz = {
  lesson_id: string;
  title: string;
  description?: string;
  pass_percentage?: number;
  questions: AdminQuestion[];
};

export async function createQuiz(dto: AdminCreateQuiz) {
  const res = await fetch(`${API_URL}/api/quiz/edit/create`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  console.log(res);
  if (!res.ok) {
    throw handleApiError(res, "Error al crear el quiz");
  }
  const data = await res.json();
  console.log(data);
  return data;
}

export async function updateQuiz(quizId: string, dto: AdminCreateQuiz) {
  const res = await fetch(`${API_URL}/api/quiz/edit/${quizId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    throw handleApiError(res, "Error al actualizar el quiz");
  }

  return res.json();
}

export async function deleteQuiz(quizId: string) {
  const res = await fetch(`${API_URL}/api/quiz/edit/${quizId}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw handleApiError(res, "Error al eliminar el quiz");
  }

  if (res.status === 204) return { deleted: true };
  return res.json();
}