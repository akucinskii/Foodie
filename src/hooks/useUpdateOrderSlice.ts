import { McListType } from "../pages/Client/[orderId]";
import { trpc } from "../utils/trpc";

export const useUpdateOrderSlice = () => {
  const utils = trpc.useContext();
  const mutation = trpc.order.updateOrderSlice.useMutation({
    onSuccess: () => {
      utils.order.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (order: McListType, orderId: string) => {
    const orderSliceAsJson = JSON.stringify(order);

    mutation.mutateAsync({
      id: orderId,
      details: orderSliceAsJson,
    });
  };
};
