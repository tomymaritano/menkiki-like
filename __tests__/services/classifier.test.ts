/**
 * Tests for classifier service
 * Tests the label mapping and utility functions
 */

import {
  isConfident,
  getCategoryDisplayName,
  getModelStatus,
  isModelReady,
} from "../../src/services/classifier";
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
      // CONFIDENCE_THRESHOLD is 0.6 (60%)
      const atThreshold: ClassificationResult = { category: "pizza", confidence: 60 };
      const belowThreshold: ClassificationResult = { category: "pizza", confidence: 59 };

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

  describe("getModelStatus", () => {
    it("should return idle when model not loaded", () => {
      // Model starts in idle state
      expect(getModelStatus()).toBe("idle");
    });
  });

  describe("isModelReady", () => {
    it("should return false when model not loaded", () => {
      expect(isModelReady()).toBe(false);
    });
  });
});
