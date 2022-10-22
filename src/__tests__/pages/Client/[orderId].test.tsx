import { render } from "@testing-library/react";
import { Session } from "next-auth";
import { describe, expect, it, vi, Mock } from "vitest";
import { signIn, signOut, useSession } from "next-auth/react";
import Client from "../../../pages/Client/[orderId]";
vi.mock("../../../utils/trpc", () => ({
  trpc: {
    useContext: () => ({}),
    order: {
      invalidate: vi.fn(),
      createOrderSlice: {
        useMutation: () => [vi.fn(), { isLoading: false }],
      },
    },
  },
  useQuery: () => ({
    data: {
      id: "1",
      name: "Test",
      email: "test",
    },
  }),
}));
vi.mock("next-auth/react");
vi.mock("next/router", () => ({
  useRouter: vi.fn(() => ({
    query: {
      orderId: "1",
    },
  })),
}));
describe("Navbar", () => {
  const mockUseSession = useSession as Mock;
  (signIn as Mock).mockImplementation(() => vi.fn());
  (signOut as Mock).mockImplementation(() => vi.fn());

  const renderComponent = () => {
    return render(<Client />);
  };

  const mockSession: Session = {
    user: {
      id: "1",
      name: "Test",
      email: "test@test.test",
      image: "/test",
    },
    expires: "1",
  };

  it("should match snapshot", () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: "unauthenticated",
    });

    const { container } = renderComponent();

    expect(container).toMatchSnapshot("logout");
  });
});
