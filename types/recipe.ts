export interface Recipe {
  idMeal: string
  strMeal: string
  strCategory: string
  strArea?: string | null
  strInstructions: string
  strMealThumb: string
  strTags?: string | null
  strYoutube?: string | null
  [key: string]: string | null | undefined
}
