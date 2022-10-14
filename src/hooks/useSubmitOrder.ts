import { trpc } from "../utils/trpc";

export const useSubmitOrder = () => {
  const mutation = trpc.order.createOrder.useMutation();

  return (name: string, author: string) => {
    try {
      const response = mutation.mutateAsync({
        name,
        author,
      });

      console.log("order submitted");

      return response;
    } catch (error) {
      console.error(error);
    }
  };
};
