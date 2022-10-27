import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "./Button";

const Navbar = () => {
  const [image, setImage] = useState<string>("");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user) {
      setImage(session.user.image || "");
    }
  }, [session]);

  return (
    <div className="align-center fixed z-20 flex w-full flex-row bg-white">
      <div className="flex-1">
        <ul className="menu menu-horizontal gap-4 p-2">
          <h1 className="text-4xl font-bold text-gray-700">
            Solve<span className="text-yellow-500">M</span>c
          </h1>

          <li>
            <Link href="/" className="whitespace-nowrap">
              Home
            </Link>
          </li>

          <li>
            <Link href="/all" className="whitespace-nowrap">
              All Orders
            </Link>
          </li>

          <li className="">
            <Link href="/Driver/newOrder" className="=whitespace-nowrap">
              New Order
            </Link>
          </li>
          <li className="">
            <Link href="/random/" className="=whitespace-nowrap">
              Randomize
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-0">
        <ul className="align-center menu menu-horizontal gap-2 p-2">
          {session ? (
            <>
              <Link
                data-testid="sign-out-button"
                href={`/Profile/${session.user?.id}`}
                legacyBehavior>
                <button className="btn btn-ghost btn-circle">
                  {session && session.user && session.user.image && (
                    <Image
                      data-testid="profile-image"
                      className="rounded-full"
                      src={image}
                      alt="text"
                      width={40}
                      height={40}
                    />
                  )}
                </button>
              </Link>
              <li>
                <Button
                  onClick={() => {
                    signOut();
                    router.push("/");
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
