"use client";

import { useState, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRecipeSearch } from "@/hooks/use-recipe-search";
import { useFavorites } from "@/hooks/use-favorites";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useAchievements } from "@/hooks/use-achievements";
/* import { useSoundEffects } from "@/hooks/use-sound-effects"; */
import { ACHIEVEMENTS } from "@/constants/achievements";
import dynamic from "next/dynamic";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BackgroundEffects } from "@/components/background-effects";
import { ConfettiEffect } from "@/components/confetti-effect";
import { Timer } from "@/components/timer";
import { AchievementBadge } from "@/components/achievement-badge";
import { RecipeCard } from "@/components/recipe-card"; // Added import for RecipeCard
import { Badge } from "@/components/ui/badge"; // Added import for Badge
import type { Recipe } from "@/types"; // Added import for Recipe type

// Importación dinámica de componentes pesados
const FlipCard = dynamic(
  () => import("@/components/flip-card").then((mod) => mod.FlipCard),
  {
    loading: () => <RecipeCardSkeleton />,
    ssr: false,
  }
);

const Modal = dynamic(
  () => import("@/components/ui/modal").then((mod) => mod.Modal),
  {
    ssr: false,
  }
);

function RecipeCardSkeleton() {
  return (
    <div className="h-[400px] rounded-lg border bg-card animate-pulse">
      <div className="h-48 bg-muted rounded-t-lg" />
      <div className="p-4 space-y-4">
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-4 w-1/2 bg-muted rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-muted rounded" />
          <div className="h-8 w-24 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const { recipes, isLoading, searchRecipes } = useRecipeSearch();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { searchHistory, addToHistory } = useSearchHistory();
  const { unlockedAchievements, getProgress } = useAchievements(favorites);
  // const { playClick, playSuccess, playUnlock } = useSoundEffects();
  const { toast } = useToast();

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchTerm.trim()) {
        toast({
          title: "Campo vacío",
          description: "Por favor, ingresa un término de búsqueda",
          variant: "destructive",
        });
        return;
      }
      // playClick();
      addToHistory(searchTerm);
      await searchRecipes(searchTerm);
    },
    [searchTerm, searchRecipes, addToHistory, toast /*, playClick*/]
  );

  const handleHistorySelect = (term: string) => {
    setSearchTerm(term);
  };

  const clearHistory = () => {
    // Assuming useSearchHistory hook provides a method to clear history
    // If not, this function should be implemented accordingly
    // For now, we can clear localStorage and update state
    localStorage.removeItem("searchHistory");
    // Ideally, update searchHistory state here if possible
  };

  const handleFavoriteClick = useCallback(
    (recipe: Recipe) => {
      const isCurrentlyFavorite = isFavorite(recipe.idMeal);
      if (isCurrentlyFavorite) {
        removeFavorite(recipe.idMeal);
      } else {
        addFavorite(recipe);
        setShowConfetti(true);
        // playSuccess();
      }
    },
    [isFavorite, removeFavorite, addFavorite /*, playSuccess*/]
  );

  const handleDetailsClick = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col relative">
        <BackgroundEffects />
        <ConfettiEffect
          active={showConfetti}
          onComplete={() => setShowConfetti(false)}
        />

        <header className="border-b sticky top-0 z-40 backdrop-blur-sm bg-background/80">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold animated-gradient">
              🍳 Recetapps
            </h1>
            <nav className="flex items-center gap-4">
              <div className="shine-effect">
                <Button variant="ghost" className="text-sm">
                  {favorites.length} recetas guardadas
                </Button>
              </div>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto mb-8 fade-in-up">
            <div className="text-center mb-6">
              <h2 className="text-4xl font-bold mb-3 animated-gradient">
                ¿Qué quieres cocinar hoy?
              </h2>
              <p className="text-muted-foreground text-lg">
                Descubre miles de recetas deliciosas de todo el mundo
              </p>
            </div>

            <div className="relative animated-bg p-4 rounded-lg">
              <form onSubmit={handleSearch} className="flex gap-2 group">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowHistory(true)}
                    onBlur={() => {
                      // Pequeño retraso para permitir clicks en el historial
                      setTimeout(() => setShowHistory(false), 200);
                    }}
                    placeholder="Busca tus recetas favoritas..."
                    className="w-full pl-10 h-12 transition-all duration-300 group-focus-within:ring-2"
                    aria-label="Búsqueda de recetas"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    🔍
                  </span>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Buscando...
                    </span>
                  ) : (
                    "Buscar"
                  )}
                </Button>
              </form>

              {showHistory && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-md shadow-lg z-50">
                  <div className="py-2 px-1">
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      Búsquedas recientes
                    </div>
                    {searchHistory.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleHistorySelect(term)}
                        className="w-full px-2 py-1.5 text-left hover:bg-accent rounded-sm flex items-center gap-2 text-sm"
                      >
                        <span className="text-muted-foreground">🕒</span>
                        {term}
                      </button>
                    ))}
                    <div className="border-t mt-2 pt-2 px-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          clearHistory();
                          setShowHistory(false);
                        }}
                        className="w-full text-destructive text-sm"
                      >
                        Limpiar historial
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Tabs defaultValue="search" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger
                value="search"
                className="data-[state=active]:animated-gradient"
                // onClick={() => playClick()}
              >
                Búsqueda
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="data-[state=active]:animated-gradient"
                // onClick={() => playClick()}
              >
                Favoritos ({favorites.length})
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="data-[state=active]:animated-gradient"
                // onClick={() => playClick()}
              >
                Logros
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={`skeleton-${i}`}
                        className="fade-in-up"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <RecipeCardSkeleton />
                      </div>
                    ))}
                  </div>
                ) : recipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe, index) => (
                      <div
                        key={recipe.idMeal}
                        className="fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <Suspense fallback={<RecipeCardSkeleton />}>
                          <RecipeCard
                            recipe={recipe}
                            onFavoriteClick={handleFavoriteClick}
                            onDetailsClick={handleDetailsClick}
                            isFavorite={isFavorite(recipe.idMeal)}
                          />
                        </Suspense>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 animated-bg rounded-lg">
                    <div className="max-w-md mx-auto space-y-4">
                      <p className="text-2xl font-semibold">
                        ¡Comienza tu búsqueda!
                      </p>
                      <p className="text-muted-foreground">
                        Escribe el nombre de un platillo o ingrediente para
                        descubrir deliciosas recetas
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <AnimatePresence mode="wait">
                {favorites.length === 0 ? (
                  <div className="text-center py-12 animated-bg rounded-lg">
                    <div className="max-w-md mx-auto space-y-4">
                      <p className="text-2xl font-semibold">
                        No tienes recetas guardadas
                      </p>
                      <p className="text-muted-foreground">
                        Guarda tus recetas favoritas haciendo clic en el corazón
                        ♡
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((recipe, index) => (
                      <div
                        key={recipe.idMeal}
                        className="fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <Suspense fallback={<RecipeCardSkeleton />}>
                          <RecipeCard
                            recipe={recipe}
                            onFavoriteClick={handleFavoriteClick}
                            onDetailsClick={handleDetailsClick}
                            isFavorite={true}
                          />
                        </Suspense>
                      </div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACHIEVEMENTS.map((achievement) => {
                  const isUnlocked = unlockedAchievements.some(
                    (a) => a.id === achievement.id
                  );
                  const progress = getProgress(achievement.id);

                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AchievementBadge
                        title={achievement.title}
                        description={achievement.description}
                        icon={achievement.icon}
                        unlocked={isUnlocked}
                        progress={progress}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </main>

        {isModalOpen && selectedRecipe && (
          <Modal
            onClose={() => setIsModalOpen(false)}
            title={selectedRecipe.strMeal}
          >
            <div className="grid md:grid-cols-[2fr,3fr] gap-6">
              <div className="space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={selectedRecipe.strMealThumb}
                    alt={selectedRecipe.strMeal}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedRecipe.strMeal}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {selectedRecipe.strCategory}
                    </Badge>
                    {selectedRecipe.strArea && (
                      <Badge variant="secondary">
                        {selectedRecipe.strArea}
                      </Badge>
                    )}
                    {selectedRecipe.strTags && (
                      <Badge variant="secondary">
                        {selectedRecipe.strTags}
                      </Badge>
                    )}
                  </div>
                </div>

                {selectedRecipe.strYoutube && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Video tutorial:
                    </h3>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        if (selectedRecipe.strYoutube) {
                          window.open(selectedRecipe.strYoutube, "_blank");
                        }
                      }}
                    >
                      Ver en YouTube
                    </Button>
                  </div>
                )}

                <div className="space-y-4">
                  <Timer
                    initialMinutes={1}
                    onComplete={() => {
                      toast({
                        title: "¡Tiempo terminado!",
                        description: "Es hora de revisar tu preparación",
                      });
                    }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold mb-3">Ingredientes:</h3>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const ingredient =
                        selectedRecipe[`strIngredient${i + 1}`];
                      const measure = selectedRecipe[`strMeasure${i + 1}`];
                      if (ingredient && ingredient.trim()) {
                        return (
                          <li
                            key={`${selectedRecipe.idMeal}-ingredient-${i}`}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
                          >
                            <span className="text-primary">•</span>
                            <span>
                              <strong>{ingredient}</strong>
                              {measure && ` - ${measure}`}
                            </span>
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Instrucciones:</h3>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {selectedRecipe.strInstructions.split("\n").map(
                      (paragraph, index) =>
                        paragraph.trim() && (
                          <p
                            key={`${selectedRecipe.idMeal}-instruction-${index}`}
                            className="mb-4"
                          >
                            {paragraph}
                          </p>
                        )
                    )}
                  </div>
                </section>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cerrar
                  </Button>
                  <Button
                    variant={
                      isFavorite(selectedRecipe.idMeal) ? "default" : "outline"
                    }
                    onClick={() => handleFavoriteClick(selectedRecipe)}
                  >
                    {isFavorite(selectedRecipe.idMeal)
                      ? "Quitar de favoritos"
                      : "Agregar a favoritos"}
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
      <Toaster />
    </>
  );
}
