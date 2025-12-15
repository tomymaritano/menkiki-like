import { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList } from "react-native";
import { router } from "expo-router";
import { COLORS } from "../src/constants";
import { useOnboarding } from "../src/hooks/useOnboarding";

const { width } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: "1",
    emoji: "📸",
    title: "Snap a Photo",
    description: "Take a picture of any food you're craving. Our AI will identify what it is.",
  },
  {
    id: "2",
    emoji: "🤖",
    title: "AI Recognition",
    description: "Advanced machine learning identifies pizza, sushi, ramen, burgers, and more.",
  },
  {
    id: "3",
    emoji: "📍",
    title: "Find Nearby",
    description: "Get instant recommendations for the best restaurants near you.",
  },
  {
    id: "4",
    emoji: "🍽️",
    title: "Enjoy Your Meal",
    description: "Call ahead, get directions, and discover your next favorite spot.",
  },
];

function Slide({ item }: { item: OnboardingSlide }) {
  return (
    <View style={styles.slide}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
}

function Pagination({ currentIndex }: { currentIndex: number }) {
  return (
    <View style={styles.pagination}>
      {SLIDES.map((_, index) => (
        <View key={index} style={[styles.dot, currentIndex === index && styles.dotActive]} />
      ))}
    </View>
  );
}

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { completeOnboarding } = useOnboarding();

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    await completeOnboarding();
    router.replace("/");
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
      <View style={styles.header}>
        {!isLastSlide && (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={({ item }) => <Slide item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      <Pagination currentIndex={currentIndex} />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{isLastSlide ? "Get Started" : "Next"}</Text>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    height: 100,
    alignItems: "flex-end",
  },
  skipText: {
    color: COLORS.secondary,
    fontSize: 16,
  },
  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 40,
  },
  title: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    color: COLORS.secondary,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surface,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "600",
  },
});
