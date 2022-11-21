import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import Wrapper from "src/components/Wrapper/Wrapper";
import { useSubmitOrder } from "src/hooks/mutations/useSubmitOrder";
import { trpc } from "src/utils/trpc";
import Modal from "react-modal";
import { useClickAway } from "react-use";

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
  const [orderName, setOrderName] = React.useState<string>("");
  const [price, setPrice] = React.useState<string>("");
  const [newOrderTabOpened, setNewOrderTabOpened] =
    React.useState<boolean>(false);
  const router = useRouter();
  const id = router.query.restaurantId as string;
  const ref = useRef(null);
  useClickAway(ref, () => {
    if (newOrderTabOpened) {
      setNewOrderTabOpened(false);
      setOrderName("");
    }
  });
  const { data: session } = useSession();
  const submitRestaurantMenuItem = useSubmitRestaurantMenuItem();

  const restaurantMenuData = trpc.restaurant.getRestaurantById.useQuery({
    id: id as string,
  });
  const submitOrder = useSubmitOrder();

  const bg = {
    overlay: {
      background: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <Wrapper>
      <div className="flex flex-col">
        <Modal
          isOpen={newOrderTabOpened}
          style={bg}
          className=" absolute top-20 left-[50%] flex w-fit translate-x-[-50%] flex-col gap-2 rounded-lg bg-base-100 p-10"
        >
          <div
            ref={ref}
            className="flex h-full w-full flex-col items-center gap-8"
          >
            <div>
              <h1 className="text-center text-xl font-bold">
                Create new order for {restaurantMenuData.data?.name}
              </h1>
            </div>
            <div className="w-full">
              <label className="label">
                <span className="label-text">Enter your order name</span>
              </label>
              <input
                className="input input-bordered w-full"
                type="text"
                id="name"
                required
                placeholder="Order name"
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary w-full"
              disabled={
                orderName === "" ||
                orderName.length > 20 ||
                !session?.user ||
                !(id.length > 0)
              }
              onClick={async () => {
                const order = await submitOrder(
                  orderName,
                  session?.user?.id as string,
                  id as string
                );

                if (order) {
                  router.push(`/Driver/${order.id}`);
                }
              }}
            >
              NEW ORDER
            </button>
            {!session?.user && (
              <p className="text-center text-red-600">
                You need to be logged in to create new Order
              </p>
            )}
          </div>
        </Modal>

        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className="btn btn-primary w-fit"
            onClick={() => {
              setNewOrderTabOpened(true);
            }}
          >
            Create new order to this restaurant
          </button>
        </div>

        {/* <div>
          <ul>
            {restaurantMenuData.data?.RestaurantMenuItem.map((item) => (
              <li key={item.id}>
                {item.name} - {item.price}
              </li>
            ))}
          </ul>
        </div> */}
        <div className="mx-auto max-w-full py-4 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="col-span-full text-4xl font-bold text-base-content">
            {restaurantMenuData.data?.name} Menu
          </h1>
          <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-4">
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 py-10 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {restaurantMenuData.data?.RestaurantMenuItem.map((item) => (
                // Todo: Add a link to the restaurant menu item page
                <Link href={`#`} className="group" key={item.id}>
                  <div className="xl:aspect-w-7 xl:aspect-h-8 aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
                    <Image
                      src={
                        item.image ? item.image : "/restaurantPlaceholder.jpg"
                      }
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
                </Link>
              ))}
            </div>
            <div className="col-span-1 flex h-fit w-full flex-col justify-between rounded-lg border-[4px] border-primary bg-base-300 p-4 py-10">
              <h1 className="text-2xl font-bold ">Add new item to menu</h1>
              <div>
                <label className="label">
                  <span className="label-text ">Enter item Name</span>
                </label>
                <input
                  className="input input-bordered w-full "
                  type="text"
                  id="name"
                  required
                  placeholder="Order name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="label">
                  <span className="label-text ">Enter {"item"} price</span>
                </label>
                <input
                  className="input input-bordered w-full "
                  type="number"
                  id="name"
                  required
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary "
                disabled={
                  name === "" ||
                  price === "" ||
                  name.length > 20 ||
                  !session?.user
                }
                onClick={async () => {
                  await submitRestaurantMenuItem(
                    name,
                    Number(price),
                    id as string
                  );
                  setName("");
                  setPrice("");
                }}
              >
                ADD NEW ITEM TO MENU
              </button>
            </div>
          </div>
        </div>

        {!session?.user && (
          <p className="text-center text-red-600">
            You need to be logged in to add new items to restaurant menu
          </p>
        )}
      </div>
    </Wrapper>
  );
};

export default RestaurantMenu;
