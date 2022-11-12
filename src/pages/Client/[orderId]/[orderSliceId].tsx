import { OrderItem, RestaurantMenuItem } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRemoveOrderItem } from "src/hooks/mutations/useRemoveOrderItem";
import { useSubmitOrderItem } from "src/hooks/mutations/useSubmitOrderItem";
import { useUpdateOrderItem } from "src/hooks/mutations/useUpdateOrderItem";
import Button from "../../../components/Button";
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

  // const updateOrderSlice = useUpdateOrderSlice();
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

  const removeFromOrder = (item: RestaurantMenuItem) => {
    const found = order.find((el) => el.restaurantMenuItemId === item.id);
    if (found) {
      if (found.quantity > 1) {
        updateOrderItem({
          quantity: found.quantity - 1,
          orderItemId: found.id,
        });
      } else {
        removeOrderItem({ orderItemId: found.id });
      }
    }
  };

  const Form = Order.data?.Restaurant.RestaurantMenuItem.map((item) => {
    return (
      <div className="flex gap-2" key={item.id}>
        <Button
          onClick={() => {
            removeFromOrder(item);
          }}
        >
          -
        </Button>
        <Button
          onClick={() => {
            addToOrder(item);
          }}
        >
          +
        </Button>
        {item.name} {item.price}pln
      </div>
    );
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="h-px flex-grow bg-gray-200"></div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex max-w-sm flex-col gap-2">{Form}</div>

        <div className="flex flex-col gap-4">
          <div className="h-full overflow-x-auto">
            <table className="table-zebra table w-full">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {order.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td className="flex gap-2">
                        {item.RestaurantMenuItem.name}
                      </td>
                      <td> {item.quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className=" sm:text:sm inline-block content-center items-center justify-center rounded px-6 py-2 text-center align-middle text-xs font-medium uppercase leading-tight text-black md:text-xl">
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
