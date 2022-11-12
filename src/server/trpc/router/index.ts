// src/server/router/index.ts

import { orderRouter } from "./order";
import { authRouter } from "./auth";
import { router } from "../trpc";
import { userRouter } from "./user";
import { healthcheckRouter } from "./healthcheck";
import { orderSliceRouter } from "./orderSlice";
import { randomNumberRouter } from "./randomNumber";
import { restaurantRouter } from "./restaurant";
import { restaurantMenuItemRouter } from "./restaurantMenuItem";
import { orderItemRouter } from "./orderItem";

export const appRouter = router({
  auth: authRouter,
  order: orderRouter,
  user: userRouter,
  orderSlice: orderSliceRouter,
  orderItem: orderItemRouter,
  healthcheck: healthcheckRouter,
  randomNumber: randomNumberRouter,
  restaurant: restaurantRouter,
  restaurantMenuItem: restaurantMenuItemRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
