import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
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

  return (
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
    </div>
  );
};

export default NewRestaurant;
