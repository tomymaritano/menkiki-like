import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Sparkles, Scan, Brain } from "lucide-react-native";
import { COLORS, SPACING, TYPOGRAPHY } from "../constants";

interface AILoadingAnimationProps {
  message?: string;
  subMessage?: string;
}

export function AILoadingAnimation({
  message = "Analyzing image...",
  subMessage = "AI is identifying the food",
}: AILoadingAnimationProps) {
  const rotation = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const ring1Scale = useRef(new Animated.Value(0.8)).current;
  const ring1Opacity = useRef(new Animated.Value(0.6)).current;
  const ring2Scale = useRef(new Animated.Value(0.8)).current;
  const ring2Opacity = useRef(new Animated.Value(0.4)).current;
  const iconOpacity = useRef(new Animated.Value(1)).current;
  const dotScale1 = useRef(new Animated.Value(0.3)).current;
  const dotScale2 = useRef(new Animated.Value(0.3)).current;
  const dotScale3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Rotation animation
    const rotate = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Pulse animation
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Ring 1 animation
    const ring1Anim = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ring1Scale, {
            toValue: 1.5,
            duration: 1500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(ring1Opacity, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ring1Scale, {
            toValue: 0.8,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(ring1Opacity, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // Ring 2 animation (delayed)
    const ring2Anim = Animated.loop(
      Animated.sequence([
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(ring2Scale, {
            toValue: 1.5,
            duration: 1500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(ring2Opacity, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ring2Scale, {
            toValue: 0.8,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(ring2Opacity, {
            toValue: 0.4,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // Dots animation (sequential)
    const createDotAnim = (dotRef: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dotRef, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dotRef, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );

    rotate.start();
    pulseAnim.start();
    ring1Anim.start();
    ring2Anim.start();
    createDotAnim(dotScale1, 0).start();
    createDotAnim(dotScale2, 200).start();
    createDotAnim(dotScale3, 400).start();

    return () => {
      rotate.stop();
      pulseAnim.stop();
      ring1Anim.stop();
      ring2Anim.stop();
    };
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      {/* Pulsing rings */}
      <Animated.View
        style={[
          styles.ring,
          {
            transform: [{ scale: ring1Scale }],
            opacity: ring1Opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          styles.ring2,
          {
            transform: [{ scale: ring2Scale }],
            opacity: ring2Opacity,
          },
        ]}
      />

      {/* Main icon container */}
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: pulse }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Sparkles size={36} color={COLORS.accent} strokeWidth={1.5} />
        </Animated.View>
      </Animated.View>

      {/* Message */}
      <Text style={styles.message}>{message}</Text>

      {/* Animated dots */}
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, { transform: [{ scale: dotScale1 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ scale: dotScale2 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ scale: dotScale3 }] }]} />
      </View>

      {/* Sub message */}
      <Text style={styles.subMessage}>{subMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING[8],
  },
  ring: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  ring2: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.accentMuted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING[5],
    // Glow effect
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  message: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.semibold,
    marginBottom: SPACING[3],
  },
  dotsContainer: {
    flexDirection: "row",
    gap: SPACING[2],
    marginBottom: SPACING[2],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  subMessage: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.sm,
  },
});
