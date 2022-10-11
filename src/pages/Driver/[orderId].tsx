import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Button from "../../components/Button";
import { trpc } from "../../utils/trpc";
import { McListItemType, McListType } from "../Client/[orderId]";

const Panel = () => {
  const [orderDetails, setOrderDetails] = React.useState<McListType>([]);
  const [authorList, setAuthorList] = React.useState<{
    [key: string]: number;
  }>({});
  const router = useRouter();
  const orderId = router.query.orderId as string;

  const order = trpc.useQuery(["order.getOrderDetails", { id: orderId }]);
  const orderSlices = trpc.useQuery([
    "order.getOrderSlicesByOrderId",
    { id: orderId },
  ]);
  const authors = trpc.useQuery([
    "order.getOrderSlicesAuthors",
    { id: orderId },
  ]);

  useEffect(() => {
    if (order.data) {
      setOrderDetails(order.data);
    }
    if (authors.data) {
      setAuthorList(authors.data);
    }
  }, [order.data, orderId, authors.data]);

  const renderOrder = orderDetails.map((item: McListItemType) => {
    return (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>{item.quantity}</td>
      </tr>
    );
  });

  const renderOrderSlices = orderSlices.data?.map((slice) => {
    const details: McListType = JSON.parse(slice.details);

    const items = details.map((item: McListItemType) => {
      return (
        <tr key={item.id}>
          <td>{item.name}</td>
          <td>{item.quantity}</td>
        </tr>
      );
    });

    return (
      <div key={slice.id}>
        <h3>{slice.author}</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>{items}</tbody>
        </table>
      </div>
    );
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-2xl font-bold">Driver panel</h1>
      <h2 className="text-center text-xl font-bold">Order items</h2>
      <div className="overflow-x-auto">
        <table className="table-zebra table w-full">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {renderOrder}
            <tr>
              <td className="font-bold ">Total</td>
              <td className="font-bold text-yellow-500">
                {orderDetails.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0
                )}
                pln
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Button
        onClick={() => {
          router.push(`/Client/${orderId}`);
        }}
      >
        Add your products <br /> to this order!
      </Button>

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
                <th>Fee</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(authorList).map((author) => {
                return (
                  <tr key={author}>
                    <td>{author}</td>
                    <td>{authorList[author]}pln</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {renderOrderSlices}
    </div>
  );
};

export default Panel;
