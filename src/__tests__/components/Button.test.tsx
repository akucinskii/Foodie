import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Button from "../../components/Button";

describe("Button", () => {
  const mockProp = {
    onClick: vi.fn(),
    children: "Test",
    disabled: false,
  };
  const { container, rerender, getByTestId } = render(<Button {...mockProp} />);

  test("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  test("should call onClick when clicked", () => {
    rerender(<Button {...mockProp} />);
    getByTestId("button").click();
    expect(mockProp.onClick).toHaveBeenCalled();
  });

  test("should be disabled when disabled is true", () => {
    rerender(<Button {...mockProp} disabled={true} />);
    expect(getByTestId("button").getAttribute("disabled")).toBeDefined();
  });

  test("should not be disabled when disabled is false", () => {
    rerender(<Button {...mockProp} disabled={false} />);
    expect(getByTestId("button").getAttribute("disabled")).toBeNull();
  });

  test("should have children", () => {
    rerender(<Button {...mockProp} />);
    expect(getByTestId("button").textContent).toBe("Test");
  });
});
