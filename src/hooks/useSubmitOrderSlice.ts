import { McListType } from "../pages/Client/[orderId]";
import { trpc } from "../utils/trpc";

export const useSubmitOrderSlice = () => {
  const mutation = trpc.useMutation(["order.createOrderSlice"]);

  return (order: McListType, orderId: string) => {
    const orderSliceAsJson = JSON.stringify(order);
    try {
      mutation.mutateAsync({
        orderId,
        details: orderSliceAsJson,
      });

      console.log(
        `Order successfully added to order ${orderId}`,
        orderSliceAsJson
      );
    } catch (error) {
      console.error(error);
    }
  };
};
