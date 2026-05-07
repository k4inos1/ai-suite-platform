import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { Recipe } from "@/types";

interface FlipCardProps {
  recipe: Recipe;
  onFavoriteClick: (recipe: Recipe) => void;
  onDetailsClick: (recipe: Recipe) => void;
  isFavorite: boolean;
}

export function FlipCard({
  recipe,
  onFavoriteClick,
  onDetailsClick,
  isFavorite,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const calculateDifficulty = (instructions: string) => {
    const steps = instructions.split("\n").filter((step) => step.trim()).length;
    if (steps <= 5) return "Fácil";
    if (steps <= 10) return "Intermedio";
    return "Avanzado";
  };

  const estimateCookingTime = (instructions: string) => {
    const steps = instructions.split("\n").filter((step) => step.trim()).length;
    const averageMinutesPerStep = 5;
    const totalMinutes = steps * averageMinutesPerStep;
    if (totalMinutes <= 15) return "15 min";
    if (totalMinutes <= 30) return "30 min";
    if (totalMinutes <= 60) return "1 hora";
    return "> 1 hora";
  };

  const difficulty = calculateDifficulty(recipe.strInstructions);
  const cookingTime = estimateCookingTime(recipe.strInstructions);

  return (
    <div
      className="relative w-full h-[400px] cursor-pointer perspective"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("button")) {
          onDetailsClick(recipe);
        }
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={isFlipped ? "back" : "front"}
          className="w-full h-full absolute"
          initial={{ rotateY: isFlipped ? -180 : 0 }}
          animate={{ rotateY: isFlipped ? 0 : 180 }}
          exit={{ rotateY: isFlipped ? 180 : -180 }}
          transition={{ duration: 0.3 }}
          style={{ backfaceVisibility: "hidden" }}
        >
          <Card className="w-full h-full overflow-hidden">
            {!isFlipped ? (
              // Frente de la tarjeta
              <div className="h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-white line-clamp-2">
                      {recipe.strMeal}
                    </h3>
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-sm px-2 py-1 bg-secondary rounded-full">
                      {recipe.strCategory}
                    </span>
                    {recipe.strArea && (
                      <span className="text-sm px-2 py-1 bg-secondary rounded-full">
                        {recipe.strArea}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>⏱ {cookingTime}</span>
                    <span>📚 {difficulty}</span>
                  </div>
                </div>
              </div>
            ) : (
              // Reverso de la tarjeta
              <div className="h-full p-4 flex flex-col">
                <h3 className="text-lg font-semibold mb-4">{recipe.strMeal}</h3>
                <div className="flex-1 overflow-y-auto">
                  <h4 className="font-medium mb-2">
                    Ingredientes principales:
                  </h4>
                  <ul className="list-disc list-inside mb-4">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const ingredient = recipe[`strIngredient${i + 1}`];
                      const measure = recipe[`strMeasure${i + 1}`];
                      if (ingredient && ingredient.trim()) {
                        return (
                          <li key={i} className="text-sm text-muted-foreground">
                            {ingredient} - {measure}
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                  <h4 className="font-medium mb-2">Resumen:</h4>
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {recipe.strInstructions}
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="text-sm px-2 py-1 bg-secondary rounded-full">
                      ⏱ {cookingTime}
                    </span>
                    <span className="text-sm px-2 py-1 bg-secondary rounded-full">
                      📚 {difficulty}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavoriteClick(recipe);
                    }}
                    className="text-2xl transition-transform hover:scale-110"
                  >
                    {isFavorite ? "♥" : "♡"}
                  </button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
