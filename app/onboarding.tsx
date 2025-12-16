import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, Sparkles, MapPin } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from "../src/constants";
import { useOnboarding, useHaptics } from "../src/hooks";
import { Logo } from "../src/components";

const { width } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  Icon: LucideIcon;
  title: string;
  description: string;
}

// Reduced to 3 slides for minimal feel
const SLIDES: OnboardingSlide[] = [
  {
    id: "1",
    Icon: Camera,
    title: "Snap",
    description: "See something delicious? Just point and shoot",
  },
  {
    id: "2",
    Icon: Sparkles,
    title: "Identify",
    description: "Our AI knows food like a chef knows their kitchen",
  },
  {
    id: "3",
    Icon: MapPin,
    title: "Discover",
    description: "We'll show you the best spots nearby to dig in",
  },
];

function AnimatedSlide({ item, isActive }: { item: OnboardingSlide; isActive: boolean }) {
  const { Icon } = item;
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(iconRotate, {
          toValue: 1,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.8);
      opacity.setValue(0);
      iconRotate.setValue(0);
    }
  }, [isActive]);

  const rotate = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-10deg", "0deg"],
  });

  return (
    <View style={styles.slide}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            opacity,
            transform: [{ scale }, { rotate }],
          },
        ]}
      >
        <Icon size={48} color={COLORS.accent} strokeWidth={1.5} />
      </Animated.View>

      <Animated.Text style={[styles.title, { opacity }]}>
        {item.title}
      </Animated.Text>

      <Animated.Text style={[styles.description, { opacity }]}>
        {item.description}
      </Animated.Text>
    </View>
  );
}

function AnimatedPagination({ currentIndex, total }: { currentIndex: number; total: number }) {
  return (
    <View style={styles.pagination}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = currentIndex === index;
        return (
          <AnimatedDot key={index} isActive={isActive} />
        );
      })}
    </View>
  );
}

function AnimatedDot({ isActive }: { isActive: boolean }) {
  const width = useRef(new Animated.Value(isActive ? 24 : 8)).current;
  const opacity = useRef(new Animated.Value(isActive ? 1 : 0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(width, {
        toValue: isActive ? 24 : 8,
        friction: 6,
        tension: 100,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: isActive ? 1 : 0.3,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isActive]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width,
          opacity,
          backgroundColor: isActive ? COLORS.accent : COLORS.secondary,
        },
      ]}
    />
  );
}

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useOnboarding();
  const haptics = useHaptics();
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    haptics.light();
    Animated.spring(buttonScale, {
      toValue: 0.96,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      haptics.selection();
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      haptics.success();
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    haptics.light();
    completeOnboarding();
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems[0]?.index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      {/* Header with Logo */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING[4] }]}>
        <Logo size="sm" showIcon={false} />
        {!isLastSlide && (
          <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={({ item, index }) => (
          <AnimatedSlide item={item} isActive={index === currentIndex} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
        scrollEventThrottle={16}
      />

      {/* Pagination */}
      <AnimatedPagination currentIndex={currentIndex} total={SLIDES.length} />

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING[6] }]}>
        <TouchableOpacity
          onPress={handleNext}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <Animated.View style={[styles.button, { transform: [{ scale: buttonScale }] }]}>
            <Text style={styles.buttonText}>
              {isLastSlide ? "Let's Eat!" : "Continue"}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING[5],
    paddingBottom: SPACING[4],
  },
  skipText: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING[8],
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 32,
    backgroundColor: COLORS.accentMuted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING[8],
    // Subtle shadow
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  title: {
    color: COLORS.primary,
    fontSize: 40,
    fontWeight: TYPOGRAPHY.weight.bold,
    textAlign: "center",
    marginBottom: SPACING[3],
    letterSpacing: -1,
  },
  description: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.lg,
    textAlign: "center",
    lineHeight: 26,
    maxWidth: 280,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING[6],
    gap: SPACING[2],
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: SPACING[5],
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING[4],
    borderRadius: RADIUS.xl,
    alignItems: "center",
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
});
