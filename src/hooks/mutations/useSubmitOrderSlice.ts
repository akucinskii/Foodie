import { McListType } from "../../pages/Client/[orderId]";
import { trpc } from "../../utils/trpc";

export const useSubmitOrderSlice = () => {
  const utils = trpc.useContext();

  const mutation = trpc.orderSlice.createOrderSlice.useMutation({
    onSuccess: () => {
      utils.order.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (order: McListType, orderId: string, author: string) => {
    const orderSliceAsJson = JSON.stringify(order);

    mutation.mutateAsync({
      orderId,
      details: orderSliceAsJson,
      author,
    });
  };
};
