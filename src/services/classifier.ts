import * as tf from "@tensorflow/tfjs";
import * as ImageManipulator from "expo-image-manipulator";
import { FOOD_CATEGORIES, CONFIDENCE_THRESHOLD } from "../constants";
import type { ClassificationResult, FoodCategory } from "../types";

// Model configuration
const IMAGE_SIZE = 224;

// Food category labels (must match model output order)
const CATEGORY_LABELS: FoodCategory[] = ["pizza", "sushi", "ramen", "burger", "empanada"];

let model: tf.LayersModel | null = null;

/**
 * Load the classification model
 * For v1, we use a mock classifier. In production, load a real TFLite model.
 */
export async function loadModel(): Promise<void> {
  // TODO: Load actual model
  // model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
  console.log("Model loader initialized (using mock classifier for v1)");
}

/**
 * Preprocess image for model input
 */
async function preprocessImage(uri: string): Promise<tf.Tensor3D> {
  // Resize image to model input size
  const manipulated = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: IMAGE_SIZE, height: IMAGE_SIZE } }],
    { format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );

  if (!manipulated.base64) {
    throw new Error("Failed to get base64 image");
  }

  // Convert base64 to tensor
  // Note: In production, use decodeJpeg from tfjs-react-native
  // For now, we'll use the mock classifier
  const tensor = tf.zeros([IMAGE_SIZE, IMAGE_SIZE, 3]);
  return tensor as tf.Tensor3D;
}

/**
 * Run classification on an image
 */
export async function classifyImage(uri: string): Promise<ClassificationResult> {
  try {
    // Preprocess image
    const imageTensor = await preprocessImage(uri);

    // For v1: Use mock classification based on image analysis
    // This simulates what the real model would do
    const result = await mockClassify(uri);

    // Cleanup
    imageTensor.dispose();

    return result;
  } catch (error) {
    console.error("Classification failed:", error);
    throw error;
  }
}

/**
 * Mock classifier for v1
 * Simulates ML classification with realistic behavior
 */
async function mockClassify(uri: string): Promise<ClassificationResult> {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Generate realistic mock results
  // In production, this would be replaced with actual model inference
  const randomIndex = Math.floor(Math.random() * CATEGORY_LABELS.length);
  const confidence = 0.75 + Math.random() * 0.2; // 75-95%

  return {
    category: CATEGORY_LABELS[randomIndex],
    confidence: Math.round(confidence * 100),
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
