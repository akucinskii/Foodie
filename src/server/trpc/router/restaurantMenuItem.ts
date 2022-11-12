import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const restaurantMenuItemRouter = router({
  createNewRestaurantMenuItem: protectedProcedure
    .input(
      z.object({
        name: z.string().max(50),
        price: z.number().min(1).max(50),
        restaurantId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.restaurantMenuItem.create({
        data: {
          name: input.name,
          price: input.price,
          restaurantId: input.restaurantId,
        },
      });
      return response;
    }),

  createMultipleRestaurantMenuItems: protectedProcedure
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
      const response = await ctx.prisma.restaurantMenuItem.createMany({
        data: input.items,
      });
      return response;
    }),

  getRestaurantMenuItemById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.restaurantMenuItem.findUnique({
        where: {
          id: input.id,
        },
      });
      return response;
    }),

  getRestaurantMenuItemsByRestaurantId: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.restaurantMenuItem.findMany({
        where: {
          restaurantId: input.restaurantId,
        },
      });
      return response;
    }),

  getRestaurantMenuItemsByRestaurantName: protectedProcedure
    .input(
      z.object({
        restaurantName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.restaurantMenuItem.findMany({
        where: {
          Restaurant: {
            name: input.restaurantName,
          },
        },
      });
      return response;
    }),
});
