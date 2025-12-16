import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { WifiOff, RefreshCw } from "lucide-react-native";
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from "../constants";

interface OfflineBannerProps {
  message?: string;
}

export function OfflineBanner({ message = "You're offline" }: OfflineBannerProps) {
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Slide in animation
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();

    // Pulse animation for the icon
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.content}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <View style={styles.iconContainer}>
            <WifiOff size={14} color={COLORS.primary} />
          </View>
        </Animated.View>
        <Text style={styles.text}>{message}</Text>
      </View>
      <Text style={styles.hint}>Check your connection and pull to refresh</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.error,
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING[2],
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  hint: {
    color: "rgba(255,255,255,0.7)",
    fontSize: TYPOGRAPHY.size.xs,
    textAlign: "center",
    marginTop: SPACING[1],
  },
});
