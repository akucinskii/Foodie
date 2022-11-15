import { Order } from "@prisma/client";
import Link from "next/link";
import Wrapper from "src/components/Wrapper/Wrapper";
import Button from "../components/Button/Button";
import { trpc } from "../utils/trpc";

const All = () => {
  const todayOrders = trpc.order.getAllTodayOrders.useQuery();

  const linkToTodayOrders = todayOrders.data?.map((order: Order) => (
    <Link key={order.id} href={`Driver/${order.id}`} legacyBehavior>
      <Button>
        <a>
          {order.name}{" "}
          {new Intl.DateTimeFormat("en-GB").format(order.createdAt)}
        </a>
      </Button>
    </Link>
  ));

  return (
    <Wrapper>
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-xl font-bold">Orders created today</h1>
        <div className="flex flex-col gap-2">
          {todayOrders.data ? (
            todayOrders.data?.length !== 0 ? (
              linkToTodayOrders
            ) : (
              <p className="text-center">No orders found :(</p>
            )
          ) : (
            <h1 className="text-bold text-center text-xl">Loading...</h1>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default All;
