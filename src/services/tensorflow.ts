import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

let isInitialized = false;

export async function initializeTensorFlow(): Promise<void> {
  if (isInitialized) return;

  try {
    await tf.ready();
    isInitialized = true;
    console.log("TensorFlow.js initialized successfully");
    console.log("Backend:", tf.getBackend());
  } catch (error) {
    console.error("Failed to initialize TensorFlow.js:", error);
    throw error;
  }
}

export function isTensorFlowReady(): boolean {
  return isInitialized;
}
