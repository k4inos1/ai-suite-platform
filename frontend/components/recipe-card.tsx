"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { Recipe, RecipeCardProps } from "@/types";

const MemoizedRecipeCard = memo(function RecipeCard({
  recipe,
  onFavoriteClick,
  onDetailsClick,
  isFavorite,
}: RecipeCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // No abrir el modal si se hace click en el botón de favoritos
    if (!(e.target as HTMLElement).closest("button")) {
      onDetailsClick(recipe);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Card
        className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 group cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative aspect-video overflow-hidden">
          <motion.img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            initial={false}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <CardHeader>
          <CardTitle className="line-clamp-2 min-h-[3rem]">
            {recipe.strMeal}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm px-2 py-1 bg-secondary rounded-full">
              {recipe.strCategory}
            </span>
            {recipe.strArea && (
              <span className="text-sm px-2 py-1 bg-secondary rounded-full">
                {recipe.strArea}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            variant={isFavorite ? "default" : "outline"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevenir que el click se propague a la tarjeta
              onFavoriteClick(recipe);
            }}
            className="group/btn relative"
          >
            <motion.span
              className="absolute inset-0 flex items-center justify-center"
              initial={false}
              animate={isFavorite ? { scale: [1.5, 1] } : { scale: 1 }}
            >
              {isFavorite ? "♥" : "♡"}
            </motion.span>
            <span className="opacity-0">Favorito</span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
});

export { MemoizedRecipeCard as RecipeCard };
