import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Button from "../../components/Button";
import { useSubmitOrderSlice } from "../../hooks/mutations/useSubmitOrderSlice";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { getBaseUrl, trpc } from "../../utils/trpc";

export interface restaurantItemInterface {
  id: string;
  name: string;
  price: number;
}

export interface itemInterface extends restaurantItemInterface {
  quantity: number;
}

const Client = () => {
  const { data: session } = useSession();
  const [author, setAuthor] = React.useState(session?.user?.name || "");
  const [order, setOrder] = React.useState<itemInterface[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const router = useRouter();
  const orderId = router.query.orderId as string;
  const itemList =
    trpc.restaurantItem.getRestaurantItemsByRestaurantName.useQuery({
      restaurantName: "McDonalds",
    });

  const submitOrderSlice = useSubmitOrderSlice();

  useEffect(() => {
    if (session && session.user && session.user.name) {
      setAuthor(session.user.id);
    }
  }, [session]);

  useEffect(() => {
    const initialValue = 0;
    const value = order.reduce(
      (prev, curr) => prev + curr.price * curr.quantity,
      initialValue
    );
    setTotal(value);
  }, [order]);

  const addToOrder = (item: itemInterface) => {
    const found = order.some((el) => el.name === item.name);

    if (found) {
      const newOrder = order.map((el) => {
        if (el.name === item.name) {
          return { ...el, quantity: el.quantity + 1 };
        }
        return el;
      });

      setOrder(newOrder);
    } else {
      setOrder([...order, { ...item, quantity: 1 }]);
    }
  };

  const removeFromOrder = (item: itemInterface) => {
    const found = order.some((el) => el.name === item.name);

    if (found) {
      const newOrder = order.map((el) => {
        if (el.name === item.name) {
          return { ...el, quantity: el.quantity - 1 };
        }
        return el;
      });

      const filteredOrder = newOrder.filter((el) => el.quantity > 0);

      setOrder(filteredOrder);
    }
  };

  const Form = itemList.data?.map((item: restaurantItemInterface) => {
    return (
      <div className="flex gap-2" key={item.id}>
        <Button
          onClick={() => {
            removeFromOrder(item as itemInterface);
          }}
        >
          -
        </Button>
        <Button
          onClick={() => {
            addToOrder(item as itemInterface);
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
      {/* <div>
        <label className="label">
          <span className="label-text">Enter your name</span>
        </label>
        <input
          className="input input-bordered w-full"
          type="text"
          required
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div> */}

      <div className="h-px flex-grow bg-gray-200"></div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex max-w-sm flex-col justify-center gap-2">
          {Form}
        </div>

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
                      <td className="flex gap-2">{item.name}</td>
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
            disabled={author.length < 3 || order.length === 0 || total > 500}
            onClick={() => {
              submitOrderSlice(order, orderId, author);
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
