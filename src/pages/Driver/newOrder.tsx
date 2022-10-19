import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Button from "../../components/Button";
import { useSubmitOrder } from "../../hooks/useSubmitOrder";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { getBaseUrl } from "../../utils/trpc";

const Driver = () => {
  const { data: session } = useSession();

  const [name, setName] = React.useState<string>("");
  const [author, setAuthor] = React.useState<string>(session?.user?.name || "");
  const router = useRouter();

  useEffect(() => {
    if (session && session.user && session.user.name) {
      setAuthor(session.user.id);
    }
    console.log(author);
  }, [session]);
  const submitOrder = useSubmitOrder();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-xl font-bold">Create new order</h1>
      <div>
        <label className="label">
          <span className="label-text">Enter your order name</span>
        </label>
        <input
          className="input input-bordered w-full"
          type="text"
          id="name"
          required
          placeholder="Order name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* <label className="label">
          <span className="label-text">Enter your order name</span>
        </label>
        <input
          className="input input-bordered w-full"
          type="text"
          required
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        /> */}
      </div>

      <Button
        disabled={
          name === "" || author === "" || name.length > 20 || !session?.user
        }
        onClick={async () => {
          const order = await submitOrder(name, author);

          if (order) {
            router.push(`/Client/${order.id}`);
          }
        }}
      >
        NEW ORDER LIST
      </Button>
      {!session?.user && (
        <p className="text-center text-red-600">
          You need to be logged in to create new order list
        </p>
      )}
    </div>
  );
};

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//   const session = await getServerAuthSession(ctx);

//   if (!session) {
//     const baseUrl = getBaseUrl();
//     return {
//       redirect: {
//         destination: `/api/auth/signin?callbackUrl=${baseUrl}`,
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       session,
//     },
//   };
// };

export default Driver;
