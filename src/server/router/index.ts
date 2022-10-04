// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { orderRouter } from "./order";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("order.", orderRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
