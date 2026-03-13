import { API_URL } from "@/config/api";

export interface EventRequestData {
  name: string;
  email: string;
  phone?: string;
  eventType: string;
  eventDate?: string;
  location?: string;
  guests?: number;
  message: string;
  budget?: string;
}

export async function sendEventRequest(data: EventRequestData) {
  return await fetch(`${API_URL}/auth/event-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
