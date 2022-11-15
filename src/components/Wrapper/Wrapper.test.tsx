import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Wrapper from "./Wrapper";

describe("Wrapper", () => {
  const { container, rerender } = render(<Wrapper>Test</Wrapper>);

  test("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  test("should have children", () => {
    rerender(<Wrapper>Test2</Wrapper>);
    expect(container.textContent).toBe("Test2");
  });
});
