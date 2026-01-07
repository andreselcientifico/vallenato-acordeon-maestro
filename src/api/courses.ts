import { API_URL } from "@/config/api";
import { handleApiError } from "@/lib/apiHelpers";

export type Lesson = {
  id: string;
  title: string;
  duration?: string; // El backend lo envía como Option<String>, por lo que es opcional
  completed?: boolean; // El backend lo envía como bool, pero LessonDto en el BE lo envuelve en Option<bool> por la tabla de progreso
  type: 'video' | 'exercise' | 'quiz' | string; // Permitir que sea string si el enum de BE tiene más tipos
  content_url?: string; // Corregir de videoUrl a content_url (lo que envía el BE)
  description?: string;
  order: number; // Añadir el orden para la iteración
};

export type Module = {
  id: string;
  title: string;
  order: number; // Añadir el orden
  completed?: boolean;
  lessons: Lesson[];
};

export type CourseDetails = {
  id: string;
  title: string;
  description?: string;
  long_description?: string;
  price?: number;
  level?: string;
  duration?: string;
  students?: number;
  rating?: number;
  image?: string;
  category?: string;
  features?: string[];
  // Campos de resumen que el BE añadió
  instructor: string;
  total_lessons: number;
  completed_lessons: number;
  total_duration: string;

  modules: Module[];
};

export async function getCourseDetails(courseId: string): Promise<CourseDetails> {
  const res = await fetch(`${API_URL}/api/courses/${courseId}/videos`, {
    method: "GET",
    credentials: "include", // 👈 cookies HttpOnly
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al obtener el curso");
  }

  const data = await res.json();
  // Transformar datos del backend a tipos frontend
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    long_description: data.long_description,
    price: data.price,
    level: data.level,
    duration: data.duration,
    students: data.students,
    rating: data.rating,
    image: data.image,
    category: data.category,
    features: data.features,
    
    // Mapeo de campos de resumen
    instructor: data.instructor || 'N/A',
    total_lessons: data.total_lessons || 0,
    completed_lessons: data.completed_lessons || 0,
    total_duration: data.total_duration || 'N/A',

    modules: data.modules.map((m: any) => ({
      id: m.id,
      title: m.title,
      order: m.order, // Usar el orden
      // El campo 'completed' a nivel de módulo ya no es necesario aquí
      lessons: m.lessons.map((l: any) => ({
        id: l.id,
        title: l.title,
        duration: l.duration,
        completed: l.completed || false, // Asumiendo 'completed' es bool o nulo (lo hacemos bool por seguridad)
        type: l.type, // El campo en Rust es r#type, pero en JSON suele ser 'type'
        content_url: l.content_url, // Usar el campo correcto
        description: l.description,
        order: l.order,
      }))
    }))
  };
}

export async function getCourseDetails_preview(courseId: string): Promise<CourseDetails> {
  const res = await fetch(`${API_URL}/api/courses/${courseId}/videos/preview`, {
    method: "GET",
    credentials: "include", // 👈 cookies HttpOnly
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al obtener el curso");
  }

  const data = await res.json();
  // Transformar datos del backend a tipos frontend
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    long_description: data.long_description,
    price: data.price,
    level: data.level,
    duration: data.duration,
    students: data.students,
    rating: data.rating,
    image: data.image,
    category: data.category,
    features: data.features,
    
    // Mapeo de campos de resumen
    instructor: data.instructor || 'N/A',
    total_lessons: data.total_lessons || 0,
    completed_lessons: data.completed_lessons || 0,
    total_duration: data.total_duration || 'N/A',

    modules: data.modules.map((m: any) => ({
      id: m.id,
      title: m.title,
      order: m.order, // Usar el orden
      // El campo 'completed' a nivel de módulo ya no es necesario aquí
      lessons: m.lessons.map((l: any) => ({
        id: l.id,
        title: l.title,
        duration: l.duration,
        completed: l.completed || false, // Asumiendo 'completed' es bool o nulo (lo hacemos bool por seguridad)
        type: l.type, // El campo en Rust es r#type, pero en JSON suele ser 'type'
        content_url: l.content_url, // Usar el campo correcto
        description: l.description,
        order: l.order,
      }))
    }))
  };
}

export type Comment = {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  rating?: number;
};

export type CourseRating = {
  average: number;
  count: number;
  user_rating?: number;
};

export async function getLessonComments(lessonId: string): Promise<Comment[]> {
  const res = await fetch(`${API_URL}/api/courses/${lessonId}/comments`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    await handleApiError(res, "Error al obtener comentarios");
  }

  return res.json();
}

export async function createLessonComment(LessonId: string, content: string): Promise<Comment> {
  const res = await fetch(`${API_URL}/api/courses/${LessonId}/comments`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    await handleApiError(res, "Error al crear comentario");
  }

  return res.json();
}

export async function deleteLessonComment(lessonId: string, commentId: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/courses/${lessonId}/comments/${commentId}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    await handleApiError(res, "Error al eliminar comentario");
  }
}

export async function getCourseRating(courseId: string): Promise<CourseRating> {
  const res = await fetch(`${API_URL}/api/courses/${courseId}/rating`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al obtener calificación");
  }

  return res.json();
}

export async function rateCourse(courseId: string, rating: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/courses/${courseId}/rating`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al calificar curso");
  }
}