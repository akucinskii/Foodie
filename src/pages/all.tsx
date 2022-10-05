import moment from "moment";
import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";

const All = () => {
  const allOrders = trpc.useQuery(["order.getAllOrders"]);

  const linkToOrders = allOrders.data?.map((order) => (
    <Link key={order.id} href={`Order/${order.id}`}>
      <a>
        {order.name} {moment(order.createdAt).format("DD/MM/YYYY")}
      </a>
    </Link>
  ));
  return <div>{linkToOrders}</div>;
};

export default All;
