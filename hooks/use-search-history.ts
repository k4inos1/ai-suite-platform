import { useState, useEffect } from "react";

const SEARCH_HISTORY_KEY = "recipe-search-history";
const MAX_HISTORY_ITEMS = 10;

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addToHistory = (term: string) => {
    if (!term.trim()) return;

    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item !== term); // Remover si ya existe
      return [term, ...filtered].slice(0, MAX_HISTORY_ITEMS); // Mantener solo los últimos 10
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  return {
    searchHistory,
    addToHistory,
    clearHistory,
  };
}
