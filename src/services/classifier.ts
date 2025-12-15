import { CONFIDENCE_THRESHOLD } from "../constants";
import type { ClassificationResult, FoodCategory } from "../types";

// Food category labels
const CATEGORY_LABELS: FoodCategory[] = ["pizza", "sushi", "ramen", "burger", "empanada"];

/**
 * Load the classification model
 * For v1, we use a mock classifier. In production, load a real TFLite model.
 */
export async function loadModel(): Promise<void> {
  // Model initialization placeholder
}

/**
 * Simple hash function for strings
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Run classification on an image
 */
export async function classifyImage(uri: string): Promise<ClassificationResult> {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));

  // Use image URI + timestamp to generate varied results
  const hash = hashString(uri + Date.now().toString());
  const categoryIndex = hash % CATEGORY_LABELS.length;
  const confidenceBase = 75 + (hash % 20);

  return {
    category: CATEGORY_LABELS[categoryIndex],
    confidence: confidenceBase,
  };
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
