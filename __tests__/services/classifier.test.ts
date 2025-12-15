/**
 * Tests for classifier service
 * Tests the label mapping and utility functions
 */

import { isConfident, getCategoryDisplayName } from "../../src/services/classifier";
import type { ClassificationResult } from "../../src/types";

describe("Classifier Service", () => {
  describe("isConfident", () => {
    it("should return true for high confidence", () => {
      const result: ClassificationResult = { category: "pizza", confidence: 85 };
      expect(isConfident(result)).toBe(true);
    });

    it("should return false for low confidence", () => {
      const result: ClassificationResult = { category: "pizza", confidence: 50 };
      expect(isConfident(result)).toBe(false);
    });

    it("should handle boundary case at threshold", () => {
      // CONFIDENCE_THRESHOLD is 0.7 (70%)
      const atThreshold: ClassificationResult = { category: "pizza", confidence: 70 };
      const belowThreshold: ClassificationResult = { category: "pizza", confidence: 69 };

      expect(isConfident(atThreshold)).toBe(true);
      expect(isConfident(belowThreshold)).toBe(false);
    });
  });

  describe("getCategoryDisplayName", () => {
    it("should return correct display name for pizza", () => {
      expect(getCategoryDisplayName("pizza")).toBe("Pizza");
    });

    it("should return correct display name for sushi", () => {
      expect(getCategoryDisplayName("sushi")).toBe("Sushi");
    });

    it("should return correct display name for ramen", () => {
      expect(getCategoryDisplayName("ramen")).toBe("Ramen");
    });

    it("should return correct display name for burger", () => {
      expect(getCategoryDisplayName("burger")).toBe("Burger");
    });

    it("should return correct display name for empanada", () => {
      expect(getCategoryDisplayName("empanada")).toBe("Empanada");
    });
  });
});
