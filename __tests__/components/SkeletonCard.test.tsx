/**
 * Tests for SkeletonCard and SkeletonList components
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { SkeletonCard, SkeletonList } from "../../src/components/SkeletonCard";

describe("SkeletonCard", () => {
  it("renders with default props", () => {
    const { toJSON } = render(<SkeletonCard />);

    expect(toJSON()).toMatchSnapshot();
  });

  it("renders with custom delay", () => {
    const { toJSON } = render(<SkeletonCard delay={200} />);

    expect(toJSON()).toMatchSnapshot();
  });
});

describe("SkeletonList", () => {
  it("renders multiple skeleton cards", () => {
    const { toJSON } = render(<SkeletonList />);

    expect(toJSON()).toMatchSnapshot();
  });
});
