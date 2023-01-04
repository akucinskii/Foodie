import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const restaurantRouter = router({
  createNewRestaurant: protectedProcedure
    .input(
      z.object({
        name: z.string().max(50),
        address: z.string().max(100),
        author: z.string().max(50),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.restaurant.create({
        data: {
          name: input.name,
          address: input.address,
          author: input.author,
          image: input.image,
        },
      });
      return response;
    }),
  getAllRestaurants: publicProcedure
    .input(
      z.object({
        page: z.number().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.restaurant.findMany({
        include: {
          RestaurantMenuItem: true,
        },
        skip: (input.page - 1) * 10,
      });
      return response;
    }),

  getPreviewRestaurants: publicProcedure.query(async ({ ctx }) => {
    const response = await ctx.prisma.restaurant.findMany({
      include: {
        RestaurantMenuItem: true,
      },
      take: 3,
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
        include: {
          RestaurantMenuItem: true,
        },
      });
      return response;
    }),

  getMostPopularRestaurants: publicProcedure.query(async ({ ctx }) => {
    const response = await ctx.prisma.restaurant.findMany({
      include: {
        _count: {
          select: {
            Order: true,
          },
        },
      },
    });

    const sorted = response.sort((a, b) => {
      return b._count.Order - a._count.Order;
    });

    const topThree = sorted.slice(0, 3);

    return topThree;
  }),

  removeRestaurantById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.restaurant.delete({
        where: {
          id: input.id,
        },
      });
      return response;
    }),
});
