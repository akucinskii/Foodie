import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const randomNumberRouter = router({
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

  getLastNumbers: publicProcedure.query(async ({ ctx }) => {
    const response = await ctx.prisma.randomNumber.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });
    return response;
  }),

  generateRandomNumber: publicProcedure
    .input(
      z.object({
        min: z.number().default(1),
        max: z.number().max(10000),
        author: z.string().max(255),
      })
    )
    .mutation(({ ctx, input }) => {
      const randomNumber =
        Math.floor(Math.random() * (input.max - input.min + 1)) + input.min;

      return ctx.prisma.randomNumber.create({
        data: {
          number: randomNumber,
          author: input.author,
        },
      });
    }),
});
