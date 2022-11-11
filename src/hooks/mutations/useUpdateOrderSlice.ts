import { OrderItem } from "@prisma/client";
import { trpc } from "../../utils/trpc";

export const useUpdateOrderSlice = () => {
  const utils = trpc.useContext();
  const mutation = trpc.orderSlice.updateOrderSlice.useMutation({
    onSuccess: () => {
      utils.order.invalidate();
      utils.orderSlice.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (orderSliceId: string, orderItemsArray: OrderItem[]) => {
    mutation.mutateAsync({
      id: orderSliceId,
      orderItemsArray,
    });
  };
};
