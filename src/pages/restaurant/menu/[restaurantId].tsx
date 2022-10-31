import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import Button from "src/components/Button";
import { trpc } from "src/utils/trpc";

const useSubmitRestaurantMenuItem = () => {
  const utils = trpc.useContext();
  const mutation =
    trpc.restaurantMenuItem.createNewRestaurantMenuItem.useMutation({
      onSuccess: () => {
        utils.restaurant.invalidate();
        utils.restaurantMenuItem.invalidate();
      },
      onError: (error) => {
        console.error(error);
      },
    });

  return (name: string, price: number, restaurantId: string) => {
    const response = mutation.mutateAsync({
      name,
      price,
      restaurantId,
    });

    return response;
  };
};

const RestaurantMenu = () => {
  const [name, setName] = React.useState<string>("");
  const [price, setPrice] = React.useState<string>("");
  const [] = React.useState<string>("");
  const router = useRouter();
  const id = router.query.restaurantId;
  const { data: session } = useSession();
  const submitRestaurantMenuItem = useSubmitRestaurantMenuItem();

  const restaurantMenuData = trpc.restaurant.getRestaurantById.useQuery({
    id: id as string,
  });

  return (
    <div className="flex flex-col gap-4 ">
      <h1 className="text-center text-xl font-bold">
        {restaurantMenuData.data?.name}
      </h1>

      <h1 className="text-center text-lg font-bold">Items</h1>
      <div>
        <ul>
          {restaurantMenuData.data?.RestaurantMenuItem.map((item) => (
            <li key={item.id}>
              {item.name} - {item.price}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label className="label">
          <span className="label-text">Enter item Name</span>
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
          <span className="label-text">Enter {"item"} price</span>
        </label>
        <input
          className="input input-bordered w-full"
          type="number"
          id="name"
          required
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <Button
        disabled={
          name === "" || price === "" || name.length > 20 || !session?.user
        }
        onClick={async () => {
          await submitRestaurantMenuItem(name, Number(price), id as string);
          setName("");
          setPrice("");
        }}
      >
        ADD NEW ITEM TO MENU
      </Button>
      {!session?.user && (
        <p className="text-center text-red-600">
          You need to be logged in to add new items to restaurant menu
        </p>
      )}
    </div>
  );
};

export default RestaurantMenu;
