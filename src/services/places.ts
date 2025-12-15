import { CATEGORY_KEYWORDS, RESULTS_LIMIT } from "../constants";
import type { Restaurant, Location } from "../types";

// Google Places API configuration
// Note: In production, use environment variables and API key restrictions
const PLACES_API_BASE = "https://maps.googleapis.com/maps/api/place";

// For demo purposes, we'll use mock data
// To use real API, set your API key here or via environment variable
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || "";

interface PlacesSearchResult {
  place_id: string;
  name: string;
  rating?: number;
  price_level?: number;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_phone_number?: string;
}

interface PlacesSearchResponse {
  results: PlacesSearchResult[];
  status: string;
  error_message?: string;
}

/**
 * Calculate distance between two coordinates in kilometers
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format distance for display
 */
function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Format price level for display
 */
function formatPriceLevel(level?: number): string {
  if (level === undefined || level === 0) return "$";
  return "$".repeat(level);
}

/**
 * Calculate ranking score
 * Higher is better
 */
function calculateScore(rating: number, distanceKm: number): number {
  // Normalize rating (0-5) and distance factor
  const ratingScore = (rating || 3) / 5; // Default to 3 if no rating
  const proximityScore = Math.max(0, 1 - distanceKm / 5); // 5km max

  // Weighted combination: 60% rating, 40% proximity
  return ratingScore * 0.6 + proximityScore * 0.4;
}

/**
 * Search for nearby restaurants using Google Places API
 */
export async function searchNearbyRestaurants(
  location: Location,
  category: string
): Promise<Restaurant[]> {
  // Get search keyword for category
  const keyword = CATEGORY_KEYWORDS[category.toLowerCase()] || category.toLowerCase();

  // If no API key, return mock data
  if (!API_KEY) {
    return getMockRestaurants(category);
  }

  try {
    const url = new URL(`${PLACES_API_BASE}/nearbysearch/json`);
    url.searchParams.append("location", `${location.latitude},${location.longitude}`);
    url.searchParams.append("radius", "3000"); // 3km radius
    url.searchParams.append("type", "restaurant");
    url.searchParams.append("keyword", keyword);
    url.searchParams.append("key", API_KEY);

    const response = await fetch(url.toString());
    const data: PlacesSearchResponse = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Places API error:", data.status, data.error_message);
      return getMockRestaurants(location, category);
    }

    // Transform and rank results
    const restaurants: Restaurant[] = data.results.map((place) => {
      const distanceKm = calculateDistance(
        location.latitude,
        location.longitude,
        place.geometry.location.lat,
        place.geometry.location.lng
      );

      return {
        id: place.place_id,
        name: place.name,
        rating: place.rating || 0,
        distance: formatDistance(distanceKm),
        priceLevel: formatPriceLevel(place.price_level),
        address: place.vicinity,
        phone: place.formatted_phone_number,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        _distanceKm: distanceKm,
        _score: calculateScore(place.rating || 0, distanceKm),
      } as Restaurant & { _distanceKm: number; _score: number };
    });

    // Sort by score and limit results
    interface ScoredRestaurant extends Restaurant {
      _distanceKm: number;
      _score: number;
    }
    return (restaurants as ScoredRestaurant[])
      .sort((a, b) => b._score - a._score)
      .slice(0, RESULTS_LIMIT)
      .map(({ _distanceKm, _score, ...rest }) => rest);
  } catch (error) {
    console.error("Failed to fetch places:", error);
    return getMockRestaurants(category);
  }
}

/**
 * Get mock restaurants for demo/development
 */
function getMockRestaurants(category: string): Restaurant[] {
  const mockData: Record<string, Restaurant[]> = {
    pizza: [
      {
        id: "1",
        name: "Pizzeria Güerrin",
        rating: 4.5,
        distance: "0.3 km",
        priceLevel: "$$",
        address: "Av. Corrientes 1368",
      },
      {
        id: "2",
        name: "El Cuartito",
        rating: 4.3,
        distance: "0.7 km",
        priceLevel: "$$",
        address: "Talcahuano 937",
      },
      {
        id: "3",
        name: "La Mezzetta",
        rating: 4.4,
        distance: "1.2 km",
        priceLevel: "$$",
        address: "Av. Álvarez Thomas 1321",
      },
      {
        id: "4",
        name: "Banchero",
        rating: 4.2,
        distance: "1.5 km",
        priceLevel: "$",
        address: "Av. Corrientes 1300",
      },
      {
        id: "5",
        name: "Las Cuartetas",
        rating: 4.1,
        distance: "0.4 km",
        priceLevel: "$$",
        address: "Av. Corrientes 838",
      },
    ],
    sushi: [
      {
        id: "1",
        name: "Osaka",
        rating: 4.6,
        distance: "0.5 km",
        priceLevel: "$$$",
        address: "Soler 5608",
      },
      {
        id: "2",
        name: "Sushi Pop",
        rating: 4.4,
        distance: "0.8 km",
        priceLevel: "$$",
        address: "Costa Rica 4681",
      },
      {
        id: "3",
        name: "Green Bamboo",
        rating: 4.3,
        distance: "1.0 km",
        priceLevel: "$$",
        address: "Costa Rica 5802",
      },
      {
        id: "4",
        name: "Dashi",
        rating: 4.5,
        distance: "1.3 km",
        priceLevel: "$$$",
        address: "Thames 1747",
      },
    ],
    ramen: [
      {
        id: "1",
        name: "Fukuro Noodle Bar",
        rating: 4.7,
        distance: "0.4 km",
        priceLevel: "$$",
        address: "Costa Rica 5514",
      },
      {
        id: "2",
        name: "Ramen House",
        rating: 4.2,
        distance: "1.1 km",
        priceLevel: "$$",
        address: "Thames 1810",
      },
      {
        id: "3",
        name: "Ichisou",
        rating: 4.4,
        distance: "0.9 km",
        priceLevel: "$$",
        address: "Gurruchaga 1587",
      },
    ],
    burger: [
      {
        id: "1",
        name: "Burger Joint",
        rating: 4.5,
        distance: "0.3 km",
        priceLevel: "$$",
        address: "J. L. Borges 1766",
      },
      {
        id: "2",
        name: "Deniro",
        rating: 4.4,
        distance: "0.6 km",
        priceLevel: "$$",
        address: "Godoy Cruz 1823",
      },
      {
        id: "3",
        name: "Dellepiane",
        rating: 4.3,
        distance: "0.9 km",
        priceLevel: "$$",
        address: "Av. Libertador 4791",
      },
      {
        id: "4",
        name: "Williamsburg",
        rating: 4.2,
        distance: "1.2 km",
        priceLevel: "$$",
        address: "Humboldt 1550",
      },
    ],
    empanada: [
      {
        id: "1",
        name: "El Sanjuanino",
        rating: 4.4,
        distance: "0.2 km",
        priceLevel: "$",
        address: "Posadas 1515",
      },
      {
        id: "2",
        name: "La Cocina",
        rating: 4.3,
        distance: "0.5 km",
        priceLevel: "$",
        address: "Pueyrredón 1508",
      },
      {
        id: "3",
        name: "El Noble",
        rating: 4.0,
        distance: "0.8 km",
        priceLevel: "$",
        address: "Av. Santa Fe 1234",
      },
      {
        id: "4",
        name: "La Continental",
        rating: 4.1,
        distance: "0.6 km",
        priceLevel: "$",
        address: "Av. Callao 1302",
      },
    ],
  };

  const key = category.toLowerCase();
  return mockData[key] || mockData.pizza;
}
