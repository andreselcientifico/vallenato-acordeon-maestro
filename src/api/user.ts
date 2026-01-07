import { API_URL } from "@/config/api";

export async function getUserProfile() {
  const res = await fetch(`${API_URL}/api/profile`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("No autorizado");
  }
  const data = await res.json();
  console.log(data)
  return data;
}

export async function updateUserProfile(profileData) {
  const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

  const text = await res.text();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    throw new Error("Error parseando JSON: " + e.message);
  }

  if (!res.ok) {
    throw new Error(parsed.message || `HTTP error ${res.status}`);
  }

  return parsed;
}

export async function deleteUserAccount() {
  const res = await fetch(`${API_URL}/api/profile`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al eliminar la cuenta");
  }

  return res.json();
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const res = await fetch(`${API_URL}/api/users/change-password`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al cambiar la contraseña");
  }

  return res.json();
}

export async function requestPasswordReset(email: string) {
  const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al enviar el correo de recuperación");
  }

  return res.json();
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al restablecer la contraseña");
  }

  return res.json();
}

export async function updateNotificationSettings(settings: {
  email_notifications?: boolean;
  course_reminders?: boolean;
  new_content?: boolean;
}) {
  const res = await fetch(`${API_URL}/api/users/notifications`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al actualizar las notificaciones");
  }

  return res.json();
}