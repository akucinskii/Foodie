import React from "react";

type Props = {
  onClick?: () => void;
  color?: string;
  children: React.ReactNode;
};

const Button = ({ onClick, children }: Props) => {
  return (
    <button
      type="button"
      className={`sm:text:sm md:text-md inline-block rounded bg-yellow-500 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-yellow-600 hover:shadow-lg focus:bg-yellow-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-700 active:shadow-lg`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
