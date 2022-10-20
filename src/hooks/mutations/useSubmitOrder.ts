import { trpc } from "../../utils/trpc";

export const useSubmitOrder = () => {
  const utils = trpc.useContext();
  const mutation = trpc.order.createOrder.useMutation({
    onSuccess: () => {
      utils.order.getAllOrders.invalidate();
      utils.order.getAllTodayOrders.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (name: string, author: string) => {
    const response = mutation.mutateAsync({
      name,
      author,
    });

    return response;
  };
};
