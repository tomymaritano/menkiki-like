import { useEffect, useRef } from "react";
import { Animated, ViewStyle, StyleProp, Easing } from "react-native";

type AnimationDirection = "up" | "down" | "left" | "right" | "none";
type AnimationType = "timing" | "spring";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  direction?: AnimationDirection;
  distance?: number;
  type?: AnimationType;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 400,
  style,
  direction = "up",
  distance = 20,
  type = "timing",
}: FadeInProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(getInitialOffset(direction, distance))).current;
  const scaleAnim = useRef(new Animated.Value(direction === "none" ? 0.95 : 1)).current;

  useEffect(() => {
    const fadeAnimation =
      type === "spring"
        ? Animated.spring(fadeAnim, {
            toValue: 1,
            friction: 8,
            tension: 65,
            delay,
            useNativeDriver: true,
          })
        : Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            delay,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          });

    const translateAnimation =
      type === "spring"
        ? Animated.spring(translateAnim, {
            toValue: 0,
            friction: 8,
            tension: 65,
            delay,
            useNativeDriver: true,
          })
        : Animated.timing(translateAnim, {
            toValue: 0,
            duration,
            delay,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          });

    const scaleAnimation = Animated.timing(scaleAnim, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    const animations = [fadeAnimation];
    if (direction !== "none") {
      animations.push(translateAnimation);
    } else {
      animations.push(scaleAnimation);
    }

    Animated.parallel(animations).start();
  }, [fadeAnim, translateAnim, scaleAnim, delay, duration, type, direction]);

  const getTransform = () => {
    if (direction === "none") {
      return [{ scale: scaleAnim }];
    }

    const isHorizontal = direction === "left" || direction === "right";
    return [{ [isHorizontal ? "translateX" : "translateY"]: translateAnim }];
  };

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: getTransform(),
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

function getInitialOffset(direction: AnimationDirection, distance: number): number {
  switch (direction) {
    case "up":
      return distance;
    case "down":
      return -distance;
    case "left":
      return distance;
    case "right":
      return -distance;
    case "none":
      return 0;
  }
}

// Stagger container for automatic delay calculation
interface StaggerProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  initialDelay?: number;
  direction?: AnimationDirection;
  type?: AnimationType;
  style?: StyleProp<ViewStyle>;
}

export function Stagger({
  children,
  staggerDelay = 50,
  initialDelay = 0,
  direction = "up",
  type = "timing",
  style,
}: StaggerProps) {
  return (
    <>
      {children.map((child, index) => (
        <FadeIn
          key={index}
          delay={initialDelay + index * staggerDelay}
          direction={direction}
          type={type}
          style={style}
        >
          {child}
        </FadeIn>
      ))}
    </>
  );
}
