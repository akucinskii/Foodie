import { publicProcedure, router } from "../trpc";

export const healthcheckRouter = router({
  /**
   * Healthcheck route
   *
   * @returns {Object} message
   *
   * @example
   * ```ts
   * const response = await trpc.healthcheck.healthcheck();
   * ```
   */
  healthcheck: publicProcedure.query(() => {
    return {
      message: "ok",
    };
  }),
});
