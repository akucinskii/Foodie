import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>SolveMc App</title>
        <meta
          name="description"
          content="App made to make ordering food easier :tf:"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="absolute top-20 text-xl md:text-3xl">
        Welcome to solve<span className="text-yellow-500">M</span>c App
      </h1>
      <div>
        <h2 className="text-center text-lg font-bold text-yellow-500">
          Tutorial
        </h2>

        <ol className="list-decimal">
          <li>Login first</li>
          <li>
            Click on <span className="underline">All orders</span> on the navbar
          </li>

          <li> Select newest Order</li>
          <li> Add items that you want</li>
          <li> Click submit and you are Done</li>
        </ol>
      </div>
    </>
  );
};

export default Home;
