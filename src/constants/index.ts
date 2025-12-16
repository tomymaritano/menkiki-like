// Re-export design tokens
export * from "./theme";
export * from "./icons";

// Food categories
export const FOOD_CATEGORIES = ["pizza", "sushi", "ramen", "burger", "empanada"] as const;

export const CATEGORY_KEYWORDS: Record<string, string> = {
  pizza: "pizza",
  sushi: "sushi",
  ramen: "ramen",
  burger: "hamburger",
  empanada: "empanadas",
};

export const CONFIDENCE_THRESHOLD = 0.6;

export const RESULTS_LIMIT = 10;
