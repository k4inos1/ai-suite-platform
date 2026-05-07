"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Recipe } from "@/types";

// Clave para almacenar favoritos en localStorage
const FAVORITES_KEY = "recipe-favorites";

// Función auxiliar para leer favoritos del almacenamiento local
const getFavoritesFromStorage = (): Recipe[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading favorites from storage:", error);
    return [];
  }
};

// Función auxiliar para guardar favoritos en el almacenamiento local
const saveFavoritesToStorage = (favorites: Recipe[]) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites to storage:", error);
  }
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<Recipe[]>(() =>
    getFavoritesFromStorage()
  );
  const { toast } = useToast();

  // Mantener sincronizado el almacenamiento local cuando cambian los favoritos
  useEffect(() => {
    saveFavoritesToStorage(favorites);
  }, [favorites]);

  const isFavorite = useCallback(
    (id: string) => {
      return favorites.some((recipe) => recipe.idMeal === id);
    },
    [favorites]
  );

  const addFavorite = useCallback(
    (recipe: Recipe) => {
      if (!isFavorite(recipe.idMeal)) {
        setFavorites((prev) => [...prev, recipe]);
        toast({
          title: "Receta guardada",
          description: `${recipe.strMeal} se ha añadido a tus favoritos`,
        });
      }
    },
    [isFavorite, toast]
  );

  const removeFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const recipe = prev.find((r) => r.idMeal === id);
        const newFavorites = prev.filter((r) => r.idMeal !== id);

        if (recipe) {
          toast({
            title: "Receta eliminada",
            description: `${recipe.strMeal} se ha eliminado de tus favoritos`,
          });
        }

        return newFavorites;
      });
    },
    [toast]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
