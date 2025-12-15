import { useState, useEffect, useCallback } from "react";
import { useLocation } from "./useLocation";
import { searchNearbyRestaurants } from "../services/places";
import type { Restaurant } from "../types";

interface UseRestaurantsState {
  restaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
  hasLocation: boolean;
}

interface UseRestaurantsReturn extends UseRestaurantsState {
  search: (category: string) => Promise<void>;
  retry: () => Promise<void>;
}

export function useRestaurants(category: string): UseRestaurantsReturn {
  const { location, isLoading: locationLoading, error: locationError, requestLocation } = useLocation();

  const [state, setState] = useState<UseRestaurantsState>({
    restaurants: [],
    isLoading: true,
    error: null,
    hasLocation: false,
  });

  const [currentCategory, setCurrentCategory] = useState(category);

  // Request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Search when location is available
  useEffect(() => {
    if (location && currentCategory) {
      searchRestaurants(currentCategory);
    }
  }, [location, currentCategory]);

  // Handle location error
  useEffect(() => {
    if (locationError) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: locationError,
      }));
    }
  }, [locationError]);

  // Update loading state
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isLoading: locationLoading,
      hasLocation: !!location,
    }));
  }, [locationLoading, location]);

  const searchRestaurants = async (cat: string) => {
    if (!location) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const results = await searchNearbyRestaurants(location, cat);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        restaurants: results,
        error: results.length === 0 ? "No restaurants found nearby" : null,
      }));
    } catch (error) {
      console.error("Failed to search restaurants:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to search restaurants",
      }));
    }
  };

  const search = useCallback(async (cat: string) => {
    setCurrentCategory(cat);
    if (location) {
      await searchRestaurants(cat);
    }
  }, [location]);

  const retry = useCallback(async () => {
    if (!location) {
      await requestLocation();
    } else {
      await searchRestaurants(currentCategory);
    }
  }, [location, currentCategory, requestLocation]);

  return {
    ...state,
    search,
    retry,
  };
}
