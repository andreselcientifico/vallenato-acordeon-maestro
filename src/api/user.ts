import { API_URL } from "@/config/api";

export async function getUserProfile() {
  const res = await fetch(`${API_URL}/api/profile`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("No autorizado");
  }

  return res.json();
}

export async function updateUserProfile(profileData) {
  const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al actualizar el perfil");
  }

  return res.json();
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