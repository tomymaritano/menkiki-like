import { useEffect } from "react";
import { Slot, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useNetwork, useOnboarding } from "../src/hooks";
import { OfflineBanner, ErrorBoundary } from "../src/components";
import { COLORS } from "../src/constants";

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isConnected, isInternetReachable } = useNetwork();
  const { isLoading, hasCompletedOnboarding } = useOnboarding();
  const segments = useSegments();

  const isOffline = isConnected === false || isInternetReachable === false;

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;

    const inOnboarding = segments[0] === "onboarding";

    if (!hasCompletedOnboarding && !inOnboarding) {
      router.replace("/onboarding");
    }
  }, [isLoading, hasCompletedOnboarding, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <StatusBar style="light" />
        {isOffline && <OfflineBanner />}
        <View style={styles.content}>
          <Slot />
        </View>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
});
