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
      <h1 className="text-center text-xl font-bold">Orders created today</h1>
      <div className="flex flex-col gap-2">
        {todayOrders.data && todayOrders.data?.length !== 0 ? (
          linkToTodayOrders
        ) : (
          <p className="text-center">No orders found :(</p>
        )}
      </div>
    </div>
  );
};

export default All;
