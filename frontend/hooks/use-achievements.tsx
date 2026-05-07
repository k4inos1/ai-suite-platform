import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ACHIEVEMENTS } from "@/constants/achievements";
import type { Achievement, Recipe, UnlockedAchievement } from "@/types";

const ACHIEVEMENTS_KEY = "recipe-achievements";

const AchievementToast = ({ achievement }: { achievement: Achievement }) => (
  <div className="flex items-center gap-2">
    <span className="text-2xl">{achievement.icon && <achievement.icon />}</span>
    <div>
      <p className="font-semibold">{achievement.title}</p>
      <p className="text-sm text-muted-foreground">{achievement.description}</p>
    </div>
  </div>
);

export function useAchievements(favorites: Recipe[]) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<
    UnlockedAchievement[]
  >(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      ACHIEVEMENTS_KEY,
      JSON.stringify(unlockedAchievements)
    );
  }, [unlockedAchievements]);

  // Verificar logros cuando cambian los favoritos
  useEffect(() => {
    const checkAchievements = () => {
      ACHIEVEMENTS.forEach((achievement) => {
        const isUnlocked = unlockedAchievements.some(
          (a) => a.id === achievement.id
        );

        const meetsRequirement = (() => {
          if (achievement.type === "favorites") {
            return favorites.length >= achievement.requirement;
          }
          if (achievement.type === "meta") {
            const otherAchievements = ACHIEVEMENTS.filter(
              (a) => a.type !== "meta"
            );
            return (
              otherAchievements.filter((a) =>
                unlockedAchievements.some((ua) => ua.id === a.id)
              ).length >= achievement.requirement
            );
          }
          return false;
        })();

        if (!isUnlocked && meetsRequirement) {
          const newAchievement: UnlockedAchievement = {
            ...achievement,
            unlockedAt: new Date(),
          };
          setUnlockedAchievements((prev) => [...prev, newAchievement]);

          toast({
            title: "¡Logro desbloqueado!",
            description: <AchievementToast achievement={achievement} />,
            duration: 5000,
          });
        }
      });
    };

    checkAchievements();
  }, [favorites, unlockedAchievements, toast]);

  const getProgress = (achievementId: string): number => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!achievement) return 0;

    if (achievement.type === "favorites") {
      return Math.min(100, (favorites.length / achievement.requirement) * 100);
    }
    if (achievement.type === "meta") {
      const otherAchievements = ACHIEVEMENTS.filter((a) => a.type !== "meta");
      const unlockedCount = otherAchievements.filter((a) =>
        unlockedAchievements.some((ua) => ua.id === a.id)
      ).length;
      return Math.min(100, (unlockedCount / achievement.requirement) * 100);
    }
    return 0;
  };

  return {
    unlockedAchievements,
    getProgress,
  };
}
