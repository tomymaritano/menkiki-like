import { useEffect, useState } from "react";
import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useNetwork, useOnboarding, OnboardingProvider, ToastProvider } from "../src/hooks";
import { OfflineBanner, ErrorBoundary, AnimatedSplash } from "../src/components";
import { COLORS } from "../src/constants";

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { isConnected, isInternetReachable } = useNetwork();
  const { isLoading, hasCompletedOnboarding } = useOnboarding();
  const segments = useSegments();
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const isOffline = isConnected === false || isInternetReachable === false;

  // Hide native splash when data is loaded
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
      setIsReady(true);
    }
  }, [isLoading]);

  // Handle navigation after animated splash completes
  useEffect(() => {
    if (!isReady || showAnimatedSplash) return;

    const inOnboarding = segments[0] === "onboarding";

    if (!hasCompletedOnboarding && !inOnboarding) {
      router.replace("/onboarding");
    } else if (hasCompletedOnboarding && inOnboarding) {
      router.replace("/");
    }
  }, [isReady, showAnimatedSplash, hasCompletedOnboarding, segments]);

  const handleSplashComplete = () => {
    setShowAnimatedSplash(false);
  };

  // Show animated splash after native splash hides
  if (isReady && showAnimatedSplash) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <AnimatedSplash onAnimationComplete={handleSplashComplete} />
      </View>
    );
  }

  // Still loading
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <StatusBar style="light" />
        {isOffline && <OfflineBanner />}
        <View style={styles.content}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: COLORS.background },
              animation: "slide_from_right",
              animationDuration: 250,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
            <Stack.Screen name="onboarding" options={{ animation: "fade" }} />
            <Stack.Screen name="detection" options={{ animation: "slide_from_bottom" }} />
            <Stack.Screen name="results" options={{ animation: "slide_from_right" }} />
          </Stack>
        </View>
      </View>
    </ErrorBoundary>
  );
}

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <ToastProvider>
        <RootLayoutContent />
      </ToastProvider>
    </OnboardingProvider>
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
