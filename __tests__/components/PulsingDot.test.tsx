/**
 * Tests for PulsingDot component
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { PulsingDot } from "../../src/components/PulsingDot";

describe("PulsingDot", () => {
  it("renders with default props", () => {
    const { toJSON } = render(<PulsingDot />);

    expect(toJSON()).toMatchSnapshot();
  });

  it("renders with custom size", () => {
    const { toJSON } = render(<PulsingDot size={20} />);

    expect(toJSON()).toMatchSnapshot();
  });

  it("renders with custom color", () => {
    const { toJSON } = render(<PulsingDot color="#ff0000" />);

    expect(toJSON()).toMatchSnapshot();
  });

  it("renders with custom size and color", () => {
    const { toJSON } = render(<PulsingDot size={24} color="#00ff00" />);

    expect(toJSON()).toMatchSnapshot();
  });
});
