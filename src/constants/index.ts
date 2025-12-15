export const FOOD_CATEGORIES = [
  "pizza",
  "sushi",
  "ramen",
  "burger",
  "empanada",
] as const;

export const CATEGORY_KEYWORDS: Record<string, string> = {
  pizza: "pizza",
  sushi: "sushi",
  ramen: "ramen",
  burger: "hamburger",
  empanada: "empanadas",
};

export const CONFIDENCE_THRESHOLD = 0.6;

export const RESULTS_LIMIT = 10;

export const COLORS = {
  background: "#000",
  surface: "#1a1a1a",
  primary: "#fff",
  secondary: "#888",
  success: "#4ade80",
  warning: "#fbbf24",
  error: "#ef4444",
};
