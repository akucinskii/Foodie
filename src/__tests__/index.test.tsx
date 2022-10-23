import { render, screen } from "@testing-library/react";
import Home from "../pages";
import { describe, it, expect } from "vitest";

describe("Home", () => {
  it("renders a heading", () => {
    render(<Home />);
    expect(screen.getByTestId("title-header").textContent).toEqual(
      "Welcome to solveMc App"
    );
  });
});
