import { API_URL } from "@/config/api";

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // 🔥  para enviar/recibir cookies
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const error = new Error(err.message || err.error || "Error al iniciar sesión");
    (error as any).status = res.status;
    throw error;
  }
  const data = await res.json();
  return data?.data?.user || null;
}

export async function getCurrentUser() {
  try {
    const res = await fetch(`${API_URL}/api/users/me`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    // Si la respuesta no es OK → usuario no autenticado
    if (!res.ok) return null;

    // Intentar parsear JSON (si falla → null)
    let data;
    try {
      data = await res.json();
    } catch {
      return null;
    }

    // Devolver usuario si existe, sino null
    return data?.data?.user ?? null;

  } catch {
    // Error de conexión, CORS, timeout, etc.
    return null;
  }
}

export async function registerUser(name: string, email: string, password: string, confirmPassword: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, confirmPassword }),
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const error = new Error(err.message || "Error al registrarse");
    (error as any).status = res.status;
    throw error;
  }

  const data = await res.json();
  return data?.data?.user ||  null;
}
