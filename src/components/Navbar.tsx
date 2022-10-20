import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { router } from "../server/trpc/trpc";
import Button from "./Button";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="align-center fixed z-20 flex w-full flex-row bg-white">
      <div className="flex-1">
        <ul className="menu menu-horizontal gap-4 p-2">
          <h1 className="text-4xl font-bold text-gray-700">
            Solve<span className="text-yellow-500">M</span>c
          </h1>

          <li>
            <Link href="/">
              <a className="whitespace-nowrap">Home</a>
            </Link>
          </li>

          <li>
            <Link href="/all">
              <a className="whitespace-nowrap">All Orders</a>
            </Link>
          </li>

          <li className="">
            <Link href="/Driver/newOrder">
              <a className="=whitespace-nowrap">New Order</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-0">
        <ul className="align-center menu menu-horizontal gap-2 p-2">
          {session ? (
            <>
              <button
                onClick={() => router.push(`/Profile/${session.user?.id}`)}
                className="btn btn-ghost btn-circle"
              >
                {session && session.user && session.user.image && (
                  <Image
                    className="rounded-full"
                    src={session?.user?.image}
                    alt="text"
                    width={40}
                    height={40}
                  />
                )}
              </button>
              <li>
                <Button
                  onClick={() => {
                    router.push("/");
                    signOut();
                  }}
                >
                  Sign out
                </Button>
              </li>
            </>
          ) : (
            <Button
              onClick={() => {
                signIn();
              }}
            >
              Sign in
            </Button>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
