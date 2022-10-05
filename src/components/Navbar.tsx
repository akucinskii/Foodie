import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-700">Solve MC</h1>
      <Link href="/">
        <a className="underline">Home</a>
      </Link>
      <span> </span>
      <Link href="/all">
        <a className="underline">All</a>
      </Link>
      <span> </span>
      <Link href="/Order/newOrder">
        <a className="underline">New Order</a>
      </Link>
      <span> </span>
    </div>
  );
};

export default Navbar;
