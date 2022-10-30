import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const restaurantItemRouter = router({
  createNewRestaurantItem: protectedProcedure
    .input(
      z.object({
        name: z.string().max(50),
        price: z.number().min(1).max(50),
        restaurantId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.restaurantItem.create({
        data: {
          name: input.name,
          price: input.price,
          restaurantId: input.restaurantId,
        },
      });
      return response;
    }),

  createMultipleRestaurantItems: protectedProcedure
    .input(
      z.object({
        items: z
          .object({
            name: z.string().max(50),
            price: z.number().min(1).max(50),
            restaurantId: z.string(),
          })
          .array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.restaurantItem.createMany({
        data: input.items,
      });
      return response;
    }),

  getRestaurantItemById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.restaurantItem.findUnique({
        where: {
          id: input.id,
        },
      });
      return response;
    }),

  getRestaurantItemsByRestaurantId: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.restaurantItem.findMany({
        where: {
          restaurantId: input.restaurantId,
        },
      });
      return response;
    }),
});
