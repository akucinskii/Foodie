import { connect } from "http2";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const restaurantMenuItemRouter = router({
  createNewRestaurantMenuItem: protectedProcedure
    .input(
      z.object({
        name: z.string().max(50),
        price: z.number().min(1).max(50),
        restaurantId: z.string(),
        image: z.string().optional(),
        categoryId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.restaurantMenuItem.create({
        data: {
          name: input.name,
          price: input.price,
          restaurantId: input.restaurantId,
          image: input.image,
          Category: {
            connect: {
              id: input.categoryId,
            },
          },
        },
      });
      return response;
    }),

  updateRestaurantMenuItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().max(50).optional(),
        price: z.number().min(1).max(50).optional(),
        image: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.restaurantMenuItem.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          price: input.price,
          image: input.image,
          Category: {
            connect: {
              id: input.category,
            },
          },
        },
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
        include: {
          Category: true,
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
        include: {
          Category: true,
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
        include: {
          Category: true,
        },
      });
      return response;
    }),
});
