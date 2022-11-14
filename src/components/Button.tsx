import React from "react";

type Props = {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

const Button = ({ onClick, children, disabled, className }: Props) => {
  return (
    <button
      type="button"
      data-testid="button"
      className={className ? className : `btn btn-primary text-white`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
