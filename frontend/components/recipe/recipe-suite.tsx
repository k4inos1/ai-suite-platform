"use client"

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { BookOpen, Heart, Search, Sparkles, UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Recipe } from '@/types/recipe'

const FAVORITES_STORAGE_KEY = 'ai-suite-platform.recipe-favorites'
const QUICK_SEARCHES = ['Pasta', 'Chicken', 'Vegetarian', 'Seafood']

const getIngredients = (recipe: Recipe) => {
  const ingredients: Array<{ name: string; measure: string }> = []

  for (let index = 1; index <= 20; index += 1) {
    const ingredient = recipe[`strIngredient${index}`]?.trim()
    if (!ingredient) continue

    ingredients.push({
      name: ingredient,
      measure: recipe[`strMeasure${index}`]?.trim() ?? '',
    })
  }

  return ingredients
}

const getInstructionSteps = (instructions: string) => {
  const normalizedSteps = instructions
    .split(/\r?\n+/)
    .map((step) => step.trim())
    .filter(Boolean)

  if (normalizedSteps.length > 1) {
    return normalizedSteps
  }

  return instructions
    .split(/(?<=\.)\s+/)
    .map((step) => step.trim())
    .filter(Boolean)
}

export function RecipeSuite() {
  const [query, setQuery] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [favorites, setFavorites] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeCollection, setActiveCollection] = useState<'results' | 'favorites'>('results')
  const [hasLoadedFavorites, setHasLoadedFavorites] = useState(false)

  useEffect(() => {
    try {
      const storedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (!storedFavorites) return

      const parsedFavorites = JSON.parse(storedFavorites)
      if (Array.isArray(parsedFavorites)) {
        setFavorites(parsedFavorites)
      }
    } catch (storageError) {
      console.warn('No se pudieron recuperar los favoritos:', storageError)
    } finally {
      setHasLoadedFavorites(true)
    }
  }, [])

  useEffect(() => {
    if (!hasLoadedFavorites) return
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites, hasLoadedFavorites])

  const visibleRecipes = activeCollection === 'favorites' ? favorites : recipes
  const selectedIngredients = useMemo(
    () => (selectedRecipe ? getIngredients(selectedRecipe) : []),
    [selectedRecipe]
  )
  const selectedInstructions = useMemo(
    () => (selectedRecipe ? getInstructionSteps(selectedRecipe.strInstructions) : []),
    [selectedRecipe]
  )

  const isFavorite = (recipeId: string) => favorites.some((recipe) => recipe.idMeal === recipeId)

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites((currentFavorites) => {
      if (currentFavorites.some((favorite) => favorite.idMeal === recipe.idMeal)) {
        return currentFavorites.filter((favorite) => favorite.idMeal !== recipe.idMeal)
      }

      return [recipe, ...currentFavorites]
    })
  }

  const handleSearch = async (event?: FormEvent<HTMLFormElement>, presetQuery?: string) => {
    event?.preventDefault()

    const nextQuery = (presetQuery ?? query).trim()
    if (!nextQuery) {
      setError('Escribe un ingrediente o nombre de plato para buscar recetas.')
      return
    }

    setQuery(nextQuery)
    setIsLoading(true)
    setError(null)
    setActiveCollection('results')

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(nextQuery)}`
      )

      if (!response.ok) {
        throw new Error(`La búsqueda falló con código ${response.status}`)
      }

      const data = (await response.json()) as { meals: Recipe[] | null }
      const nextRecipes = Array.isArray(data.meals) ? data.meals : []

      setRecipes(nextRecipes)
      setSelectedRecipe(nextRecipes[0] ?? null)
      if (nextRecipes.length === 0) {
        setError('No encontramos recetas para esa búsqueda. Prueba con otro término.')
      }
    } catch (searchError) {
      console.error('Recipe search error:', searchError)
      setRecipes([])
      setSelectedRecipe(null)
      setError('No se pudieron cargar recetas en este momento.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCollectionChange = (collection: 'results' | 'favorites') => {
    setActiveCollection(collection)
    const nextSelected =
      collection === 'favorites'
        ? favorites[0] ?? selectedRecipe
        : recipes[0] ?? selectedRecipe
    setSelectedRecipe(nextSelected ?? null)
  }

  return (
    <section className="flex h-full flex-col overflow-hidden">
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">AI Suite Platform</p>
            <h2 className="text-2xl font-semibold text-foreground">Recipe Studio</h2>
            <p className="text-sm text-muted-foreground">
              Busca recetas, revisa ingredientes paso a paso y guarda tus favoritas.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-80">
            <div className="rounded-2xl border bg-card p-3">
              <p className="text-muted-foreground">Resultados</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{recipes.length}</p>
            </div>
            <div className="rounded-2xl border bg-card p-3">
              <p className="text-muted-foreground">Favoritas</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{favorites.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid h-full w-full max-w-7xl gap-6 overflow-hidden px-4 py-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex min-h-0 flex-col gap-4 overflow-hidden">
          <form
            onSubmit={handleSearch}
            className="rounded-3xl border bg-card p-4 shadow-sm"
          >
            <label className="mb-3 block text-sm font-medium text-foreground" htmlFor="recipe-search">
              Explora recetas de recetas_ai dentro del monorepo
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="recipe-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Ej. pasta, sopa, chicken curry..."
                  className="h-12 w-full rounded-2xl border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? 'Buscando...' : 'Buscar receta'}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_SEARCHES.map((quickSearch) => (
                <button
                  key={quickSearch}
                  type="button"
                  onClick={() => handleSearch(undefined, quickSearch)}
                  className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                >
                  {quickSearch}
                </button>
              ))}
            </div>
          </form>

          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-full border bg-card p-1 text-sm">
              <button
                type="button"
                onClick={() => handleCollectionChange('results')}
                className={cn(
                  'rounded-full px-4 py-2 transition',
                  activeCollection === 'results'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Resultados
              </button>
              <button
                type="button"
                onClick={() => handleCollectionChange('favorites')}
                className={cn(
                  'rounded-full px-4 py-2 transition',
                  activeCollection === 'favorites'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Mis favoritas
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Fuente pública: TheMealDB
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid min-h-0 gap-4 overflow-y-auto pb-2 md:grid-cols-2 xl:grid-cols-3">
            {visibleRecipes.map((recipe) => {
              const favorite = isFavorite(recipe.idMeal)

              return (
                <article
                  key={recipe.idMeal}
                  className={cn(
                    'overflow-hidden rounded-3xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
                    selectedRecipe?.idMeal === recipe.idMeal && 'border-primary/50 ring-2 ring-primary/15'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedRecipe(recipe)}
                    className="block w-full text-left"
                  >
                    <img
                      src={recipe.strMealThumb}
                      alt={recipe.strMeal}
                      className="h-44 w-full object-cover"
                    />
                    <div className="space-y-3 p-4">
                      <div>
                        <h3 className="line-clamp-2 text-base font-semibold text-foreground">
                          {recipe.strMeal}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {recipe.strCategory}
                          {recipe.strArea ? ` · ${recipe.strArea}` : ''}
                        </p>
                      </div>
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {recipe.strInstructions}
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center justify-between border-t px-4 py-3">
                    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <UtensilsCrossed className="h-3.5 w-3.5" />
                      {getIngredients(recipe).length} ingredientes
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(recipe)}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition',
                        favorite
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      )}
                    >
                      <Heart className={cn('h-3.5 w-3.5', favorite && 'fill-current')} />
                      {favorite ? 'Guardada' : 'Guardar'}
                    </button>
                  </div>
                </article>
              )
            })}

            {!isLoading && visibleRecipes.length === 0 && !error && (
              <div className="col-span-full rounded-3xl border border-dashed bg-card/60 p-8 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Empieza con una búsqueda rápida
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Encuentra ideas para cocinar y conserva tus recetas preferidas en este espacio.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="min-h-0 overflow-y-auto rounded-3xl border bg-card p-5 shadow-sm">
          {selectedRecipe ? (
            <div className="space-y-5">
              <img
                src={selectedRecipe.strMealThumb}
                alt={selectedRecipe.strMeal}
                className="h-56 w-full rounded-2xl object-cover"
              />
              <div>
                <p className="text-sm font-medium text-primary">Ficha de receta</p>
                <h3 className="mt-1 text-2xl font-semibold text-foreground">
                  {selectedRecipe.strMeal}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedRecipe.strCategory}
                  {selectedRecipe.strArea ? ` · ${selectedRecipe.strArea}` : ''}
                </p>
              </div>

              <section>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Ingredientes
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {selectedIngredients.map((ingredient) => (
                    <li
                      key={`${selectedRecipe.idMeal}-${ingredient.name}`}
                      className="flex items-start justify-between gap-3 rounded-2xl bg-secondary/50 px-3 py-2"
                    >
                      <span>{ingredient.name}</span>
                      <span className="text-right text-foreground/80">{ingredient.measure || 'Al gusto'}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Preparación
                </h4>
                <ol className="mt-3 space-y-3">
                  {selectedInstructions.map((step, index) => (
                    <li key={`${selectedRecipe.idMeal}-step-${index}`} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {selectedRecipe.strYoutube && (
                <a
                  href={selectedRecipe.strYoutube}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  Ver video de preparación
                </a>
              )}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <UtensilsCrossed className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">Selecciona una receta</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Aquí verás el formato completo con ingredientes, pasos y recursos extra.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
