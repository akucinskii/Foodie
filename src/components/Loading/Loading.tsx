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
    <div>Loading...</div>
  );
};

export default Loading;
