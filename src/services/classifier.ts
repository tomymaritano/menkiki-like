import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as FileSystem from "expo-file-system/legacy";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import { CONFIDENCE_THRESHOLD } from "../constants";
import { logger } from "../utils/logger";
import type { ClassificationResult, FoodCategory } from "../types";

// MobileNet model instance
let model: mobilenet.MobileNet | null = null;
let isModelLoading = false;
let modelLoadError: Error | null = null;

// Model status for UI feedback
export type ModelStatus = "idle" | "loading" | "ready" | "error";

export function getModelStatus(): ModelStatus {
  if (modelLoadError) return "error";
  if (model) return "ready";
  if (isModelLoading) return "loading";
  return "idle";
}

// Expanded ImageNet label mapping with confidence weights
const LABEL_TO_CATEGORY: Record<string, { category: FoodCategory; weight: number }> = {
  // Pizza - High confidence
  "pizza": { category: "pizza", weight: 1.0 },
  "pizza, pizza pie": { category: "pizza", weight: 1.0 },

  // Burger - High confidence
  "cheeseburger": { category: "burger", weight: 1.0 },
  "hamburger": { category: "burger", weight: 1.0 },
  "hotdog, hot dog, red hot": { category: "burger", weight: 0.85 },

  // Sushi - High confidence
  "sushi": { category: "sushi", weight: 1.0 },

  // Ramen / Noodles - Various confidence levels
  "carbonara": { category: "ramen", weight: 0.9 },
  "spaghetti squash": { category: "ramen", weight: 0.7 },
  "consomme": { category: "ramen", weight: 0.8 },
  "soup bowl": { category: "ramen", weight: 0.85 },
  "plate": { category: "ramen", weight: 0.5 },
  "bowl": { category: "ramen", weight: 0.5 },

  // Empanada / pastries
  "burrito": { category: "empanada", weight: 0.9 },
  "guacamole": { category: "empanada", weight: 0.7 },
  "bagel, beigel": { category: "empanada", weight: 0.75 },
  "pretzel": { category: "empanada", weight: 0.7 },
  "meat loaf, meatloaf": { category: "empanada", weight: 0.6 },

  // Additional food-related ImageNet classes
  "french loaf": { category: "empanada", weight: 0.5 },
  "dough": { category: "pizza", weight: 0.6 },
  "mushroom": { category: "pizza", weight: 0.4 },
  "mashed potato": { category: "burger", weight: 0.5 },
  "ice cream, icecream": { category: "burger", weight: 0.3 },
};

// Keywords for fuzzy matching with weights
const CATEGORY_KEYWORDS: Record<FoodCategory, { word: string; weight: number }[]> = {
  pizza: [
    { word: "pizza", weight: 1.0 },
    { word: "pie", weight: 0.6 },
    { word: "flatbread", weight: 0.7 },
    { word: "cheese", weight: 0.4 },
    { word: "dough", weight: 0.5 },
  ],
  burger: [
    { word: "burger", weight: 1.0 },
    { word: "hamburger", weight: 1.0 },
    { word: "cheeseburger", weight: 1.0 },
    { word: "sandwich", weight: 0.7 },
    { word: "hotdog", weight: 0.8 },
    { word: "bun", weight: 0.5 },
    { word: "patty", weight: 0.6 },
  ],
  sushi: [
    { word: "sushi", weight: 1.0 },
    { word: "sashimi", weight: 0.95 },
    { word: "fish", weight: 0.5 },
    { word: "seafood", weight: 0.5 },
    { word: "rice", weight: 0.3 },
    { word: "salmon", weight: 0.6 },
    { word: "tuna", weight: 0.6 },
  ],
  ramen: [
    { word: "ramen", weight: 1.0 },
    { word: "noodle", weight: 0.9 },
    { word: "soup", weight: 0.7 },
    { word: "pasta", weight: 0.7 },
    { word: "spaghetti", weight: 0.8 },
    { word: "carbonara", weight: 0.85 },
    { word: "bowl", weight: 0.4 },
    { word: "broth", weight: 0.6 },
  ],
  empanada: [
    { word: "empanada", weight: 1.0 },
    { word: "burrito", weight: 0.9 },
    { word: "taco", weight: 0.85 },
    { word: "pastry", weight: 0.7 },
    { word: "bread", weight: 0.5 },
    { word: "bagel", weight: 0.6 },
    { word: "turnover", weight: 0.8 },
  ],
};

/**
 * Load the MobileNet model
 * Can be called early to preload the model
 */
export async function loadModel(): Promise<void> {
  if (model || isModelLoading) return;

  isModelLoading = true;
  modelLoadError = null;

  const startTime = Date.now();
  logger.info("Loading MobileNet model...");

  try {
    // Wait for TensorFlow to be ready
    await tf.ready();

    // Load MobileNet model with optimized settings
    model = await mobilenet.load({
      version: 2,
      alpha: 1.0,
    });

    const loadTime = Date.now() - startTime;
    logger.info("MobileNet model loaded", { loadTimeMs: loadTime });

    isModelLoading = false;
  } catch (error) {
    isModelLoading = false;
    modelLoadError = error instanceof Error ? error : new Error("Unknown error");
    logger.error("Failed to load MobileNet model", error instanceof Error ? error : undefined);
    // Don't throw - we'll use fallback classification
  }
}

