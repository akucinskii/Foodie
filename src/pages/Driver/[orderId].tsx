import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Button from "../../components/Button";
import { trpc } from "../../utils/trpc";
import { McListItemType, McListType } from "../Client/[orderId]";

const Panel = () => {
  const [orderDetails, setOrderDetails] = React.useState<McListType>([]);
  const router = useRouter();
  const orderId = router.query.orderId as string;

  const order = trpc.useQuery(["order.getOrderDetails", { id: orderId }]);

  useEffect(() => {
    if (order.data) {
      setOrderDetails(order.data);
    }
  }, [order.data, orderId]);

  const renderOrder = orderDetails.map((item: McListItemType) => {
    console.log(item);
    return (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>{item.quantity}</td>
      </tr>
    );
  });

  return (
    <div className="flex flex-col gap-4">
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
    </div>
  );
};

export default Panel;
