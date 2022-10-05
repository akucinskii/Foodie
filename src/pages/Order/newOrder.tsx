import { useRouter } from "next/router";
import React from "react";
import { useSubmitOrder } from "../../hooks/useSubmitOrder";

const Driver = () => {
  const router = useRouter();
  const submitOrder = useSubmitOrder();
  return (
    <div>
      <button
        onClick={async () => {
          const order = await submitOrder("test", "test");

          if (order) {
            router.push(`/Client/${order.id}`);
          }
        }}
      >
        TEST BUTTON
      </button>
    </div>
  );
};

export default Driver;
