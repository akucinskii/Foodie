import Image from "next/image";
import Link from "next/link";
import React from "react";
import Wrapper from "src/components/Wrapper/Wrapper";
import { trpc } from "src/utils/trpc";

const restaurants = () => {
  const restaurants = trpc.restaurant.getAllRestaurants.useQuery();
  return (
    <Wrapper>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {restaurants.data?.map((restaurant) => (
            <Link
              href={`/restaurant/menu/${restaurant.id}`}
              className="group"
              key={restaurant.id}
            >
              <div className="aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8 w-full overflow-hidden rounded-lg bg-gray-200">
                <Image
                  src={
                    restaurant.image
                      ? restaurant.image
                      : "/restaurantPlaceholder.jpg"
                  }
                  width="300"
                  height="300"
                  alt={restaurant.name}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
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
        </div>
      </div>
    </Wrapper>
  );
};

export default restaurants;
