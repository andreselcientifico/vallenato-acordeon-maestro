import { API_URL } from "@/config/api";

export async function getUserProfile() {
  const res = await fetch(`${API_URL}/api/profile`, {
    method: "POST",
    credentials: "include", // 🔥 enviamos la cookie de autenticación
  });

  if (!res.ok) throw new Error("No autorizado");

  return await res.json();
}
