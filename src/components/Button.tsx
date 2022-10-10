import React from "react";

type Props = {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
};

const Button = ({ onClick, children, disabled }: Props) => {
  return (
    <button
      type="button"
      className={`btn btn-primary text-white`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
