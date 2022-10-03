import React from "react";
import { McList } from "../utils/McList";

type McListType = typeof McList;
type McListItemType = typeof McList[number];

const Client = () => {
  const [McListState, setMcListState] = React.useState<McListType>(McList);
  const [order, setOrder] = React.useState<McListItemType[]>([]);

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

    console.log(order);
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
      <div key={item.id}>
        <button
          onClick={() => {
            addToOrder(item);
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            removeFromOrder(item);
          }}
        >
          -
        </button>
        {item.name} {item.quantity}
      </div>
    );
  });
  return <div>{Form}</div>;
};

export default Client;
