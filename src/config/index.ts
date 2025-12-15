/**
 * Application configuration
 * Centralizes environment variables and app settings
 */

import Constants from "expo-constants";

// Environment detection
export const IS_DEV = __DEV__;
export const IS_PROD = !__DEV__;

// API Keys
export const GOOGLE_PLACES_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || "";

// App Info
export const APP_VERSION = Constants.expoConfig?.version || "1.0.0";
export const APP_NAME = Constants.expoConfig?.name || "Menkiki-like";
export const BUILD_NUMBER = Constants.expoConfig?.ios?.buildNumber || "1";

// Feature Flags
export const FEATURES = {
  REAL_ML_CLASSIFICATION: true,
  REAL_PLACES_API: !!GOOGLE_PLACES_API_KEY,
  OFFLINE_MODE: true,
  ANALYTICS: IS_PROD,
} as const;

// API Configuration
export const API_CONFIG = {
  PLACES_BASE_URL: "https://maps.googleapis.com/maps/api/place",
  SEARCH_RADIUS: 1500, // meters
  MAX_RESULTS: 10,
  REQUEST_TIMEOUT: 10000, // ms
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  FAVORITES: "@menkiki/favorites",
  HISTORY: "@menkiki/history",
  ONBOARDING_COMPLETE: "@menkiki/onboarding_complete",
  USER_PREFERENCES: "@menkiki/user_preferences",
} as const;

// Log configuration status in development
if (IS_DEV) {
  console.log("[Config] App Version:", APP_VERSION);
  console.log("[Config] Places API:", FEATURES.REAL_PLACES_API ? "Enabled" : "Mock");
  console.log("[Config] ML Classification:", FEATURES.REAL_ML_CLASSIFICATION ? "Real" : "Mock");
}
