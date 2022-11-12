import { OrderItem, RestaurantMenuItem } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSubmitOrderSlice } from "src/hooks/mutations/useSubmitOrderSlice";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import Button from "../../components/Button";
import { getBaseUrl, trpc } from "../../utils/trpc";

const Panel = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const submitNewOrderSlice = useSubmitOrderSlice();
  const orderId = router.query.orderId as string;
  const order = trpc.order.getOrderById.useQuery({ id: orderId });
  const orderSlices = trpc.orderSlice.getOrderSlicesByOrderId.useQuery({
    id: orderId,
  });

  if (
    // order.isFetching ||
    orderSlices.isFetching ||
    // authors.isFetching ||
    orderSlices.isRefetching
  ) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  const renderOrder = () => {
    const combinedOrders = order.data?.orderSlices.map((slice) => {
      return slice.OrderItem.map((item) => {
        return {
          ...item,
          RestaurantMenuItem: item.RestaurantMenuItem,
          OrderSlice: slice,
        };
      });
    });

    const mergedOrders = combinedOrders?.flat();

    const helperArray: (OrderItem & {
      RestaurantMenuItem: RestaurantMenuItem;
    })[] = [];
    mergedOrders?.forEach((item) => {
      const restaurantMenuItemId = item.restaurantMenuItemId;

      if (
        helperArray.find(
          (item2) => item2.restaurantMenuItemId === restaurantMenuItemId
        )
      ) {
        const index = helperArray.findIndex(
          (item2) => item2.restaurantMenuItemId === restaurantMenuItemId
        );
        if (helperArray[index] !== undefined) {
          (helperArray[index] as OrderItem).quantity += item.quantity;
        }
        return;
      } else {
        helperArray.push(item);
      }
    });

    const map = helperArray.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.RestaurantMenuItem.name}</td>
          <td className="text-right">{item.quantity}</td>
        </tr>
      );
    });

    return map;
  };

  const renderOrderSlices = order.data?.orderSlices.map((slice) => {
    const items = slice.OrderItem.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.RestaurantMenuItem.name}</td>
          <td className="text-right">{item.quantity}</td>
        </tr>
      );
    });

    return (
      <Link
        key={slice.id}
        href={
          slice.authorId === session?.user?.id
            ? `/Client/${orderId}/${slice.id}`
            : `#`
        }
        legacyBehavior
      >
        <div>
          <h3 className="text-center">{slice.author.name}</h3>
          {slice.authorId === session?.user?.id && (
            <p className="text-center font-bold text-yellow-500">
              Click to edit
            </p>
          )}
          <table className="table-zebra table w-full">
            <thead>
              <tr>
                <th>Item</th>
                <th className="text-right">Quantity</th>
              </tr>
            </thead>
            <tbody>{items}</tbody>
          </table>
        </div>
      </Link>
    );
  });

  return (
    <div className="flex min-w-full flex-col gap-4 md:min-w-[50%]">
      <h1 className="text-center text-2xl font-bold">Driver panel</h1>
      <h2 className="text-center text-xl font-bold">Order items</h2>
      <div className="overflow-x-auto">
        <table className="table-zebra table w-full">
          <thead>
            <tr>
              <th>Item</th>
              <th className="text-right">Quantity</th>
            </tr>
          </thead>
          <tbody>
            <>
              {renderOrder()}
              <tr>
                <td className="font-bold ">Total</td>
                <td className="text-right font-bold text-yellow-500">
                  {order.data?.orderSlices.reduce(
                    (acc, slice) =>
                      acc +
                      slice.OrderItem.reduce(
                        (acc2, item) =>
                          acc2 + item.quantity * item.RestaurantMenuItem.price,
                        0
                      ),
                    0
                  )}
                  pln
                </td>
              </tr>
            </>
          </tbody>
        </table>
      </div>

      <Button
        disabled={
          !session?.user ||
          !!orderSlices.data?.find((el) => el.authorId == session.user?.id)
        }
        onClick={async () => {
          const { id } = await submitNewOrderSlice(
            orderId,
            session?.user?.id as string
          );
          router.push(`/Client/${orderId}/${id}`);
        }}
      >
        Add your products <br /> to this order!
      </Button>

      {!session?.user && (
        <p className="text-center text-red-600">
          You need to be logged in to add your Products
        </p>
      )}
      <h2 className="text-center text-xl font-bold">Who pays how much?</h2>
      <div className="flex flex-col gap-4">
        <div className="overflow-x-auto">
          <table className="table-zebra table w-full">
            <thead>
              <tr>
                <th>Author</th>
                <th className="text-right">Fee</th>
              </tr>
            </thead>
            <tbody>
              {orderSlices.data?.map((slice) => {
                return (
                  <tr key={slice.id}>
                    <td>{slice.author.name}</td>
                    <td className="text-right">
                      {slice.OrderItem.reduce(
                        (acc, item) =>
                          acc + item.quantity * item.RestaurantMenuItem.price,
                        0
                      )}
                      pln
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="h-px flex-grow bg-gray-200"></div>
      {renderOrderSlices}
    </div>
  );
};

export default Panel;

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
