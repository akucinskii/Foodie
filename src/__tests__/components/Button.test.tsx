import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Button from "../../components/Button";

describe("Button", () => {
  const mockProp = {
    onClick: vi.fn(),
    children: "Test",
    disabled: false,
  };

  it("should match snapshot", () => {
    render(<Button {...mockProp} />);
    expect(screen.getByRole("button")).toMatchSnapshot();
  });
});
