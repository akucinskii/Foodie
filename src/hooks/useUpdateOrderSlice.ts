import { McListType } from "../Client/[orderId]";
import { trpc } from "../utils/trpc";

export const useUpdateOrderSlice = () => {
  const mutation = trpc.order.updateOrderSlice.useMutation();

  return (order: McListType, orderId: string) => {
    const orderSliceAsJson = JSON.stringify(order);
    try {
      mutation.mutateAsync({
        id: orderId,
        details: orderSliceAsJson,
      });
    } catch (error) {
      console.error(error);
    }
  };
};
