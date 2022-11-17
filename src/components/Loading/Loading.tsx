import { useSession } from "next-auth/react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Loading = ({ children }: Props) => {
  const session = useSession();

  return !(session.status === "loading") ? (
    <>{children}</>
  ) : (
    <div
      className="
    flex
    h-full
    w-full
    flex-col
    items-center
    justify-center
    pt-20
    text-2xl
    "
    >
      Loading...
    </div>
  );
};

export default Loading;
