import { trpc } from "../../utils/trpc";

type IProps = {
  quantity: number;
  restaurantMenuItemId: string;
  orderSliceId: string;
};

export const useSubmitOrderItem = () => {
  const utils = trpc.useContext();
  const mutation = trpc.orderItem.createOrderItem.useMutation({
    onSuccess: () => {
      utils.order.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return ({ quantity, restaurantMenuItemId, orderSliceId }: IProps) => {
    const response = mutation.mutateAsync({
      quantity,
      restaurantMenuItemId,
      orderSliceId,
    });

    return response;
  };
};
