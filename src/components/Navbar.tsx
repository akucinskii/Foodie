import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-700">Solve MC</h1>
      <Link href="/Client">
        <a className="underline">Client</a>
      </Link>
      <Link href="/Driver">
        <a className="underline">Driver</a>
      </Link>
    </div>
  );
};

export default Navbar;
