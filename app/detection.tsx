import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RefreshCw, MapPin, ArrowLeft } from "lucide-react-native";
import { useClassifier, useHistory, useHaptics } from "../src/hooks";
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from "../src/constants";
import { FadeIn, GlassButton, Logo, AILoadingAnimation, SuccessCelebration } from "../src/components";

export default function DetectionScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const insets = useSafeAreaInsets();
  const { isReady, isClassifying, result, displayName, isLowConfidence, error, classify } =
    useClassifier();
  const { addToHistory } = useHistory();
  const haptics = useHaptics();
  const [showCelebration, setShowCelebration] = useState(false);
  const hasShownCelebration = useRef(false);

  useEffect(() => {
    if (isReady && photoUri) {
      classify(photoUri);
    }
  }, [isReady, photoUri, classify]);

  // Trigger celebration when detection succeeds
  useEffect(() => {
    if (result && displayName && !isLowConfidence && !hasShownCelebration.current) {
      hasShownCelebration.current = true;
      haptics.success();
      setShowCelebration(true);
    }
  }, [result, displayName, isLowConfidence]);

  const handleFindPlaces = async () => {
    if (!displayName) return;
    haptics.success();
    await addToHistory(displayName);
    router.push({
      pathname: "/results",
      params: { category: displayName },
    });
  };

  const handleRetake = () => {
    haptics.light();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleBack = () => {
    haptics.light();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const renderStatus = () => {
    if (!isReady || isClassifying) {
      return (
        <AILoadingAnimation
          message={!isReady ? "Warming up the AI..." : "What have we here?"}
          subMessage={!isReady ? "Almost ready to work magic" : "Our AI chef is taking a closer look"}
        />
      );
    }

    if (error) {
      return (
        <FadeIn>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              haptics.medium();
              photoUri && classify(photoUri);
            }}
          >
            <RefreshCw size={16} color={COLORS.primary} />
            <Text style={styles.retryButtonText}>Try again</Text>
          </TouchableOpacity>
        </FadeIn>
      );
    }

    if (result && displayName) {
      return (
        <FadeIn>
          <Text style={styles.label}>Detected</Text>
          <Text style={styles.foodName}>{displayName}</Text>
          <View style={styles.confidenceContainer}>
            <Text style={[styles.confidence, isLowConfidence && styles.lowConfidence]}>
              {result.confidence}% confidence
            </Text>
            {isLowConfidence && (
              <Text style={styles.lowConfidenceWarning}>Hmm, not 100% sure — a clearer shot might help!</Text>
            )}
          </View>
        </FadeIn>
      );
    }

    return <Text style={styles.errorText}>No result</Text>;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {showCelebration && <SuccessCelebration onComplete={() => setShowCelebration(false)} />}
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backButton}
        >
          <ArrowLeft size={20} color={COLORS.secondary} />
        </TouchableOpacity>
        <Logo size="sm" showIcon={false} />
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.imageContainer}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>No photo</Text>
          </View>
        )}
      </View>

      <View style={styles.resultContainer}>{renderStatus()}</View>

      <View style={styles.actions}>
        <GlassButton
          title="Find nearby places"
          onPress={handleFindPlaces}
          variant="primary"
          size="lg"
          fullWidth
          disabled={!result || isClassifying}
          icon={MapPin}
        />

        <TouchableOpacity style={styles.secondaryButton} onPress={handleRetake}>
          <Text style={styles.secondaryButtonText}>Retake photo</Text>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING[5],
    paddingVertical: SPACING[3],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSpacer: {
    width: 40,
  },
  imageContainer: {
    paddingHorizontal: SPACING[5],
    marginBottom: SPACING[6],
  },
  image: {
    height: 300,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
  },
  imagePlaceholder: {
    height: 300,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.md,
  },
  resultContainer: {
    alignItems: "center",
    marginBottom: SPACING[10],
    minHeight: 180,
    justifyContent: "center",
    paddingHorizontal: SPACING[5],
  },
  label: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  foodName: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.size["5xl"],
    fontWeight: TYPOGRAPHY.weight.bold,
    marginTop: SPACING[2],
  },
  confidenceContainer: {
    alignItems: "center",
    marginTop: SPACING[2],
  },
  confidence: {
    color: COLORS.success,
    fontSize: TYPOGRAPHY.size.md,
  },
  lowConfidence: {
    color: COLORS.warning,
  },
  lowConfidenceWarning: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.sm,
    marginTop: SPACING[1],
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.size.md,
    textAlign: "center",
  },
  retryButton: {
    marginTop: SPACING[4],
    paddingHorizontal: SPACING[6],
    paddingVertical: SPACING[3],
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING[2],
  },
  retryButtonText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.size.md,
  },
  actions: {
    paddingHorizontal: SPACING[5],
    gap: SPACING[3],
  },
  secondaryButton: {
    paddingVertical: SPACING[4],
    alignItems: "center",
  },
  secondaryButtonText: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.md,
  },
});
