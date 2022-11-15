import React from "react";

type Props = {
  children: React.ReactNode;
};
const Wrapper = ({ children }: Props) => {
  return (
    <div
      className="
    flex
    h-full
    w-full
    flex-col
    items-center
    justify-center
    pt-20
    
  "
    >
      {children}
    </div>
  );
};

export default Wrapper;
