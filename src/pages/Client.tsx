import React, { useEffect } from "react";
import Button from "../components/Button";
import { McList } from "../utils/McList";

type McListType = typeof McList;
type McListItemType = typeof McList[number];

const Client = () => {
  const [McListState, setMcListState] = React.useState<McListType>(McList);
  const [order, setOrder] = React.useState<McListItemType[]>([]);
  const [total, setTotal] = React.useState<number>(0);

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
        {item.name} {item.quantity}
      </div>
    );
  });
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div className="flex max-w-sm flex-col justify-center gap-2">
        {Form}
        <Button
          color="blue"
          onClick={() => {
            console.log(order);
          }}
        >
          Submit
        </Button>
      </div>
      <div className="flex flex-col bg-slate-400 p-4">
        {order.map((item) => {
          return (
            <div className="flex gap-2" key={item.id}>
              {item.name} - {item.quantity}
            </div>
          );
        })}
        <div className="h-full" />
        <div className="bg-slate-500">Total {total}</div>
      </div>
    </div>
  );
};

export default Client;
