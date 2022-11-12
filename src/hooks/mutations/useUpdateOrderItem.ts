import { trpc } from "../../utils/trpc";

type IProps = {
  quantity: number;
  orderItemId: string;
};

export const useUpdateOrderItem = () => {
  const utils = trpc.useContext();
  const mutation = trpc.orderItem.updateOrderItem.useMutation({
    onSuccess: () => {
      utils.order.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return ({ quantity, orderItemId }: IProps) => {
    const response = mutation.mutateAsync({
      quantity,
      id: orderItemId,
    });

    return response;
  };
};
