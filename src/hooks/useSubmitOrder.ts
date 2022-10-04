import { McListType } from "../pages/Client";
import { trpc } from "../utils/trpc";

export const useSubmitOrder = () => {
  const mutation = trpc.useMutation(["order.createOrder"]);

  return (order: McListType) => {
    const orderAsJson = JSON.stringify(order);
    try {
      mutation.mutateAsync({
        details: orderAsJson,
      });

      console.log("order submitted", orderAsJson);
    } catch (error) {
      console.error(error);
    }
  };
};
