import { useRouter } from "next/router";
import React, { useEffect } from "react";
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
  }, [order.data]);

  const renderOrder = orderDetails.map((item: McListItemType) => {
    console.log(item);
    return (
      <div key={item.id}>
        <h1>{item.name}</h1>
        <h2>{item.quantity}</h2>
      </div>
    );
  });

  return <div>{renderOrder}</div>;
};

export default Panel;
