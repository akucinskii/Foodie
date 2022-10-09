import moment from "moment";
import Link from "next/link";
import React from "react";
import Button from "../components/Button";
import { trpc } from "../utils/trpc";

const All = () => {
  // const allOrders = trpc.useQuery(["order.getAllOrders"]);
  const todayOrders = trpc.useQuery(["order.getAllTodayOrders"]);

  // const linkToOrders = allOrders.data?.map((order) => (
  //   <Link key={order.id} href={`Driver/${order.id}`}>
  //     <Button disabled>
  //       <a>
  //         {order.name} {moment(order.createdAt).format("DD/MM/YYYY")}
  //       </a>
  //     </Button>
  //   </Link>
  // ));

  const linkToTodayOrders = todayOrders.data?.map((order) => (
    <Link key={order.id} href={`Driver/${order.id}`}>
      <Button>
        <a>
          {order.name} {moment(order.createdAt).format("DD/MM/YYYY")}
        </a>
      </Button>
    </Link>
  ));

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-center text-xl">Todays orders</h1>
      <div className="flex flex-col gap-2">{linkToTodayOrders}</div>
    </div>
  );
};

export default All;
