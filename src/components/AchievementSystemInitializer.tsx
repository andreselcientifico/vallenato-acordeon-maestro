import { useEffect } from "react";
import { achievementSystem } from "@/lib/achievementSystem";
import { useAchievementNotifications } from "@/hooks/useAchievementNotifications";

const AchievementSystemInitializer = () => {
  const { showAchievement } = useAchievementNotifications();

  useEffect(() => {
    // Configurar el callback para mostrar notificaciones cuando se obtengan logros
    achievementSystem.setOnAchievementEarned(showAchievement);
  }, [showAchievement]);

  return null; // Este componente no renderiza nada
};

export default AchievementSystemInitializer;