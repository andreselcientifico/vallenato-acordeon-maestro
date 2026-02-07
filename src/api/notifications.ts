import { API_URL } from "@/config/api";

export interface SendBulkEmailRequest {
  notification_type: "email_notifications" | "course_reminders" | "new_content";
  subject: string;
  html_content: string;
}

export interface BulkEmailResponse {
  success: boolean;
  message: string;
  recipients_count: number;
}

export interface NotificationCountResponse {
  notification_type: string;
  count: number;
}

/**
 * Sends a bulk email to users based on their notification preferences
 */
export async function sendBulkEmail(
  data: SendBulkEmailRequest,
): Promise<BulkEmailResponse> {
  const res = await fetch(`${API_URL}/api/admin/notifications/send`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error enviando correos");
  }

  return res.json();
}

/**
 * Gets the count of recipients for a given notification type (preview before sending)
 */
export async function getNotificationRecipientsCount(
  notificationType: string,
): Promise<NotificationCountResponse> {
  const res = await fetch(
    `${API_URL}/api/admin/notifications/count/${notificationType}`,
    {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error obteniendo conteo");
  }

  return res.json();
}
