import Link from "next/link";
import React from "react";
import Button from "../../Button";

const MainPageHero = () => {
  return (
    <div className="hero z-10 min-h-[50%]">
      <div className="hero-content text-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold" data-testid="title-header">
            Welcome to solve<span className="text-yellow-500">M</span>c App
          </h1>
          <p className="mt-5 text-xl italic">
            We make ordering food with friends easier, faster and more fun!
          </p>
          <div className="mt-5">
            <Link href="/all">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPageHero;
