import Image from "next/image";
import Link from "next/link";
import React from "react";
import Wrapper from "src/components/Wrapper/Wrapper";
import { trpc } from "src/utils/trpc";

const restaurants = () => {
  const restaurants = trpc.restaurant.getAllRestaurants.useQuery({ page: 1 });
  return (
    <Wrapper>
      <h1 className="text-4xl font-bold text-base-content">Restaurants</h1>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {restaurants.data?.map((restaurant) => (
            <Link
              href={`/restaurant/menu/${restaurant.id}`}
              className="group"
              key={restaurant.id}
            >
              <div className="xl:aspect-w-7 xl:aspect-h-8 aspect-square w-full overflow-hidden rounded-lg border-primary-focus bg-gray-200 transition-all group-hover:border-4">
                <Image
                  src={
                    restaurant.image
                      ? restaurant.image
                      : "/restaurantPlaceholder.jpg"
                  }
                  width="300"
                  height="300"
                  alt={restaurant.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <h3 className="mt-4 text-lg font-medium text-base-content">
                {restaurant.name}
              </h3>
              <p className="mt-1 text-sm text-base-content">
                {restaurant.address}
              </p>
            </Link>
          ))}
          <Link href="/restaurant/newRestaurant" className="group">
            <div className="xl:aspect-w-7 xl:aspect-h-8 relative aspect-square w-full overflow-hidden rounded-lg border-primary-focus bg-black transition-all group-hover:border-4">
              <Image
                src={"/restaurantPlaceholder.jpg"}
                width="300"
                height="300"
                alt={"Add new restaurant"}
                className="h-full w-full object-cover object-center opacity-50 transition-all group-hover:opacity-25"
              />
              <div className="absolute inset-0">
                <div className="flex h-full flex-col items-center justify-center text-xl font-bold">
                  Add new restaurant
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="flex w-full justify-center"></div>
    </Wrapper>
  );
};

export default restaurants;
