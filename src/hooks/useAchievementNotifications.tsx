import { createContext, useContext, useState, ReactNode } from "react";
import AchievementNotification from "@/components/AchievementNotification";
import { Achievement } from "@/api/subscriptions";

interface AchievementNotificationItem {
  id: string;
  achievement: Achievement;
}

interface AchievementNotificationContextType {
  showAchievement: (achievement: Achievement) => void;
}

const AchievementNotificationContext = createContext<AchievementNotificationContextType | undefined>(undefined);

export const useAchievementNotifications = () => {
  const context = useContext(AchievementNotificationContext);
  if (!context) {
    throw new Error("useAchievementNotifications must be used within AchievementNotificationProvider");
  }
  return context;
};

interface AchievementNotificationProviderProps {
  children: ReactNode;
}

export const AchievementNotificationProvider = ({ children }: AchievementNotificationProviderProps) => {
  const [notifications, setNotifications] = useState<AchievementNotificationItem[]>([]);

  const showAchievement = (achievement: Achievement) => {
    const id = `${achievement.id}-${Date.now()}`;
    const notification: AchievementNotificationItem = {
      id,
      achievement,
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove after animation completes (5s delay + 300ms animation)
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5300);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AchievementNotificationContext.Provider value={{ showAchievement }}>
      {children}
      {/* Render notifications */}
      {notifications.map((notification) => (
        <AchievementNotification
          key={notification.id}
          achievement={notification.achievement}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </AchievementNotificationContext.Provider>
  );
};