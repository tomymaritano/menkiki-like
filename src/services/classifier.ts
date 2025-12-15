import * as ImageManipulator from "expo-image-manipulator";
import { CONFIDENCE_THRESHOLD } from "../constants";
import type { ClassificationResult, FoodCategory } from "../types";

// Model configuration
const IMAGE_SIZE = 224;

// Food category labels
const CATEGORY_LABELS: FoodCategory[] = ["pizza", "sushi", "ramen", "burger", "empanada"];

/**
 * Load the classification model
 * For v1, we use a mock classifier. In production, load a real TFLite model.
 */
export async function loadModel(): Promise<void> {
  console.log("Model loader initialized (using mock classifier for v1)");
}

/**
 * Simple hash function for strings
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Run classification on an image
 */
export async function classifyImage(uri: string): Promise<ClassificationResult> {
  try {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));

    // Use image URI to generate consistent-ish results
    // Different photos should give different categories
    const hash = hashString(uri + Date.now().toString());
    const categoryIndex = hash % CATEGORY_LABELS.length;

    // Generate confidence based on hash
    const confidenceBase = 75 + (hash % 20); // 75-94%

    return {
      category: CATEGORY_LABELS[categoryIndex],
      confidence: confidenceBase,
    };
  } catch (error) {
    console.error("Classification failed:", error);
    throw error;
  }
}

/**
 * Check if confidence meets threshold
 */
export function isConfident(result: ClassificationResult): boolean {
  return result.confidence >= CONFIDENCE_THRESHOLD * 100;
}

/**
 * Get human-readable category name
 */
export function getCategoryDisplayName(category: FoodCategory): string {
  const names: Record<FoodCategory, string> = {
    pizza: "Pizza",
    sushi: "Sushi",
    ramen: "Ramen",
    burger: "Burger",
    empanada: "Empanada",
  };
  return names[category];
}
