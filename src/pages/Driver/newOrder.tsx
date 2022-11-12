import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { trpc } from "src/utils/trpc";
import Button from "../../components/Button";
import { useSubmitOrder } from "../../hooks/mutations/useSubmitOrder";

const Driver = () => {
  const { data: session } = useSession();

  const [name, setName] = React.useState<string>("");
  const [restaurantId, setRestaurantId] = React.useState<string>("");
  const [author, setAuthor] = React.useState<string>(session?.user?.name || "");
  const restaurantsQuery = trpc.restaurant.getAllRestaurants.useQuery();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user && session.user.name) {
      setAuthor(session.user.id);
    }
  }, [session]);
  const submitOrder = useSubmitOrder();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-xl font-bold">Create new order</h1>
      <div>
        <label className="label">
          <span className="label-text">Enter your order name</span>
        </label>
        <input
          className="input input-bordered w-full"
          type="text"
          id="name"
          required
          placeholder="Order name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="label">
          <span className="label-text">Enter your order name</span>
        </label>
        <select
          className="select select-bordered w-full max-w-xs "
          id="name"
          required
          placeholder="Restaurant"
          value={restaurantId}
          onChange={(e) => {
            setRestaurantId(e.target.value);
          }}
        >
          <option value="" disabled>
            Choose restaurant
          </option>
          {restaurantsQuery.data?.map((restaurant) => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.name}
            </option>
          ))}
        </select>
      </div>

      <Button
        disabled={
          name === "" ||
          author === "" ||
          name.length > 20 ||
          !session?.user ||
          !(restaurantId.length > 0)
        }
        onClick={async () => {
          const order = await submitOrder(name, author, restaurantId);

          if (order) {
            router.push(`/Client/${order.id}`);
          }
        }}
      >
        NEW ORDER LIST
      </Button>
      {!session?.user && (
        <p className="text-center text-red-600">
          You need to be logged in to create new order list
        </p>
      )}
    </div>
  );
};

export default Driver;
