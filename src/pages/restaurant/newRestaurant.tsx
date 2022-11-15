import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Wrapper from "src/components/Wrapper/Wrapper";
import { trpc } from "src/utils/trpc";
import Button from "../../components/Button";

const useSubmitRestaurant = () => {
  const utils = trpc.useContext();
  const mutation = trpc.restaurant.createNewRestaurant.useMutation({
    onSuccess: () => {
      utils.restaurant.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (name: string, author: string, address: string) => {
    const response = mutation.mutateAsync({
      name,
      address,
      author,
    });

    return response;
  };
};

const NewRestaurant = () => {
  const { data: session } = useSession();

  const [name, setName] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [author, setAuthor] = React.useState<string>(session?.user?.name || "");

  const router = useRouter();

  useEffect(() => {
    if (session && session.user && session.user.name) {
      setAuthor(session.user.id);
    }
  }, [session]);
  const submitRestaurant = useSubmitRestaurant();
  const restaurantsQuery = trpc.restaurant.getAllRestaurants.useQuery();

  return (
    <Wrapper>
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-xl font-bold">Add new restaurant</h1>
        <div>
          <label className="label">
            <span className="label-text">Enter your restaurant Name</span>
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
        </div>
        <div>
          <label className="label">
            <span className="label-text">Enter your restaurant Address</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="text"
            id="name"
            required
            placeholder="Adress"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <Button
          disabled={
            name === "" || author === "" || name.length > 20 || !session?.user
          }
          onClick={async () => {
            const order = await submitRestaurant(name, author, address);

            if (order) {
              router.push(`/restaurant/menu/${order.id}`);
            }
          }}
        >
          NEW RESTAURANT
        </Button>
        {!session?.user && (
          <p className="text-center text-red-600">
            You need to be logged in to create new restaurant
          </p>
        )}

        <div className="flex flex-col gap-4">
          <h1 className="text-center text-xl font-bold">Restaurants</h1>
          <div className="flex flex-col gap-4">
            {restaurantsQuery.data?.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurant/menu/${restaurant.id}`}
              >
                <div className="flex flex-col gap-4 rounded-md border border-gray-200 p-4">
                  <h1 className="text-xl font-bold">{restaurant.name}</h1>
                  <p>Address: {restaurant.address}</p>
                </div>
              </Link>
            ))}

            {restaurantsQuery.isLoading && <p>Loading...</p>}

            {restaurantsQuery.isError && (
              <p className="text-red-600">
                Error: {restaurantsQuery.error.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default NewRestaurant;
