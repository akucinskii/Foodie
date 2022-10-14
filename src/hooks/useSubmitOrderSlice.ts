import { McListType } from "../pages/Client/[orderId]";
import { trpc } from "../utils/trpc";

export const useSubmitOrderSlice = () => {
  const mutation = trpc.order.createOrderSlice.useMutation();

  return (order: McListType, orderId: string, author: string) => {
    const orderSliceAsJson = JSON.stringify(order);
    try {
      mutation.mutateAsync({
        orderId,
        details: orderSliceAsJson,
        author,
      });
    } catch (error) {
      console.error(error);
    }
  };
};
