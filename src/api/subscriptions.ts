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

export async function createSubscriptionPlan(plan: Omit<SubscriptionPlan, 'id' | 'created_at'>): Promise<SubscriptionPlan> {
  const res = await fetch(`${API_URL}/api/subscriptions/plans`, {
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
  const res = await fetch(`${API_URL}/api/subscriptions/plans/${planId}`, {
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
  const res = await fetch(`${API_URL}/api/subscriptions/plans/${planId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al eliminar plan de suscripción");
  }
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const res = await fetch(`${API_URL}/auth/plans/subscriptions`, {
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

export async function getUserSubscriptions(): Promise<Subscription[]> {
  const res = await fetch(`${API_URL}/api/subscriptions/user`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al obtener suscripciones del usuario");
  }

  return res.json();
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al cancelar suscripción");
  }
}

// =====================
// LOGROS
// =====================

export interface UserAchievement {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  trigger_type: string;
  trigger_value: number;
  active: boolean;
  earned: boolean;
  earned_at?: string | null;
  created_at: string;
}

export async function getAchievements(): Promise<UserAchievement[]> {
 let res: Response;

  try {
    res = await fetch(`${API_URL}/api/achievements/all`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // CORS / red / móvil
    throw new Error("ERROR_RED");
  }

  if (!res.ok) {
    let message = "Error al obtener logros";

    try {
      const err = await res.json();
      message = err.message || message;
    } catch {}

    throw new Error(message);
  }

  return res.json();
}

export async function createAchievement(achievement: Omit<UserAchievement, 'id' | 'created_at'>): Promise<UserAchievement> {
  const res = await fetch(`${API_URL}/api/achievements`, {
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

export async function updateAchievement(achievementId: string, achievement: Partial<UserAchievement>): Promise<UserAchievement> {
  const res = await fetch(`${API_URL}/api/achievements/${achievementId}`, {
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
  const res = await fetch(`${API_URL}/api/achievements/${achievementId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al eliminar logro");
  }
}

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const res = await fetch(`${API_URL}/api/achievements/users/${userId}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al obtener logros del usuario");
  }
  const data = await res.json();  
  console.log(data);
  return data;
}

export async function checkAndAwardAchievements(userId: string, action: string, value?: number): Promise<UserAchievement[]> {
  const res = await fetch(`${API_URL}/api/achievements/users/${userId}/check`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, value }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al verificar logros");
  }
  const data = await res.json();
  console.log(data);
  return data;
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