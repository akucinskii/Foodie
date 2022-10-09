import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="absolute top-20 text-xl md:text-3xl">
        Welcome to solve<span className="text-yellow-500">M</span>c App
      </h1>
      <h2 className="text-lg text-yellow-500">Tutorial</h2>
      <h2 className="text-lg font-bold">
        {" "}
        You want Mcdonalds (You have to create the list)
      </h2>
      <h3>
        <p>
          1. Click on <span>New order</span>
        </p>
        <p>2. Enter your name and Name of your order list</p>
        <p>3. Click on button to submit</p>
        <p>
          4. Done, your order has been created. follow next steps to add your
          products
        </p>
      </h3>
      <h2 className="text-lg font-bold">
        You want your macdonalds (Today&apos;s List has been already created)
      </h2>
      <p>
        1. Click on <span className="underline">All orders on the navbar</span>
      </p>
      <p>2. Select todays order</p>
      <p>3. Add items you want</p>
      <p>4. Click submit and you are done</p>
    </>
  );
};

export default Home;
