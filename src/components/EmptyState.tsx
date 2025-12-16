import { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from "../constants";

interface EmptyStateProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ Icon, title, description, action }: EmptyStateProps) {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const iconBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle floating animation for icon
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(iconBounce, {
          toValue: -8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(iconBounce, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    float.start();

    return () => float.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          { transform: [{ translateY: iconBounce }] },
        ]}
      >
        <View style={styles.iconCircle}>
          <Icon size={40} color={COLORS.accent} strokeWidth={1.5} />
        </View>
        {/* Decorative rings */}
        <View style={[styles.ring, styles.ringOuter]} />
        <View style={[styles.ring, styles.ringInner]} />
      </Animated.View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {action && <View style={styles.actionContainer}>{action}</View>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING[8],
  },
  iconContainer: {
    position: "relative",
    marginBottom: SPACING[6],
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: COLORS.accentMuted,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  ring: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.accentMuted,
  },
  ringOuter: {
    width: 120,
    height: 120,
    opacity: 0.3,
  },
  ringInner: {
    width: 104,
    height: 104,
    opacity: 0.5,
  },
  title: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SPACING[2],
  },
  description: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.secondary,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
  actionContainer: {
    marginTop: SPACING[6],
  },
});
