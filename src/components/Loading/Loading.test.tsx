import { render } from "@testing-library/react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { describe, expect, Mock, test, vi } from "vitest";
import Loading from "./Loading";

const mockSession: Session = {
  user: {
    id: "1",
    name: "Test",
    email: "test@test.test",
    image: "https://testimages.org/img/testimages_screenshot.jpg",
  },
  expires: "1",
};

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  useSession: vi.fn(),
}));

describe("Loading", () => {
  (useSession as Mock).mockReturnValueOnce({
    data: mockSession,
    status: "authenticated",
  });
  const { container, rerender } = render(<Loading>Children</Loading>);

  test("Should match snapshot", () => {
    (useSession as Mock).mockReturnValueOnce({
      data: mockSession,
      status: "authenticated",
    });

    rerender(<Loading>Children</Loading>);
    expect(container).toMatchSnapshot("Children");
  });

  test("Should match snapshot when loading", () => {
    (useSession as Mock).mockReturnValueOnce({
      data: mockSession,
      status: "loading",
    });

    rerender(<Loading>Children</Loading>);

    expect(container).toMatchSnapshot("loading");
  });
});
