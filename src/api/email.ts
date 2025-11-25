import { API_URL } from "@/config/api";

export async function sendEmail(email: string) {
  return await fetch(`${API_URL}/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}
