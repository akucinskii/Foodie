// src/server/router/index.ts

import { orderRouter } from "./order";
import { authRouter } from "./auth";
import { router } from "../trpc";

export const appRouter = router({
  auth: authRouter,
  order: orderRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
