import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Button from "../../components/Button";
import useUpdateUser from "../../hooks/mutations/useUpdateUser";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { getBaseUrl, trpc } from "../../utils/trpc";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const userId = router.query.userId as string;
  const user = trpc.user.getUserById.useQuery({ userId: userId });

  const updateUser = useUpdateUser();

  if (user.isFetching) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 text-center ">
      <h1 className="text-2xl">{user.data?.name}</h1>
      <div className="relative h-24 w-24">
        <Image
          alt="avatar"
          className="rounded-full"
          src={user.data?.image as string}
          layout="fill"
        />
      </div>
      <label className="label">
        <span className="label-text">Update your name</span>
      </label>
      <input
        className="input input-bordered w-full"
        type="text"
        id="name"
        required
        placeholder="New name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
       disabled={name.length > 50}
        onClick={() => {
          updateUser(userId, {
            image: session?.user?.image as string | null,
            email: session?.user?.email as string,
            name: name as string,
          });
        }}
      >
        Change username
      </Button>
      <p>{user.data?.email}</p>
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    const baseUrl = getBaseUrl();
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${baseUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default ProfilePage;
