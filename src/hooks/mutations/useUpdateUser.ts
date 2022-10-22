import { trpc } from "../../utils/trpc";

interface UserDetails {
  name: string;
  email: string;
  image: string | null;
}

const useUpdateUser = () => {
  const utils = trpc.useContext();

  const mutation = trpc.user.updateUserById.useMutation({
    onSuccess: () => {
      utils.user.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (userId: string, user: UserDetails) => {
    mutation.mutateAsync({
      userId,
      user,
    });
  };
};

export default useUpdateUser;
