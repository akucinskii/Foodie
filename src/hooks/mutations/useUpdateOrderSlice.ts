import { McListType } from "../../pages/Client/[orderId]";
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

  return (order: McListType, orderId: string) => {
    mutation.mutateAsync({
      id: orderId,
      details: order,
    });
  };
};
