import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useClassifier } from "../src/hooks/useClassifier";
import { COLORS } from "../src/constants";

export default function DetectionScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const { isReady, isClassifying, result, displayName, isLowConfidence, error, classify } =
    useClassifier();

  useEffect(() => {
    if (isReady && photoUri) {
      classify(photoUri);
    }
  }, [isReady, photoUri, classify]);

  const handleFindPlaces = () => {
    if (!displayName) return;
    router.push({
      pathname: "/results",
      params: { category: displayName },
    });
  };

  const handleRetake = () => {
    router.back();
  };

  const renderStatus = () => {
    if (!isReady || isClassifying) {
      return (
        <>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.statusText}>
            {!isReady ? "Loading AI model..." : "Analyzing image..."}
          </Text>
        </>
      );
    }

    if (error) {
      return (
        <>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => photoUri && classify(photoUri)}
          >
            <Text style={styles.retryButtonText}>Try again</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (result && displayName) {
      return (
        <>
          <Text style={styles.label}>Detected</Text>
          <Text style={styles.foodName}>{displayName}</Text>
          <View style={styles.confidenceContainer}>
            <Text style={[styles.confidence, isLowConfidence && styles.lowConfidence]}>
              {result.confidence}% confidence
            </Text>
            {isLowConfidence && (
              <Text style={styles.lowConfidenceWarning}>Not very sure — try a clearer photo</Text>
            )}
          </View>
        </>
      );
    }

    return <Text style={styles.errorText}>No result</Text>;
  };

  return (
    <View style={styles.container}>
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
        <TouchableOpacity
          style={[styles.primaryButton, (!result || isClassifying) && styles.buttonDisabled]}
          onPress={handleFindPlaces}
          disabled={!result || isClassifying}
        >
          <Text style={styles.primaryButtonText}>Find nearby places</Text>
        </TouchableOpacity>

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
    paddingTop: 60,
  },
  imageContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  image: {
    height: 300,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  imagePlaceholder: {
    height: 300,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: COLORS.secondary,
    fontSize: 16,
  },
  resultContainer: {
    alignItems: "center",
    marginBottom: 40,
    minHeight: 140,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  statusText: {
    color: COLORS.secondary,
    fontSize: 16,
    marginTop: 16,
  },
  label: {
    color: COLORS.secondary,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  foodName: {
    color: COLORS.primary,
    fontSize: 48,
    fontWeight: "700",
    marginTop: 8,
  },
  confidenceContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  confidence: {
    color: COLORS.success,
    fontSize: 16,
  },
  lowConfidence: {
    color: COLORS.warning,
  },
  lowConfidenceWarning: {
    color: COLORS.secondary,
    fontSize: 13,
    marginTop: 4,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  actions: {
    paddingHorizontal: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
  },
});
