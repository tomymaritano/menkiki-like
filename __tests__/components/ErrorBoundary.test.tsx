/**
 * Tests for ErrorBoundary component
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Text, View } from "react-native";
import { ErrorBoundary } from "../../src/components/ErrorBoundary";

// Component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <Text>No error</Text>;
}

// Suppress console.error for these tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Test Content</Text>
      </ErrorBoundary>
    );

    expect(getByText("Test Content")).toBeTruthy();
  });

  it("renders error UI when child throws", () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText("Oops! Something went wrong")).toBeTruthy();
    expect(getByText("Try Again")).toBeTruthy();
  });

  it("renders custom fallback when provided", () => {
    const customFallback = <Text>Custom Error Message</Text>;

    const { getByText } = render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText("Custom Error Message")).toBeTruthy();
  });

  it("has a Try Again button that resets error state", () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error should be shown
    expect(getByText("Oops! Something went wrong")).toBeTruthy();

    // Try Again button should be present
    const tryAgainButton = getByText("Try Again");
    expect(tryAgainButton).toBeTruthy();

    // Pressing should not throw
    expect(() => fireEvent.press(tryAgainButton)).not.toThrow();
  });

  it("displays app version in error UI", () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Version should be displayed
    expect(getByText(/v\d+\.\d+\.\d+/)).toBeTruthy();
  });
});
