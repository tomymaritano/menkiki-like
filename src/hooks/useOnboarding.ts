import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "@menkiki:onboarding_complete";

interface UseOnboardingReturn {
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

export function useOnboarding(): UseOnboardingReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setHasCompletedOnboarding(value === "true");
      } catch (error) {
        console.error("Failed to check onboarding status:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkOnboarding();
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error("Failed to save onboarding status:", error);
    }
  }, []);

  const resetOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      setHasCompletedOnboarding(false);
    } catch (error) {
      console.error("Failed to reset onboarding status:", error);
    }
  }, []);

  return {
    isLoading,
    hasCompletedOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
}
