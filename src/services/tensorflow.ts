import * as tf from "@tensorflow/tfjs";

let isInitialized = false;

export async function initializeTensorFlow(): Promise<void> {
  if (isInitialized) return;

  try {
    await tf.ready();
    isInitialized = true;
  } catch (error) {
    console.error("Failed to initialize TensorFlow.js:", error);
    throw error;
  }
}

export function isTensorFlowReady(): boolean {
  return isInitialized;
}
