import { API_URL } from "@/config/api";

export async function saveCourseAPI(course) {
  const method = course.id ? "PUT" : "POST";
  const url = course.id
    ? `${API_URL}/courses/${course.id}`
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