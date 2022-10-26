import { McListType } from "../../pages/Client/[orderId]";
import { trpc } from "../../utils/trpc";

export const useSubmitOrderSlice = () => {
  const utils = trpc.useContext();

  const mutation = trpc.orderSlice.createOrderSlice.useMutation({
    onSuccess: () => {
      utils.order.invalidate();
      utils.orderSlice.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (order: McListType, orderId: string, author: string) => {
    mutation.mutateAsync({
      orderId,
      details: order,
      author,
    });
  };
};
