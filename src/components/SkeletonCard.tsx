import { useEffect, useRef } from "react";
import { Animated, View, StyleSheet, Easing } from "react-native";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../constants";

interface SkeletonCardProps {
  delay?: number;
}

export function SkeletonCard({ delay = 0 }: SkeletonCardProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 300,
      delay,
      useNativeDriver: true,
    }).start();

    // Shimmer wave effect
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          delay: delay % 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim, fadeIn, delay]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.15, 0.35, 0.15],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 50],
  });

  return (
    <Animated.View style={[styles.card, { opacity: fadeIn }]}>
      {/* Icon placeholder */}
      <View style={styles.iconContainer}>
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              opacity: shimmerOpacity,
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        />
      </View>

      {/* Content area */}
      <View style={styles.content}>
        {/* Name bar */}
        <View style={styles.nameBar}>
          <Animated.View
            style={[
              styles.shimmerOverlay,
              {
                opacity: shimmerOpacity,
                transform: [{ translateX: shimmerTranslate }],
              },
            ]}
          />
        </View>

        {/* Meta row (rating, distance, price) */}
        <View style={styles.metaRow}>
          <View style={styles.ratingBar}>
            <Animated.View
              style={[
                styles.shimmerOverlay,
                {
                  opacity: shimmerOpacity,
                  transform: [{ translateX: shimmerTranslate }],
                },
              ]}
            />
          </View>
          <View style={styles.distanceBar}>
            <Animated.View
              style={[
                styles.shimmerOverlay,
                {
                  opacity: shimmerOpacity,
                  transform: [{ translateX: shimmerTranslate }],
                },
              ]}
            />
          </View>
          <View style={styles.priceBar}>
            <Animated.View
              style={[
                styles.shimmerOverlay,
                {
                  opacity: shimmerOpacity,
                  transform: [{ translateX: shimmerTranslate }],
                },
              ]}
            />
          </View>
        </View>

        {/* Address bar */}
        <View style={styles.addressBar}>
          <Animated.View
            style={[
              styles.shimmerOverlay,
              {
                opacity: shimmerOpacity,
                transform: [{ translateX: shimmerTranslate }],
              },
            ]}
          />
        </View>
      </View>

      {/* Heart placeholder */}
      <View style={styles.heartContainer}>
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              opacity: shimmerOpacity,
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} delay={index * 100} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: SPACING[5],
    paddingBottom: SPACING[10],
    gap: SPACING[3],
  },
  card: {
    backgroundColor: COLORS.glass.background,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.glass.border,
    padding: SPACING[4],
    flexDirection: "row",
    alignItems: "center",
    ...SHADOWS.md,
    overflow: "hidden",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    marginRight: SPACING[3],
    overflow: "hidden",
  },
  content: {
    flex: 1,
  },
  nameBar: {
    height: 18,
    width: "75%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING[2],
    overflow: "hidden",
  },
  metaRow: {
    flexDirection: "row",
    gap: SPACING[2],
    marginBottom: SPACING[2],
  },
  ratingBar: {
    height: 22,
    width: 50,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    overflow: "hidden",
  },
  distanceBar: {
    height: 14,
    width: 45,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    alignSelf: "center",
    overflow: "hidden",
  },
  priceBar: {
    height: 14,
    width: 30,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    alignSelf: "center",
    overflow: "hidden",
  },
  addressBar: {
    height: 14,
    width: "60%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    overflow: "hidden",
  },
  heartContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    overflow: "hidden",
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.secondary,
  },
});
