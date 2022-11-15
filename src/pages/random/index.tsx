import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import Button from "src/components/Button/Button";
import Wrapper from "src/components/Wrapper/Wrapper";
import { trpc } from "src/utils/trpc";

const RandomNumber = () => {
  const [max, setMax] = useState(10);
  const [clicked, setClicked] = useState(false);
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const lastNumbers = trpc.randomNumber.getLastNumbers.useQuery();

  useEffect(() => {
    const today = new Date();
    if (localStorage.getItem("clicked")) {
      const clickedDate = new Date(
        parseInt(localStorage.getItem("clicked") || "0")
      );
      if (clickedDate.getDate() !== today.getDate()) {
        setClicked(false);
      } else {
        setClicked(true);
      }
    }
  }, []);

  const generateRandomNumber =
    trpc.randomNumber.generateRandomNumber.useMutation({
      onSuccess: () => {
        lastNumbers.refetch();
      },
      onError: () => {
        setError("Number that you provided is way too big.");
      },
    });
  return (
    <Wrapper>
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-center text-xl font-bold">
          Random number generator
        </h2>
        <p className="text-center">
          Generate random number between 1 and your number (default 10) <br />
          Numbers are being logged so its harder to cheat {":)"}
        </p>
        <p>Last generated number: </p>
        <h2 className="text-6xl font-bold md:text-8xl">
          {lastNumbers.data?.[0] && lastNumbers.data?.[0].number}
        </h2>
        <div>
          <label className="label">
            <span className="label-text">Enter maximum</span>
          </label>

          <input
            className="input input-bordered w-full"
            value={max}
            type="number"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const number = parseInt(e.target.value);
              setMax(number);
            }}
          ></input>
          {error && <p className="text-red-600">{error}</p>}
        </div>

        <Button
          disabled={clicked}
          onClick={async () => {
            setClicked(true);
            const random = await generateRandomNumber.mutateAsync({
              min: 1,
              max,
              author: session?.user?.name || "Anonymous",
            });
            localStorage.setItem(
              "clicked",
              random.createdAt.getTime().toString()
            );
          }}
        >
          Generate
        </Button>
        <ul className="table-compact table">
          {lastNumbers.data?.map((number) => (
            <li key={number.id} className="border-b">
              {number.number} -{" "}
              {new Intl.DateTimeFormat("en-GB", {
                dateStyle: "full",
                timeStyle: "long",
              }).format(number.createdAt)}{" "}
              - Created by {number.author}
            </li>
          ))}
        </ul>
      </div>
    </Wrapper>
  );
};

export default RandomNumber;
