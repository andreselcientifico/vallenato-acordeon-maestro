import { API_URL } from "@/config/api";

// =====================
// SUSCRIPCIONES
// =====================

export interface Subscription {
  id: string;
  user_id: string;
  paypal_subscription_id: string;
  status: boolean;
  plan_id?: string;
  start_time: string;
  end_time?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_months: number;
  features: string[];
  paypal_plan_id: string;
  active: boolean;
  created_at: string;
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const res = await fetch(`${API_URL}/api/admin/subscriptions`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al obtener suscripciones");
  }

  return res.json();
}

export async function createSubscriptionPlan(plan: Omit<SubscriptionPlan, 'id' | 'created_at'>): Promise<SubscriptionPlan> {
  const res = await fetch(`${API_URL}/api/admin/subscription-plans`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plan),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al crear plan de suscripción");
  }

  return res.json();
}

export async function updateSubscriptionPlan(planId: string, plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
  const res = await fetch(`${API_URL}/api/admin/subscription-plans/${planId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plan),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al actualizar plan de suscripción");
  }

  return res.json();
}

export async function deleteSubscriptionPlan(planId: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/subscription-plans/${planId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al eliminar plan de suscripción");
  }
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const res = await fetch(`${API_URL}/api/subscription-plans`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al obtener planes de suscripción");
  }

  return res.json();
}

// =====================
// LOGROS
// =====================

export interface Achievement {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
  trigger_type: string; // 'course_completed', 'lesson_completed', 'login_streak', etc.
  trigger_value: number; // cantidad necesaria para activar
  active: boolean;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned: boolean;
  earned_at?: string;
}

export async function getAchievements(): Promise<Achievement[]> {
  const res = await fetch(`${API_URL}/api/admin/achievements`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al obtener logros");
  }

  return res.json();
}

export async function createAchievement(achievement: Omit<Achievement, 'id' | 'created_at'>): Promise<Achievement> {
  const res = await fetch(`${API_URL}/api/admin/achievements`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(achievement),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al crear logro");
  }

  return res.json();
}

export async function updateAchievement(achievementId: string, achievement: Partial<Achievement>): Promise<Achievement> {
  const res = await fetch(`${API_URL}/api/admin/achievements/${achievementId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(achievement),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al actualizar logro");
  }

  return res.json();
}

export async function deleteAchievement(achievementId: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/achievements/${achievementId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al eliminar logro");
  }
}

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const res = await fetch(`${API_URL}/api/users/${userId}/achievements`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al obtener logros del usuario");
  }

  return res.json();
}

export async function checkAndAwardAchievements(userId: string, action: string, value?: number): Promise<UserAchievement[]> {
  const res = await fetch(`${API_URL}/api/users/${userId}/achievements/check`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, value }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al verificar logros");
  }

  return res.json();
}

// =====================
// NOTIFICACIONES
// =====================

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  sent_via: string;
  sent_at: string;
  read: boolean;
}

export async function getNotifications(): Promise<Notification[]> {
  const res = await fetch(`${API_URL}/api/notifications`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al obtener notificaciones");
  }

  return res.json();
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al marcar notificación como leída");
  }
}

export async function createNotification(notification: Omit<Notification, 'id' | 'sent_at' | 'read'>): Promise<Notification> {
  const res = await fetch(`${API_URL}/api/admin/notifications`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notification),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al crear notificación");
  }

  return res.json();
}