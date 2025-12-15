/**
 * Tests for FadeIn component
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { FadeIn } from "../../src/components/FadeIn";

describe("FadeIn", () => {
  it("renders children correctly", () => {
    const { toJSON, getByText } = render(
      <FadeIn>
        <Text>Test Content</Text>
      </FadeIn>
    );

    expect(getByText("Test Content")).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders with custom delay", () => {
    const { toJSON } = render(
      <FadeIn delay={500}>
        <Text>Delayed Content</Text>
      </FadeIn>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it("renders with custom duration", () => {
    const { toJSON } = render(
      <FadeIn duration={1000}>
        <Text>Slow Fade Content</Text>
      </FadeIn>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it("renders with custom style", () => {
    const { toJSON } = render(
      <FadeIn style={{ padding: 20 }}>
        <Text>Styled Content</Text>
      </FadeIn>
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
