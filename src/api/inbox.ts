import { API_URL } from "@/config/api";

export interface ReceivedEmail {
  id: string;
  resend_email_id: string;
  from_address: string;
  to_address: string;
  subject: string;
  text_content?: string;
  html_content?: string;
  is_read: boolean;
  created_at: string;
}

export async function getReceivedEmails(): Promise<ReceivedEmail[]> {
  const response = await fetch(`${API_URL}/api/admin/inbox`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch inbox");
  }

  return response.json();
}

export async function markEmailAsRead(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/admin/inbox/${id}/read`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to mark email as read");
  }

  return response.json();
}

export async function deleteReceivedEmail(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/admin/inbox/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to delete email");
  }

  return response.json();
}

export interface ReplyEmailRequest {
  to_address: string;
  subject: string;
  html_content: string;
  text_content?: string;
}

export async function replyToEmail(
  emailId: string,
  data: ReplyEmailRequest,
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_URL}/api/admin/inbox/${emailId}/reply`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to reply to email");
  }

  return response.json();
}
