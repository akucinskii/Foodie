import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="align-center fixed z-20 flex w-full flex-col bg-white">
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold text-gray-700">
          Solve<span className="text-yellow-500">M</span>c
        </h1>
      </div>
      <div className="font-heading mx-auto flex justify-center gap-5 px-4 font-semibold">
        <Link href="/">
          <a className="whitespace-nowrap hover:text-yellow-500 ">Home</a>
        </Link>

        <Link href="/all">
          <a className="whitespace-nowrap hover:text-yellow-500">All Orders</a>
        </Link>

        <Link href="/Driver/newOrder">
          <a className="=whitespace-nowrap hover:text-yellow-500">New Order</a>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
