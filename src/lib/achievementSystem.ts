import { API_URL } from "@/config/api";
import { UserAchievement } from "@/api/subscriptions";

type AchievementCallback = (achievement: UserAchievement) => void;

class AchievementSystem {
  private onAchievementEarned: AchievementCallback | null = null;

  setOnAchievementEarned(callback: AchievementCallback) {
    this.onAchievementEarned = callback;
  }

  notifyAchievement(achievement: UserAchievement) {
    if (this.onAchievementEarned) {
      this.onAchievementEarned(achievement);
    }
  }
}

export const achievementSystem = new AchievementSystem();

export async function checkLessonCompletion(lessonId: string): Promise<void> {
  try {
    const res = await fetch(
      `${API_URL}/api/achievements/check/lesson/${lessonId}`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (res.ok) {
      const data = await res.json();
      if (data && data.new_achievement) {
        achievementSystem.notifyAchievement(data.new_achievement);
      }
    }
  } catch (error) {
    console.error("Error checking lesson achievements:", error);
  }
}

export async function checkCourseCompletion(courseId: string): Promise<void> {
  try {
    const res = await fetch(
      `${API_URL}/api/achievements/check/course/${courseId}`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (res.ok) {
      const data = await res.json();
      if (data && data.new_achievement) {
        achievementSystem.notifyAchievement(data.new_achievement);
      }
    }
  } catch (error) {
    console.error("Error checking course achievements:", error);
  }
}
