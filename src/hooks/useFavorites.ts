import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Restaurant } from "../types";

const FAVORITES_KEY = "@menkiki:favorites";

interface UseFavoritesReturn {
  favorites: Restaurant[];
  isLoading: boolean;
  isFavorite: (id: string) => boolean;
  addFavorite: (restaurant: Restaurant) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  toggleFavorite: (restaurant: Restaurant) => Promise<void>;
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, []);

  const saveFavorites = async (newFavorites: Restaurant[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  };

  const isFavorite = useCallback(
    (id: string) => {
      return favorites.some((fav) => fav.id === id);
    },
    [favorites]
  );

  const addFavorite = useCallback(
    async (restaurant: Restaurant) => {
      if (!isFavorite(restaurant.id)) {
        const newFavorites = [...favorites, restaurant];
        await saveFavorites(newFavorites);
      }
    },
    [favorites, isFavorite]
  );

  const removeFavorite = useCallback(
    async (id: string) => {
      const newFavorites = favorites.filter((fav) => fav.id !== id);
      await saveFavorites(newFavorites);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (restaurant: Restaurant) => {
      if (isFavorite(restaurant.id)) {
        await removeFavorite(restaurant.id);
      } else {
        await addFavorite(restaurant);
      }
    },
    [isFavorite, removeFavorite, addFavorite]
  );

  return {
    favorites,
    isLoading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
}
