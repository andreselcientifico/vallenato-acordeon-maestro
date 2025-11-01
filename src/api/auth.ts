import { API_URL } from "@/config/api";

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // 🔥  para enviar/recibir cookies
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || "Error al iniciar sesión");
  }
  const data = await res.json();
  return data?.data?.user || null;
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    credentials: "include", // 👈 Envía la cookie al backend
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data?.data?.user || null;
}

export async function registerUser(name: string, email: string, password: string, confirmPassword: string) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, confirmPassword }),
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al registrarse");
  }

  return await res.json();
}
