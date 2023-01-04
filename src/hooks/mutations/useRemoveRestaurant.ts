import { trpc } from "../../utils/trpc";

type IProps = {
  restaurantId: string;
};

export const useRemoveRestaurant = () => {
  const utils = trpc.useContext();
  const mutation = trpc.restaurant.removeRestaurantById.useMutation({
    onSuccess: () => {
      utils.restaurant.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return ({ restaurantId }: IProps) => {
    const response = mutation.mutateAsync({
      id: restaurantId,
    });
    return response;
  };
};
