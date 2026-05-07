import { IconType } from "react-icons";

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea?: string | null;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string | null;
  strYoutube?: string | null;
  [key: string]: string | null | undefined; // Para los ingredientes y medidas dinámicos (strIngredient1, strMeasure1, etc.)
}

export interface RecipeSearchResponse {
  meals: Recipe[] | null;
}

export interface RecipeCardProps {
  recipe: Recipe;
  onFavoriteClick: (recipe: Recipe) => void;
  onDetailsClick: (recipe: Recipe) => void;
  isFavorite: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  requirement: number;
  type: "favorites" | "searches" | "meta";
}

export interface UnlockedAchievement extends Achievement {
  unlockedAt: Date;
}

export interface UserPreferences {
  soundsEnabled: boolean;
  theme: "light" | "dark" | "system";
  language: string;
  notifications: boolean;
}

export interface RecipeStats {
  totalCooked: number;
  favoriteCategory: string;
  lastCooked: Date;
  cookingStreak: number;
  achievements: Achievement[];
}
