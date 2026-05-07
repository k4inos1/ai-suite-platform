import { motion } from "framer-motion";
import React from "react";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: React.ComponentType | React.ReactNode;
  unlocked?: boolean;
  progress?: number;
}

export function AchievementBadge({
  title,
  description,
  icon: Icon,
  unlocked = false,
  progress = 0,
}: AchievementBadgeProps) {
  return (
    <motion.div
      className={`relative p-4 rounded-lg ${
        unlocked ? "bg-primary/10" : "bg-muted"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={unlocked ? { scale: [1, 1.1, 1] } : {}}
    >
      <div className="flex items-center gap-3">
        <div
          className={`text-2xl ${unlocked ? "rotating-badge" : "opacity-50"}`}
        >
          {typeof Icon === "function" ? <Icon /> : Icon}
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {!unlocked && progress > 0 && (
        <div className="mt-2">
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {progress}%
          </p>
        </div>
      )}
    </motion.div>
  );
}

export const ACHIEVEMENTS = [
  {
    id: "first_recipe",
    title: "Primera Receta",
    description: "¡Guardaste tu primera receta!",
    icon: "🏆",
    condition: (favorites: any[]) => favorites.length >= 1,
  },
  {
    id: "recipe_collector",
    title: "Coleccionista",
    description: "Guarda 10 recetas diferentes",
    icon: "📚",
    condition: (favorites: any[]) => favorites.length >= 10,
    progress: (favorites: any[]) =>
      Math.min((favorites.length / 10) * 100, 100),
  },
  {
    id: "world_cuisine",
    title: "Chef Internacional",
    description: "Guarda recetas de 5 países diferentes",
    icon: "🌎",
    condition: (favorites: any[]) =>
      new Set(favorites.map((f) => f.strArea)).size >= 5,
    progress: (favorites: any[]) =>
      Math.min((new Set(favorites.map((f) => f.strArea)).size / 5) * 100, 100),
  },
  {
    id: "healthy_choice",
    title: "Vida Saludable",
    description: "Guarda 5 recetas de ensaladas o vegetarianas",
    icon: "🥗",
    condition: (favorites: any[]) =>
      favorites.filter(
        (f) =>
          f.strCategory === "Vegetarian" ||
          f.strCategory === "Salad" ||
          f.strTags?.toLowerCase().includes("vegetarian") ||
          f.strTags?.toLowerCase().includes("salad")
      ).length >= 5,
    progress: (favorites: any[]) => {
      const count = favorites.filter(
        (f) =>
          f.strCategory === "Vegetarian" ||
          f.strCategory === "Salad" ||
          f.strTags?.toLowerCase().includes("vegetarian") ||
          f.strTags?.toLowerCase().includes("salad")
      ).length;
      return Math.min((count / 5) * 100, 100);
    },
  },
  {
    id: "dessert_lover",
    title: "Amante de los Postres",
    description: "Guarda 5 recetas de postres",
    icon: "🍰",
    condition: (favorites: any[]) =>
      favorites.filter((f) => f.strCategory === "Dessert").length >= 5,
    progress: (favorites: any[]) => {
      const count = favorites.filter((f) => f.strCategory === "Dessert").length;
      return Math.min((count / 5) * 100, 100);
    },
  },
];
