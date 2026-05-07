"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Estado para almacenar nuestro valor
  // Pasar la función inicial al useState para que solo se ejecute una vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === "undefined") {
        return initialValue;
      }
      // Obtener del localStorage por key
      const item = window.localStorage.getItem(key);
      // Analizar el JSON almacenado o si no existe devolver el valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay error devolver valor inicial
      console.log(error);
      return initialValue;
    }
  });

  // Devolver una versión envuelta de la función setter de useState que persiste
  // el nuevo valor en localStorage.
  const setValue = (value: T) => {
    try {
      // Permitir que el valor sea una función para que tengamos la misma API que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Guardar el estado
      setStoredValue(valueToStore);
      // Guardar en localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Una implementación más avanzada manejaría el caso de error
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
