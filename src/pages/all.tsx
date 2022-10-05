import moment from "moment";
import Link from "next/link";
import React from "react";
import Button from "../components/Button";
import { trpc } from "../utils/trpc";

const All = () => {
  const allOrders = trpc.useQuery(["order.getAllOrders"]);

  const linkToOrders = allOrders.data?.map((order) => (
    <Link key={order.id} href={`Order/${order.id}`}>
      <Button>
        <a>
          {order.name} {moment(order.createdAt).format("DD/MM/YYYY")}
        </a>
      </Button>
    </Link>
  ));
  return <div className="flex flex-col gap-2">{linkToOrders}</div>;
};

export default All;
