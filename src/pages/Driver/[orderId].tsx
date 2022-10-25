import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import Button from "../../components/Button";
import { getBaseUrl, trpc } from "../../utils/trpc";
import OrderSliceEdit from "../Client/edit/[orderSliceId]";
import { McListItemType } from "../Client/[orderId]";

const Panel = () => {
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const router = useRouter();
  const orderId = router.query.orderId as string;
  const order = trpc.order.getOrderDetails.useQuery({ id: orderId });
  const orderSlices = trpc.orderSlice.getOrderSlicesByOrderId.useQuery({
    id: orderId,
  });
  const authors = trpc.order.getAccumulatedPriceByAuthor.useQuery({
    id: orderId,
  });

  if (
    order.isFetching ||
    orderSlices.isFetching ||
    authors.isFetching ||
    orderSlices.isRefetching
  ) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  const renderOrder = order.data?.map((item: McListItemType) => {
    return (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td className="text-right">{item.quantity}</td>
      </tr>
    );
  });

  const renderOrderSlices = orderSlices.data?.map((slice) => {
    const items = slice.details.map((item: McListItemType) => {
      return (
        <tr key={item.id}>
          <td>{item.name}</td>
          <td className="text-right">{item.quantity}</td>
        </tr>
      );
    });

    return (
      <Link
        key={slice.id}
        href={
          slice.authorId === session?.user?.id
            ? `/Client/edit/${slice.id}`
            : `#`
        }
      >
        <div>
          <h3 className="text-center">{slice.author.name}</h3>
          {slice.authorId === session?.user?.id && (
            <p className="text-center font-bold text-yellow-500">
              Click to edit
            </p>
          )}
          <table className="table-zebra table w-full">
            <thead>
              <tr>
                <th>Item</th>
                <th className="text-right">Quantity</th>
              </tr>
            </thead>
            <tbody>{items}</tbody>
          </table>
        </div>
      </Link>
    );
  });

  return (
    <div className="flex min-w-full flex-col gap-4 md:min-w-[50%]">
      <h1 className="text-center text-2xl font-bold">Driver panel</h1>
      <h2 className="text-center text-xl font-bold">Order items</h2>
      <div className="overflow-x-auto">
        <table className="table-zebra table w-full">
          <thead>
            <tr>
              <th>Item</th>
              <th className="text-right">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {renderOrder}
            <tr>
              <td className="font-bold ">Total</td>
              <td className="text-right font-bold text-yellow-500">
                {order.data?.reduce(
                  (acc: number, item: { price: number; quantity: number }) =>
                    acc + item.price * item.quantity,
                  0
                )}
                pln
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Link href={`/Client/${orderId}`}>
        <Button
          disabled={
            !session?.user ||
            !!orderSlices.data?.find((el) => el.authorId == session.user?.id)
          }
        >
          Add your products <br /> to this order!
        </Button>
      </Link>
      {!session?.user && (
        <p className="text-center text-red-600">
          You need to be logged in to add your Products
        </p>
      )}
      <h2 className="text-center text-xl font-bold">Who pays how much?</h2>
      <div className="flex flex-col gap-4">
        <div className="overflow-x-auto">
          <table className="table-zebra table w-full">
            <thead>
              <tr>
                <th>Author</th>
                <th className="text-right">Fee</th>
              </tr>
            </thead>
            <tbody>
              {authors.data &&
                Object.keys(authors.data).map((author) => {
                  return (
                    <tr key={author}>
                      <td>{author}</td>
                      <td className="text-right">
                        {authors.data && authors.data[author]}pln
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="h-px flex-grow bg-gray-200"></div>
      {renderOrderSlices}
    </div>
  );
};

export default Panel;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    const baseUrl = getBaseUrl();
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${baseUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
