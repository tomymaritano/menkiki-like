import { useState, useEffect, useCallback } from "react";
import * as Location from "expo-location";
import type { Location as LocationType } from "../types";

interface UseLocationState {
  location: LocationType | null;
  isLoading: boolean;
  error: string | null;
  permissionStatus: Location.PermissionStatus | null;
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
  });

  const requestLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      setState((prev) => ({ ...prev, permissionStatus: status }));

      if (status !== "granted") {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Location permission denied",
        }));
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setState((prev) => ({
        ...prev,
        isLoading: false,
        location: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
      }));
    } catch (error) {
      console.error("Failed to get location:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to get location",
      }));
    }
  }, []);

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
          location: {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          },
        }));
      } catch (error) {
        console.error("Failed to refresh location:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to refresh location",
        }));
      }
    }
  }, [state.permissionStatus]);

  return {
    ...state,
    requestLocation,
    refreshLocation,
  };
}
