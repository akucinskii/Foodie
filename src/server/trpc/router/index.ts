// src/server/router/index.ts

import { orderRouter } from "./order";
import { authRouter } from "./auth";
import { router } from "../trpc";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  order: orderRouter,
  user: userRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
