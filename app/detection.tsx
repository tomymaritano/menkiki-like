import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function DetectionScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const [isClassifying, setIsClassifying] = useState(true);
  const [result, setResult] = useState<{ category: string; confidence: number } | null>(null);

  useEffect(() => {
    // Simulate classification (will be replaced with TFLite)
    const classifyImage = async () => {
      setIsClassifying(true);

      // Simulate ML inference delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock result - will be replaced with actual classification
      const mockCategories = ["Pizza", "Sushi", "Ramen", "Burger", "Empanada"];
      const randomCategory = mockCategories[Math.floor(Math.random() * mockCategories.length)];
      const randomConfidence = Math.floor(Math.random() * 20) + 80; // 80-99%

      setResult({
        category: randomCategory,
        confidence: randomConfidence,
      });
      setIsClassifying(false);
    };

    classifyImage();
  }, [photoUri]);

  const handleFindPlaces = () => {
    if (!result) return;
    router.push({
      pathname: "/results",
      params: { category: result.category },
    });
  };

  const handleRetake = () => {
    router.back();
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

      <View style={styles.resultContainer}>
        {isClassifying ? (
          <>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.classifyingText}>Analyzing image...</Text>
          </>
        ) : result ? (
          <>
            <Text style={styles.label}>Detected</Text>
            <Text style={styles.foodName}>{result.category}</Text>
            <Text style={styles.confidence}>{result.confidence}% confidence</Text>
          </>
        ) : (
          <Text style={styles.errorText}>Could not classify image</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.primaryButton, (isClassifying || !result) && styles.buttonDisabled]}
          onPress={handleFindPlaces}
          disabled={isClassifying || !result}
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
    backgroundColor: "#000",
    paddingTop: 60,
  },
  imageContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  image: {
    height: 300,
    borderRadius: 16,
    backgroundColor: "#1a1a1a",
  },
  imagePlaceholder: {
    height: 300,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#888",
    fontSize: 16,
  },
  resultContainer: {
    alignItems: "center",
    marginBottom: 40,
    minHeight: 120,
    justifyContent: "center",
  },
  classifyingText: {
    color: "#888",
    fontSize: 16,
    marginTop: 16,
  },
  label: {
    color: "#888",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  foodName: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "700",
    marginTop: 8,
  },
  confidence: {
    color: "#4ade80",
    fontSize: 16,
    marginTop: 8,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
  },
  actions: {
    paddingHorizontal: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#888",
    fontSize: 16,
  },
});
