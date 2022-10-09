import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Button from "../../components/Button";
import { useSubmitOrderSlice } from "../../hooks/useSubmitOrderSlice";
import { McList } from "../../utils/McList";

export type McListType = typeof McList;
export type McListItemType = typeof McList[number];

const Client = () => {
  const [McListState, setMcListState] = React.useState<McListType>(McList);
  const [order, setOrder] = React.useState<McListItemType[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const router = useRouter();
  const orderId = router.query.orderId as string;

  const submitOrderSlice = useSubmitOrderSlice();

  useEffect(() => {
    const initialValue = 0;
    const value = order.reduce(
      (prev, curr) => prev + curr.price * curr.quantity,
      initialValue
    );
    setTotal(value);
  }, [order]);

  const addToOrder = (item: McListItemType) => {
    const found = order.some((el) => el.name === item.name);

    const updatedMcList = McListState.map((el) => {
      if (el.name === item.name) {
        return { ...el, quantity: el.quantity + 1 };
      }
      return el;
    });

    setMcListState(updatedMcList);

    if (found) {
      const newOrder = order.map((el) => {
        if (el.name === item.name) {
          return { ...el, quantity: el.quantity + 1 };
        }
        return el;
      });

      setOrder(newOrder);
    } else {
      setOrder([...order, { ...item, quantity: 1 }]);
    }
  };

  const removeFromOrder = (item: McListItemType) => {
    const found = order.some((el) => el.name === item.name);

    const updatedMcList = McListState.map((el) => {
      if (el.quantity === 0) {
        return el;
      }

      if (el.name === item.name) {
        return { ...el, quantity: el.quantity - 1 };
      }
      return el;
    });

    setMcListState(updatedMcList);

    if (found) {
      const newOrder = order.map((el) => {
        if (el.name === item.name) {
          return { ...el, quantity: el.quantity - 1 };
        }
        return el;
      });

      setOrder(newOrder);

      if (item.quantity === 1) {
        const filteredOrder = order.filter((el) => el.name !== item.name);

        setOrder(filteredOrder);
      }
    }
  };

  const Form = McListState.map((item) => {
    return (
      <div className="flex gap-2" key={item.id}>
        <Button
          onClick={() => {
            addToOrder(item);
          }}
        >
          +
        </Button>
        <Button
          color="blue"
          onClick={() => {
            removeFromOrder(item);
          }}
        >
          -
        </Button>
        {item.name} {item.price}pln
      </div>
    );
  });
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div className="flex max-w-sm flex-col justify-center gap-2">{Form}</div>

      <div className="flex flex-col gap-4">
        <div className="h-full overflow-x-auto">
          <table className="table-zebra table w-full">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {order.map((item) => {
                return (
                  <tr key={item.id}>
                    <td className="flex gap-2">{item.name}</td>
                    <td> {item.quantity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div />
        <input></input>
        <div className=" sm:text:sm inline-block content-center items-center justify-center rounded px-6 py-2 text-center align-middle text-xs font-medium uppercase leading-tight text-black md:text-xl">
          Total: <span className="text-yellow-500">{total} pln</span>
        </div>
        <Button
          color="blue"
          onClick={() => {
            submitOrderSlice(order, orderId, "test");
            router.push(`/Driver/${orderId}`);
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Client;