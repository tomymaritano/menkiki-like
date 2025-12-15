/**
 * Tests for OfflineBanner component
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { OfflineBanner } from "../../src/components/OfflineBanner";

describe("OfflineBanner", () => {
  it("renders with default message", () => {
    const { toJSON, getByText } = render(<OfflineBanner />);

    expect(getByText("No internet connection")).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders with custom message", () => {
    const customMessage = "You are offline";
    const { toJSON, getByText } = render(<OfflineBanner message={customMessage} />);

    expect(getByText(customMessage)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders emoji icon", () => {
    const { getByText } = render(<OfflineBanner />);

    expect(getByText("📡")).toBeTruthy();
  });
});
