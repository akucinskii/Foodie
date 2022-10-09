import { trpc } from "../utils/trpc";

export const useSubmitOrder = () => {
  const mutation = trpc.useMutation(["order.createOrder"]);

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
