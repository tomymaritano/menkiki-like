/**
 * Tests for places service utility functions
 * Note: API calls are mocked, we test the data transformation logic
 */

import { searchNearbyRestaurants } from "../../src/services/places";
import type { Location } from "../../src/types";

// Mock fetch
global.fetch = jest.fn();

describe("Places Service", () => {
  const mockLocation: Location = {
    latitude: -34.6037,
    longitude: -58.3816,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("searchNearbyRestaurants", () => {
    it("should return mock data when no API key is set", async () => {
      // Without API key, should return mock data
      const results = await searchNearbyRestaurants(mockLocation, "pizza");

      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty("id");
      expect(results[0]).toHaveProperty("name");
      expect(results[0]).toHaveProperty("rating");
      expect(results[0]).toHaveProperty("distance");
      expect(results[0]).toHaveProperty("priceLevel");
      expect(results[0]).toHaveProperty("address");
    });

    it("should return mock data for different categories", async () => {
      const pizzaResults = await searchNearbyRestaurants(mockLocation, "pizza");
      const sushiResults = await searchNearbyRestaurants(mockLocation, "sushi");
      const burgerResults = await searchNearbyRestaurants(mockLocation, "burger");

      expect(pizzaResults.length).toBeGreaterThan(0);
      expect(sushiResults.length).toBeGreaterThan(0);
      expect(burgerResults.length).toBeGreaterThan(0);

      // Should have different restaurants for different categories
      expect(pizzaResults[0].name).not.toBe(sushiResults[0].name);
    });

    it("should return mock pizza data for unknown category", async () => {
      const results = await searchNearbyRestaurants(mockLocation, "unknown_food");

      // Falls back to pizza mock data
      expect(results.length).toBeGreaterThan(0);
    });

    it("should handle case-insensitive category", async () => {
      const lowerResults = await searchNearbyRestaurants(mockLocation, "pizza");
      const upperResults = await searchNearbyRestaurants(mockLocation, "PIZZA");
      const mixedResults = await searchNearbyRestaurants(mockLocation, "Pizza");

      expect(lowerResults).toEqual(upperResults);
      expect(lowerResults).toEqual(mixedResults);
    });
  });

  describe("mock data structure", () => {
    it("should have valid rating values", async () => {
      const results = await searchNearbyRestaurants(mockLocation, "pizza");

      results.forEach((restaurant) => {
        expect(restaurant.rating).toBeGreaterThanOrEqual(0);
        expect(restaurant.rating).toBeLessThanOrEqual(5);
      });
    });

    it("should have valid distance format", async () => {
      const results = await searchNearbyRestaurants(mockLocation, "pizza");

      results.forEach((restaurant) => {
        expect(restaurant.distance).toMatch(/\d+(\.\d+)?\s*(m|km)/);
      });
    });

    it("should have valid price level format", async () => {
      const results = await searchNearbyRestaurants(mockLocation, "pizza");

      results.forEach((restaurant) => {
        expect(restaurant.priceLevel).toMatch(/^\$+$/);
      });
    });
  });
});
