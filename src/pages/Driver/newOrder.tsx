import { useRouter } from "next/router";
import React from "react";
import Button from "../../components/Button";
import { useSubmitOrder } from "../../hooks/useSubmitOrder";

const Driver = () => {
  const [name, setName] = React.useState<string>("");
  const [author, setAuthor] = React.useState<string>("");
  const router = useRouter();
  const submitOrder = useSubmitOrder();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-xl font-bold">Create new order</h1>
      <div>
        <label className="label">
          <span className="label-text">Enter your name</span>
        </label>
        <input
          className="input input-bordered w-full"
          type="text"
          id="name"
          required
          placeholder="Order name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="label">
          <span className="label-text">Enter your order name</span>
        </label>
        <input
          className="input input-bordered w-full"
          type="text"
          required
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      <Button
        disabled={name === "" || author === ""}
        onClick={async () => {
          const order = await submitOrder(name, author);

          if (order) {
            router.push(`/Client/${order.id}`);
          }
        }}
      >
        NEW ORDER LIST
      </Button>
    </div>
  );
};

export default Driver;
