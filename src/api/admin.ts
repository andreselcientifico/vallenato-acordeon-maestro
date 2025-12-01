import { API_URL } from "@/config/api";

export async function saveCourseAPI(course, courseId: string | undefined) {
  const method = courseId ? "PUT" : "POST";
  const url = courseId
    ? `${API_URL}/courses/${courseId}`
    : `${API_URL}/courses`;

  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al guardar el curso");
  }

  return res.json();
}

export async function fetchCoursesAPI() {
  const res = await fetch(`${API_URL}/courses/videos`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al cargar cursos");
  }

  return res.json();  // Esto debe devolver un array de Course
}

export async function deleteCourseAPI(courseId) {
  const res = await fetch(`${API_URL}/courses/${courseId}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al eliminar el curso");
  }

  // 👇 Manejar 204 No Content
  if (res.status === 204) return { deleted: true };

  return res.json();
}
