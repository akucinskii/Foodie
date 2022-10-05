import { useRouter } from "next/router";
import React from "react";
import Button from "../../components/Button";
import { useSubmitOrder } from "../../hooks/useSubmitOrder";

const Driver = () => {
  const [name, setName] = React.useState<string>("Order name");
  const router = useRouter();
  const submitOrder = useSubmitOrder();
  return (
    <div className="flex flex-col gap-2">
      <input
        className={
          "h-10  rounded-lg border-2 border-gray-300 bg-white px-5 pr-16 text-sm focus:outline-none"
        }
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        onClick={async () => {
          const order = await submitOrder("test", "test");

          if (order) {
            router.push(`/Client/${order.id}`);
          }
        }}
      >
        NEW ORDER
      </Button>
    </div>
  );
};

export default Driver;
