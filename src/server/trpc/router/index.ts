// src/server/router/index.ts

import { orderRouter } from "./order";
import { authRouter } from "./auth";
import { router } from "../trpc";
import { userRouter } from "./user";
import { healthcheckRouter } from "./healthcheck";
import { orderSliceRouter } from "./orderSlice";

export const appRouter = router({
  auth: authRouter,
  order: orderRouter,
  user: userRouter,
  orderSlice: orderSliceRouter,
  healthcheck: healthcheckRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
