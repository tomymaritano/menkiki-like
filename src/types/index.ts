export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  distance: string;
  priceLevel: string;
  address: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

export interface ClassificationResult {
  category: FoodCategory;
  confidence: number;
}

export type FoodCategory = "pizza" | "sushi" | "ramen" | "burger" | "empanada";

export interface Location {
  latitude: number;
  longitude: number;
}
