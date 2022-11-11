import { trpc } from "../../utils/trpc";

type IProps = {
  orderItemId: string;
};

export const useRemoveOrderItem = () => {
  const utils = trpc.useContext();
  const mutation = trpc.orderItem.removeOrderItem.useMutation({
    onSuccess: () => {
      utils.orderSlice.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return ({ orderItemId }: IProps) => {
    const response = mutation.mutateAsync({
      id: orderItemId,
    });
    return response;
  };
};
