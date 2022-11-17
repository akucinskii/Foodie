import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const orderRouter = router({
  /**
   * Healthcheck. If this fails, everything else will also fail.
   *
   * @returns {string} "ok"
   *
   * @example
   * ```ts
   * const response = await trpc.order.healthcheck();
   * ```
   */
  healthcheck: publicProcedure.query(() => {
    return {
      message: "ok",
    };
  }),

  /**
   * Get all orders
   *
   * @returns order object Array
   *
   * @example
   * ```ts
   * const orders = await trpc.order.getAllOrders();
   * ```
   */
  getAllOrders: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.order.findMany();
  }),

  /**
   * Get new date then set the hour to 00:00:00,
   * Then return all orders from that date
   *
   * @example
   * ```ts
   * const orders = await trpc.order.getOrdersByDate();
   * ```
   */
  getAllTodayOrders: publicProcedure.query(async ({ ctx }) => {
    const dateAsNumber = new Date().setHours(0, 0, 0, 0);
    const beginningOfToday = new Date(dateAsNumber);

    const response = await ctx.prisma.order.findMany({
      where: {
        createdAt: {
          gte: beginningOfToday,
        },
      },
    });

    return response;
  }),

  getOrderById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.order.findUnique({
        where: {
          id: input.id,
        },
        include: {
          orderSlices: {
            include: {
              author: true,
              OrderItem: {
                include: {
                  RestaurantMenuItem: true,
                },
                orderBy: {
                  quantity: "desc",
                },
              },
            },
          },
          Restaurant: {
            include: {
              RestaurantMenuItem: true,
            },
          },
        },
      });

      return response;
    }),

  /**
   * Creates a new order
   * Author should be taken from next-auth session user
   *
   * @param  {string} name - order name
   * @param {string} author - order author
   *
   * @example
   * ```ts
   * const response = await trpc.order.createOrder({
   *  name: "someName",
   * author: "someAuthor",
   * })
   */
  createOrder: protectedProcedure
    .input(
      z.object({
        name: z.string().max(50),
        author: z.string(),
        restaurantId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentDate = new Date();
      return await ctx.prisma.order.create({
        data: {
          restaurantId: input.restaurantId,
          name: input.name,
          authorId: input.author,
          createdAt: currentDate,
        },
      });
    }),

  /**
   * Deletes order by provided id
   *
   * @param {string} id - order id
   *
   * @example
   * ```ts
   * const mutation = trpc.order.removeOrder.useMutation()
   *
   * mutation.mutateAsync({
   *    id: "1",
   * });
   * ```
   *
   */
  removeOrder: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.order.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
