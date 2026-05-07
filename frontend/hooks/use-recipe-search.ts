"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Recipe, RecipeSearchResponse } from "@/types";
import { z } from "zod";

// Esquema de validación para la respuesta de la API
const recipeSchema = z
  .object({
    idMeal: z.string(),
    strMeal: z.string(),
    strCategory: z.string(),
    strArea: z.string().nullable(),
    strInstructions: z.string(),
    strMealThumb: z.string(),
    strTags: z.string().nullable(),
    strYoutube: z.string().nullable(),
  })
  .catchall(z.string().nullable()); // Para los ingredientes y medidas dinámicos

const searchResponseSchema = z.object({
  meals: z.array(recipeSchema).nullable(),
});

export function useRecipeSearch() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchRecipes = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          searchTerm
        )}`
      );

      if (!response.ok) {
        throw new Error("Error al buscar recetas");
      }

      const data: RecipeSearchResponse = await response.json();

      // Validar la respuesta con Zod
      const validatedData = searchResponseSchema.parse(data);

      if (!validatedData.meals) {
        setRecipes([]);
        toast({
          title: "Sin resultados",
          description:
            "No se encontraron recetas que coincidan con tu búsqueda",
          variant: "default",
        });
        return;
      }

      setRecipes(validatedData.meals);

      if (validatedData.meals.length === 0) {
        toast({
          title: "Sin resultados",
          description:
            "No se encontraron recetas que coincidan con tu búsqueda",
          variant: "default",
        });
      } else {
        toast({
          title: "Búsqueda completada",
          description: `Se encontraron ${validatedData.meals.length} recetas`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
      toast({
        title: "Error",
        description:
          "Ocurrió un error al buscar las recetas. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recipes,
    isLoading,
    searchRecipes,
  };
}
