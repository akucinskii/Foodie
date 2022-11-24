import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Button from "../../Button/Button";

const MainPageHero = () => {
  const { data: session } = useSession();

  return (
    <div
      className=" hero z-10 min-h-screen w-full bg-gradient-to-br
    from-secondary to-primary"
    >
      <div className="hero-content col-start-1 row-start-1 w-full max-w-7xl flex-col justify-between gap-10 pb-40 text-center lg:gap-0 xl:gap-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold" data-testid="title-header">
            Welcome to solve
            <span className="font-extrabold text-yellow-500">M</span>c
          </h1>
          <p className="font-title mt-5 text-xl italic">
            We make ordering food with friends easier, faster and more fun!
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Link href="/restaurant/restaurants">
              <button
                data-testid="link-to-all"
                className="
                btn
              btn-active
              btn-ghost
              text-white
              lg:btn-lg
              "
              >
                See all restaurants
              </button>
            </Link>
            {!session && (
              <Button
                data-testid="signin-button"
                className="
            btn
            btn-primary
            text-white
            lg:btn-lg
            "
                onClick={() => {
                  signIn();
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPageHero;
