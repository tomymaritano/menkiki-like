import { useState, useEffect, useCallback } from "react";
import { initializeTensorFlow } from "../services/tensorflow";
import {
  classifyImage,
  loadModel,
  isConfident,
  getCategoryDisplayName,
} from "../services/classifier";
import type { ClassificationResult } from "../types";

interface UseClassifierState {
  isReady: boolean;
  isClassifying: boolean;
  result: ClassificationResult | null;
  displayName: string | null;
  isLowConfidence: boolean;
  error: string | null;
}

interface UseClassifierReturn extends UseClassifierState {
  classify: (imageUri: string) => Promise<void>;
  reset: () => void;
}

export function useClassifier(): UseClassifierReturn {
  const [state, setState] = useState<UseClassifierState>({
    isReady: false,
    isClassifying: false,
    result: null,
    displayName: null,
    isLowConfidence: false,
    error: null,
  });

  // Initialize TensorFlow and load model on mount
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        await initializeTensorFlow();
        await loadModel();
        if (mounted) {
          setState((prev) => ({ ...prev, isReady: true }));
        }
      } catch (error) {
        console.error("Failed to initialize classifier:", error);
        if (mounted) {
          setState((prev) => ({
            ...prev,
            error: "Failed to initialize AI model",
          }));
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  const classify = useCallback(async (imageUri: string) => {
    setState((prev) => ({
      ...prev,
      isClassifying: true,
      error: null,
      result: null,
    }));

    try {
      const result = await classifyImage(imageUri);
      const lowConfidence = !isConfident(result);

      setState((prev) => ({
        ...prev,
        isClassifying: false,
        result,
        displayName: getCategoryDisplayName(result.category),
        isLowConfidence: lowConfidence,
      }));
    } catch (error) {
      console.error("Classification error:", error);
      setState((prev) => ({
        ...prev,
        isClassifying: false,
        error: "Failed to classify image",
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      result: null,
      displayName: null,
      isLowConfidence: false,
      error: null,
    }));
  }, []);

  return {
    ...state,
    classify,
    reset,
  };
}
