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

  return (orderId: string, author: string) => {
    const response = mutation.mutateAsync({
      orderId,
      author,
    });

    return response;
  };
};
