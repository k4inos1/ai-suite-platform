import { GiChefToque, GiFoodTruck, GiStarMedal } from "react-icons/gi";
import { IoFastFood } from "react-icons/io5";
import { FaBookBookmark } from "react-icons/fa6";
import { Achievement } from "@/types";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_favorite",
    title: "Primera Receta Favorita",
    description: "Guardaste tu primera receta favorita",
    icon: IoFastFood,
    requirement: 1,
    type: "favorites",
  },
  {
    id: "recipe_collector",
    title: "Coleccionista de Recetas",
    description: "Guarda 10 recetas favoritas",
    icon: FaBookBookmark,
    requirement: 10,
    type: "favorites",
  },
  {
    id: "master_chef",
    title: "Master Chef",
    description: "Guarda 25 recetas favoritas",
    icon: GiChefToque,
    requirement: 25,
    type: "favorites",
  },
  {
    id: "food_explorer",
    title: "Explorador Culinario",
    description: "Busca 15 recetas diferentes",
    icon: GiFoodTruck,
    requirement: 15,
    type: "searches",
  },
  {
    id: "recipe_master",
    title: "Maestro de las Recetas",
    description: "Completa todos los logros anteriores",
    icon: GiStarMedal,
    requirement: 4,
    type: "meta",
  },
];
