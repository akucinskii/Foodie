import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const restaurantRouter = router({
  createNewRestaurant: protectedProcedure
    .input(
      z.object({
        name: z.string().max(50),
        address: z.string().max(100),
        author: z.string().max(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.restaurant.create({
        data: {
          name: input.name,
          address: input.address,
          author: input.author,
        },
      });
      return response;
    }),

  getRestaurantById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.restaurant.findUnique({
        where: {
          id: input.id,
        },
      });
      return response;
    }),
});
