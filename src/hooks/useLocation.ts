import { useState, useCallback } from "react";
import * as Location from "expo-location";
import type { Location as LocationType } from "../types";
import { DEFAULT_LOCATION } from "../constants";

interface UseLocationState {
  location: LocationType | null;
  isLoading: boolean;
  error: string | null;
  permissionStatus: Location.PermissionStatus | null;
  isUsingDefault: boolean;
}

interface UseLocationReturn extends UseLocationState {
  requestLocation: () => Promise<void>;
  refreshLocation: () => Promise<void>;
}

export function useLocation(): UseLocationReturn {
  const [state, setState] = useState<UseLocationState>({
    location: null,
    isLoading: false,
    error: null,
    permissionStatus: null,
    isUsingDefault: false,
  });

  const setDefaultLocation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isLoading: false,
      isUsingDefault: true,
      location: {
        latitude: DEFAULT_LOCATION.latitude,
        longitude: DEFAULT_LOCATION.longitude,
      },
    }));
  }, []);

  const requestLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setState((prev) => ({ ...prev, permissionStatus: status }));

      if (status !== "granted") {
        // Use default location (Escobar) when permission denied
        setDefaultLocation();
        setState((prev) => ({
          ...prev,
          error: `Using default location (${DEFAULT_LOCATION.name})`,
        }));
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setState((prev) => ({
        ...prev,
        isLoading: false,
        isUsingDefault: false,
        location: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
      }));
    } catch (error) {
      console.error("Failed to get location:", error);
      // Fallback to default location on error
      setDefaultLocation();
      setState((prev) => ({
        ...prev,
        error: `Using default location (${DEFAULT_LOCATION.name})`,
      }));
    }
  }, [setDefaultLocation]);

  const refreshLocation = useCallback(async () => {
    if (state.permissionStatus === "granted") {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isUsingDefault: false,
          location: {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          },
        }));
      } catch (error) {
        console.error("Failed to refresh location:", error);
        setDefaultLocation();
        setState((prev) => ({
          ...prev,
          error: `Using default location (${DEFAULT_LOCATION.name})`,
        }));
      }
    } else {
      // If permission not granted, use default
      setDefaultLocation();
    }
  }, [state.permissionStatus, setDefaultLocation]);

  return {
    ...state,
    requestLocation,
    refreshLocation,
  };
}
