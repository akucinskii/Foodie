import { fireEvent, getByTestId, render } from "@testing-library/react";
import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";

import { afterAll, describe, expect, Mock, test, vi } from "vitest";

import MainPageHero from "./MainPageHero";

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

vi.mock("next/router", () => ({
  useRouter: vi.fn(() => ({
    router: {
      push: vi.fn(),
    },
  })),
}));

describe("Button", () => {
  (signIn as Mock).mockImplementation(() => vi.fn());
  (signOut as Mock).mockImplementation(() => vi.fn());

  (useSession as Mock).mockReturnValue({
    data: mockSession,
    status: "authenticated",
  });

  const { container, rerender } = render(<MainPageHero />);

  test("should match snapshot", () => {
    (useSession as Mock).mockReturnValue({
      data: mockSession,
      status: "authenticated",
    });
    expect(container).toMatchSnapshot();
  });

  test("should match snapshot when logout", () => {
    (useSession as Mock).mockReturnValue({
      data: mockSession,
      status: "authenticated",
    });

    rerender(<MainPageHero />);
    expect(container).toMatchSnapshot("logout");
  });

  test("Should render sign in button", () => {
    (useSession as Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
    rerender(<MainPageHero />);
    expect(container);
  });

  test("should call signIn when click on login button", async () => {
    (useSession as Mock).mockImplementation(() => ({
      data: null,
      status: "unauthenticated",
    }));

    rerender(<MainPageHero />);

    fireEvent.click(getByTestId(container, "button"));

    expect(signIn).toHaveBeenCalled();
  });

  afterAll(() => {
    (signIn as Mock).mockRestore();
    (signOut as Mock).mockRestore();
    (useSession as Mock).mockRestore();
  });
});
