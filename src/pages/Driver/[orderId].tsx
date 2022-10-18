import { OrderSlice } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "../../components/Button";
import { trpc } from "../../utils/trpc";
import { McListItemType, McListType } from "../Client/[orderId]";

const Panel = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const orderId = router.query.orderId as string;

  const order = trpc.order.getOrderDetails.useQuery({ id: orderId });
  const orderSlices = trpc.order.getOrderSlicesByOrderId.useQuery({
    id: orderId,
  });
  const authors = trpc.order.getOrderSlicesAuthors.useQuery({ id: orderId });

  const renderOrder = order.data?.map((item: McListItemType) => {
    return (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td className="text-right">{item.quantity}</td>
      </tr>
    );
  });

  const renderOrderSlices = orderSlices.data?.map((slice: OrderSlice) => {
    const details: McListType = JSON.parse(slice.details);

    const items = details.map((item: McListItemType) => {
      return (
        <tr key={item.id}>
          <td>{item.name}</td>
          <td className="text-right">{item.quantity}</td>
        </tr>
      );
    });

    return (
      <div key={slice.id}>
        <h3 className="text-center">{slice.author}</h3>
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
    );
  });

  return order.data ? (
    <div className="flex flex-col gap-4">
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
      <Button
        disabled={!session?.user}
        onClick={() => {
          router.push(`/Client/${orderId}`);
        }}
      >
        Add your products <br /> to this order!
      </Button>
      {!session?.user && (
        <p className="text-center text-red-600">
          You need to be logged in to add your Products
        </p>
      )}

      <p>
        If you dont see your products, just refresh (I still havent fixed it).
      </p>

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
  ) : (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-2xl font-bold">Loading...</h1>
    </div>
  );
};

export default Panel;
