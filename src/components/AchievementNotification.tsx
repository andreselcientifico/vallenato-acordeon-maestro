import { useEffect, useState } from "react";
import { Trophy, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Achievement } from "@/api/subscriptions";

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
}

const AchievementNotification = ({
  achievement,
  onClose,
  autoHide = true,
  autoHideDelay = 5000
}: AchievementNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Allow animation to complete
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right-4 duration-300">
      <Card className="w-80 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                ¡Nuevo Logro Desbloqueado!
              </h4>
              <h5 className="text-lg font-bold text-yellow-900 dark:text-yellow-100 mt-1">
                {achievement.name}
              </h5>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                {achievement.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="flex-shrink-0 h-6 w-6 p-0 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementNotification;