import React from "react";

type Props = {
  onClick: () => void;
  color?: string;
  children: React.ReactNode;
};

const Button = ({ onClick, color, children }: Props) => {
  return (
    <button
      type="button"
      className={`inline-block rounded bg-${
        color ?? "blue"
      }-600 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-${
        color ?? "blue"
      }-700 hover:shadow-lg focus:bg-${
        color ?? "blue"
      }-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-${
        color ?? "blue"
      }-800 active:shadow-lg`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