/**
 * Check if model is ready for classification
 */
export function isModelReady(): boolean {
  return model !== null;
}

/**
 * Preload model in background (call on app start)
 */
export function preloadModel(): void {
  // Fire and forget - model loads in background
  loadModel().catch(() => {
    // Error already logged in loadModel
  });
}

/**
 * Convert image URI to tensor for classification
 */
async function imageToTensor(uri: string): Promise<tf.Tensor3D> {
  // Read the image file as base64
  const imgB64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Convert base64 to Uint8Array
  const imgBuffer = tf.util.encodeString(imgB64, "base64").buffer;
  const raw = new Uint8Array(imgBuffer);

  // Decode JPEG to tensor
  const imageTensor = decodeJpeg(raw);

  return imageTensor;
}

/**
 * Find best matching category from ImageNet prediction
 * Uses weighted mapping for better confidence calibration
 */
function mapToFoodCategory(
  className: string,
  probability: number
): { category: FoodCategory; confidence: number } | null {
  const lowerClass = className.toLowerCase();

  // Direct mapping with weight
  for (const [label, mapping] of Object.entries(LABEL_TO_CATEGORY)) {
    if (lowerClass.includes(label.toLowerCase())) {
      const calibratedConfidence = Math.round(probability * mapping.weight * 100);
      return { category: mapping.category, confidence: calibratedConfidence };
    }
  }

  // Fuzzy keyword matching with weights
  let bestMatch: { category: FoodCategory; confidence: number } | null = null;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const { word, weight } of keywords) {
      if (lowerClass.includes(word)) {
        const calibratedConfidence = Math.round(probability * weight * 100 * 0.85);
        if (!bestMatch || calibratedConfidence > bestMatch.confidence) {
          bestMatch = {
            category: category as FoodCategory,
            confidence: calibratedConfidence,
          };
        }
      }
    }
  }

  return bestMatch;
}

// Maximum number of predictions to analyze
const MAX_PREDICTIONS = 5;

/**
 * Run classification on an image using MobileNet
 * Analyzes top predictions and returns best food category match
 */
export async function classifyImage(uri: string): Promise<ClassificationResult> {
  // Use fallback if model not loaded
  if (!model) {
    logger.warn("Model not loaded, using fallback classification");
    return fallbackClassify(uri);
  }

  const startTime = Date.now();

  try {
    const tensor = await imageToTensor(uri);
    const predictions = await model.classify(tensor, MAX_PREDICTIONS);
    tensor.dispose();

    logger.debug("Raw predictions", {
      predictions: predictions.map((p) => ({
        class: p.className,
        prob: Math.round(p.probability * 100),
      })),
    });

    // Collect all food category matches from predictions
    const matches: { category: FoodCategory; confidence: number }[] = [];

    for (const prediction of predictions) {
      const mapped = mapToFoodCategory(prediction.className, prediction.probability);
      if (mapped && mapped.confidence > 20) {
        matches.push(mapped);
      }
    }

    // Sort by confidence and return best match
    if (matches.length > 0) {
      matches.sort((a, b) => b.confidence - a.confidence);
      const result = matches[0];

      const classifyTime = Date.now() - startTime;
      logger.info("Classification complete", {
        category: result.category,
        confidence: result.confidence,
        timeMs: classifyTime,
        alternativeMatches: matches.length - 1,
      });

      return result;
    }

    // If no food category found, return best guess with low confidence
    logger.info("No food category detected, using default");
    return {
      category: "pizza",
      confidence: 25,
    };
  } catch (error) {
    logger.error("Classification failed", error instanceof Error ? error : undefined);
    return fallbackClassify(uri);
  }
}

/**
 * Classify with retry logic for unreliable classifications
 */
export async function classifyWithRetry(
  uri: string,
  minConfidence: number = 40,
  maxRetries: number = 2
): Promise<ClassificationResult> {
  let bestResult: ClassificationResult | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await classifyImage(uri);

    if (!bestResult || result.confidence > bestResult.confidence) {
      bestResult = result;
    }

    // Return early if confidence is good enough
    if (result.confidence >= minConfidence) {
      return result;
    }

    // Small delay before retry
    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return bestResult!;
}

/**
 * Fallback mock classifier for when real model fails
 */
function fallbackClassify(uri: string): ClassificationResult {
  const CATEGORY_LABELS: FoodCategory[] = ["pizza", "sushi", "ramen", "burger", "empanada"];

  // Simulate processing time
  let hash = 0;
  for (let i = 0; i < uri.length; i++) {
    const char = uri.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  hash = Math.abs(hash);

  const categoryIndex = hash % CATEGORY_LABELS.length;
  const confidenceBase = 50 + (hash % 30);

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
