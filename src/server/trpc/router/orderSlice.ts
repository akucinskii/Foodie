import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const orderSliceRouter = router({
  getAllOrderSlices: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.orderSlice.findMany();
  }),

  /**
   * Get a single order slice by id
   *
   * @param id The id of the order slice to get
   *
   * @returns The order slice
   *
   * @throws 404 if the order slice is not found
   *
   * @example
   * ```ts
   * const orderSlice = await trpc.orderSlice.getOrderSlice({ id: "1" });
   * ```
   */
  getOrderSliceById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.orderSlice.findUnique({
        where: {
          id: input.id,
        },
        include: {
          OrderItem: {
            include: {
              RestaurantMenuItem: true,
            },
          },
        },
      });

      if (!response) {
        throw new Error("OrderSlice not found");
      }

      return response;
    }),

  /**
   * Return all order slices from a specific order
   *
   * @param orderId
   *
   * @returns OrderSlice[]
   *
   * @example
   * ```ts
   * const orderSlices = await trpc.orderSlice.getOrderSlicesByOrderId({
   *  orderId: "someOrderId",
   * })
   *
   * ```
   */
  getOrderSlicesByOrderId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.orderSlice.findMany({
        where: {
          orderId: input.id,
        },
        include: {
          author: true,
          OrderItem: {
            include: {
              RestaurantMenuItem: true,
            },
          },
        },
      });

      return response;
    }),

  /**
   * Creates new orderSlice
   *
   *
   *
   * @param {string} orderId - uuid of order (the bigger one)
   * @param {string} author - uuid of user creating orderSlice
   *
   * @example
   * ```ts
   * const orderSlice = {
   *    id: "1",
   *    name: "McChicken",
   *    price: 5,
   *    quantity: 1
   * }
   *
   * const mutation = trpc.order.createOrderSlice.useMutation()
   *
   * mutation.mutateAsync({
   *    orderId: "123-123-123",
   *    details: orderSlice,
   *    author: "123-123-123",
   * });
   * ```
   */
  createOrderSlice: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        author: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const check = await ctx.prisma.orderSlice.findFirst({
        where: {
          orderId: input.orderId,
          authorId: input.author,
        },
      });

      if (check) {
        throw new Error("You have already created order slice for this order");
      }

      const response = await ctx.prisma.orderSlice.create({
        data: {
          orderId: input.orderId,
          authorId: input.author,
        },
      });

      return response;
    }),

  /**
   * Updates orderSlice with details provided as string of json object.
   * @returns {Promise<Prisma.OrderSlice>}OrderSlice
   * @param {string} id
   * @param {string} data
   *
   *
   * @example
   * ```ts
   *
   * const mutation = trpc.order.updateOrderSlice.useMutation()
   *
   * mutation.mutateAsync({
   *    orderId: "1",
   *    details: orderSliceAsJson,
   * });
   * ```
   *
   *
   */
  updateOrderSlice: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        orderItemsArray: z.array(z.any()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.orderSlice.update({
        where: {
          id: input.id,
        },
        data: {
          OrderItem: {
            connect: input.orderItemsArray.map((item) => ({
              id: item.id,
            })),
          },
        },
      });
    }),

  /**
   * Deletes orderSlice
   * @param {string} id
   *
   * @example
   * ```ts
   * const mutation = trpc.order.deleteOrderSlice.useMutation()
   *
   * mutation.mutateAsync({
   *  id: "1",
   * })
   * ```
   */
  deleteOrderSlice: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.orderSlice.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
