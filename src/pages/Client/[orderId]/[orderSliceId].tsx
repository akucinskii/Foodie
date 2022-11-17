import { OrderItem, RestaurantMenuItem } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useHover } from "react-use";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Wrapper from "src/components/Wrapper/Wrapper";
import { useRemoveOrderItem } from "src/hooks/mutations/useRemoveOrderItem";
import { useSubmitOrderItem } from "src/hooks/mutations/useSubmitOrderItem";
import { useUpdateOrderItem } from "src/hooks/mutations/useUpdateOrderItem";
import Button from "../../../components/Button/Button";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { getBaseUrl, trpc } from "../../../utils/trpc";

const Client = () => {
  const [order, setOrder] = React.useState<
    (OrderItem & {
      RestaurantMenuItem: RestaurantMenuItem;
    })[]
  >([]);
  const [total, setTotal] = React.useState<number>(0);
  const router = useRouter();
  const orderId = router.query.orderId as string;
  const orderSliceId = router.query.orderSliceId as string;
  const Order = trpc.order.getOrderById.useQuery({ id: orderId });
  const removeOrderItem = useRemoveOrderItem();
  const updateOrderItem = useUpdateOrderItem();
  const submitOrderItem = useSubmitOrderItem();

  useEffect(() => {
    if (Order.data) {
      setOrder(
        Order.data.orderSlices.find((slice) => slice.id === orderSliceId)
          ?.OrderItem || []
      );
    }
  }, [Order.data, orderSliceId]);

  useEffect(() => {
    const initialValue = 0;
    const orderFromQuery = Order.data;
    const orderSliceById =
      orderFromQuery?.orderSlices.find((slice) => slice.id === orderSliceId)
        ?.OrderItem || [];

    const total = orderSliceById.reduce((acc: number, item) => {
      return acc + item.RestaurantMenuItem.price * item.quantity;
    }, initialValue);
    setTotal(total);
  }, [Order.data, orderSliceId]);

  const addToOrder = async (item: RestaurantMenuItem) => {
    const found = order.find((el) => el.restaurantMenuItemId === item.id);
    if (found) {
      updateOrderItem({
        quantity: found.quantity + 1,
        orderItemId: found.id,
      });
    } else {
      await submitOrderItem({
        quantity: 1,
        restaurantMenuItemId: item.id,
        orderSliceId: orderSliceId,
      });
    }
  };

  const removeFromOrder = (item: RestaurantMenuItem, all = false) => {
    const found = order.find((el) => el.restaurantMenuItemId === item.id);
    console.log(found);
    if (found) {
      console.log("found");
      if (found.quantity > 1 && !all) {
        updateOrderItem({
          quantity: found.quantity - 1,
          orderItemId: found.id,
        });
      } else {
        console.log("remove");
        removeOrderItem({ orderItemId: found.id });
      }
    }
  };

  if (
    // order.isFetching ||
    Order.isFetching ||
    // authors.isFetching ||
    Order.isRefetching
  ) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <Wrapper>
      <div className="mx-auto max-w-full py-4 px-4 sm:py-24 sm:px-6 lg:px-8 xl:max-w-[1440px]">
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-4">
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 py-10 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {Order.data?.Restaurant.RestaurantMenuItem.map((item) => (
              // Todo: Add a link to the restaurant menu item page
              <div
                className="group"
                key={item.id}
                onClick={() => {
                  addToOrder(item);
                }}
              >
                <div className="xl:aspect-w-7 xl:aspect-h-8 aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
                  <Image
                    src={item.image ? item.image : "/restaurantPlaceholder.jpg"}
                    width="300"
                    height="300"
                    alt={item.name}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-lg font-medium text-base-content">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm text-base-content">
                  {item.price}pln
                </p>
              </div>
            ))}
          </div>
          <div className="col-span-1 flex h-fit w-full flex-col justify-between gap-4 rounded-lg border-[4px] border-primary bg-base-300 p-4">
            <div>
              <h2 className="text-center text-2xl font-bold text-primary">
                Your order from {Order.data?.Restaurant.name}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-full overflow-x-auto">
                <table className="table-zebra table w-full">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th className="w-min">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td className="flex gap-2">
                            {item.RestaurantMenuItem.name}
                          </td>
                          <td>
                            <div className="flex gap-2">
                              {" "}
                              {item.quantity}{" "}
                              <button
                                onClick={() => {
                                  addToOrder(item.RestaurantMenuItem);
                                }}
                              >
                                +
                              </button>
                              <button
                                onClick={() => {
                                  removeFromOrder(item.RestaurantMenuItem);
                                }}
                              >
                                -
                              </button>
                              <button
                                onClick={() => {
                                  removeFromOrder(
                                    item.RestaurantMenuItem,
                                    true
                                  );
                                }}
                              >
                                X
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className=" sm:text:sm inline-block content-center items-center justify-center rounded px-6 py-2 text-center align-middle text-xs font-medium uppercase leading-tight md:text-xl">
                Total: <span className="text-yellow-500">{total} pln.</span>
              </div>
              <Button
                disabled={order.length === 0 || total > 500}
                onClick={() => {
                  // not needed to update orderSlice since we create and update orderItems that connect to the orderSlice at the time of their creation/deletion.
                  // updateOrderSlice(orderId, order);
                  router.push(`/Driver/${orderId}`);
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

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

export default Client;
