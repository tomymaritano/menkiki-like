import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { COLORS } from "../constants";

const { width, height } = Dimensions.get("window");

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  color: string;
}

const PARTICLE_COLORS = [
  COLORS.accent,
  COLORS.success,
  COLORS.warning,
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
];

const NUM_PARTICLES = 20;

export function SuccessCelebration({ onComplete }: { onComplete?: () => void }) {
  const particles = useRef<Particle[]>(
    Array.from({ length: NUM_PARTICLES }, () => ({
      x: new Animated.Value(width / 2),
      y: new Animated.Value(height / 2 - 100),
      rotate: new Animated.Value(0),
      scale: new Animated.Value(0),
      opacity: new Animated.Value(1),
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    }))
  ).current;

  const centerBurst = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Center burst animation
    Animated.sequence([
      Animated.spring(centerBurst, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(centerBurst, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Ring expansion
    Animated.parallel([
      Animated.timing(ringScale, {
        toValue: 3,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(ringOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Particle animations
    const particleAnimations = particles.map((particle, index) => {
      const angle = (index / NUM_PARTICLES) * Math.PI * 2;
      const distance = 100 + Math.random() * 100;
      const targetX = width / 2 + Math.cos(angle) * distance;
      const targetY = height / 2 - 100 + Math.sin(angle) * distance + 50;

      return Animated.parallel([
        // Move outward
        Animated.timing(particle.x, {
          toValue: targetX,
          duration: 600 + Math.random() * 200,
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: targetY + 100,
          duration: 800 + Math.random() * 200,
          useNativeDriver: true,
        }),
        // Scale up then down
        Animated.sequence([
          Animated.timing(particle.scale, {
            toValue: 1 + Math.random() * 0.5,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 0,
            duration: 600,
            delay: 200,
            useNativeDriver: true,
          }),
        ]),
        // Rotate
        Animated.timing(particle.rotate, {
          toValue: Math.random() * 4 - 2,
          duration: 800,
          useNativeDriver: true,
        }),
        // Fade out
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 800,
          delay: 200,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(particleAnimations).start(() => {
      onComplete?.();
    });
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Center ring */}
      <Animated.View
        style={[
          styles.ring,
          {
            transform: [{ scale: ringScale }],
            opacity: ringOpacity,
          },
        ]}
      />

      {/* Center burst */}
      <Animated.View
        style={[
          styles.centerBurst,
          {
            transform: [{ scale: centerBurst }],
            opacity: centerBurst,
          },
        ]}
      />

      {/* Particles */}
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              backgroundColor: particle.color,
              width: 8 + Math.random() * 8,
              height: 8 + Math.random() * 8,
              borderRadius: Math.random() > 0.5 ? 999 : 2,
              transform: [
                { translateX: Animated.subtract(particle.x, width / 2) },
                { translateY: Animated.subtract(particle.y, height / 2) },
                {
                  rotate: particle.rotate.interpolate({
                    inputRange: [-2, 2],
                    outputRange: ["-180deg", "180deg"],
                  }),
                },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  ring: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: COLORS.accent,
    top: "40%",
  },
  centerBurst: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accentGlow,
    top: "40%",
  },
  particle: {
    position: "absolute",
  },
});
