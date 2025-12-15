import { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { COLORS } from "../constants";

interface SkeletonCardProps {
  delay?: number;
}

export function SkeletonCard({ delay = 0 }: SkeletonCardProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim, delay]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Animated.View style={[styles.titleBar, { opacity }]} />
        <View style={styles.metaRow}>
          <Animated.View style={[styles.metaBar, { opacity }]} />
          <Animated.View style={[styles.metaBar, styles.metaBarShort, { opacity }]} />
        </View>
        <Animated.View style={[styles.addressBar, { opacity }]} />
      </View>
      <Animated.View style={[styles.arrow, { opacity }]} />
    </View>
  );
}

export function SkeletonList() {
  return (
    <View style={styles.list}>
      <SkeletonCard delay={0} />
      <SkeletonCard delay={100} />
      <SkeletonCard delay={200} />
      <SkeletonCard delay={300} />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  titleBar: {
    height: 20,
    width: "70%",
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  metaBar: {
    height: 14,
    width: 60,
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
  },
  metaBarShort: {
    width: 40,
  },
  addressBar: {
    height: 12,
    width: "50%",
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
  },
  arrow: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
  },
});
