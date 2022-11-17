import type { NextPage } from "next";
import MainPageHero from "src/components/HomePage/Hero/MainPageHero";

const Home: NextPage = () => {
  return (
    <div className="grid w-full place-items-center items-end">
      <MainPageHero />
    </div>
  );
};

export default Home;
