import { useRef, useEffect } from "react";
import { TouchableOpacity, Animated, StyleSheet, View } from "react-native";
import { Heart } from "lucide-react-native";
import { COLORS, RADIUS } from "../constants";
import { useHaptics } from "../hooks";

interface AnimatedHeartProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: number;
}

export function AnimatedHeart({ isFavorite, onToggle, size = 20 }: AnimatedHeartProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const particleOpacity = useRef(new Animated.Value(0)).current;
  const particleScale = useRef(new Animated.Value(0.5)).current;
  const haptics = useHaptics();
  const prevFavorite = useRef(isFavorite);

  useEffect(() => {
    // Only animate when changing from false to true
    if (isFavorite && !prevFavorite.current) {
      // Heart bounce animation
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1.2,
          friction: 3,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();

      // Particle burst animation
      Animated.parallel([
        Animated.timing(particleOpacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(particleScale, {
          toValue: 1.8,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.timing(particleOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          particleScale.setValue(0.5);
        });
      });
    } else if (!isFavorite && prevFavorite.current) {
      // Subtle shrink when removing
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }

    prevFavorite.current = isFavorite;
  }, [isFavorite]);

  const handlePress = () => {
    if (!isFavorite) {
      haptics.success();
    } else {
      haptics.light();
    }
    onToggle();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={styles.container}
      activeOpacity={0.7}
    >
      {/* Particle burst effect */}
      <Animated.View
        style={[
          styles.particles,
          {
            opacity: particleOpacity,
            transform: [{ scale: particleScale }],
          },
        ]}
      >
        <View style={[styles.particle, styles.particle1]} />
        <View style={[styles.particle, styles.particle2]} />
        <View style={[styles.particle, styles.particle3]} />
        <View style={[styles.particle, styles.particle4]} />
      </Animated.View>

      {/* Heart icon */}
      <Animated.View style={{ transform: [{ scale }] }}>
        <Heart
          size={size}
          color={isFavorite ? COLORS.error : COLORS.secondary}
          fill={isFavorite ? COLORS.error : "transparent"}
          strokeWidth={isFavorite ? 0 : 1.5}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  particles: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  particle: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.error,
  },
  particle1: {
    top: 4,
    left: "50%",
    marginLeft: -3,
  },
  particle2: {
    bottom: 4,
    left: "50%",
    marginLeft: -3,
  },
  particle3: {
    left: 4,
    top: "50%",
    marginTop: -3,
  },
  particle4: {
    right: 4,
    top: "50%",
    marginTop: -3,
  },
});
