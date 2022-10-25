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
      });

      if (!response) {
        throw new Error("OrderSlice not found");
      }

      const formattedDetails = {
        ...response,
        details: JSON.parse(response.details || "{}"),
      };
      return formattedDetails;
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
        },
      });

      const formattedDetails = response.map(
        (item: typeof response[number]) => ({
          ...item,
          details: JSON.parse(item.details),
        })
      );

      return formattedDetails;
    }),

  /**
   * Creates new orderSlice
   *
   * details must be  provided as string of json object.
   *
   * @param {string} orderId - id of order (the bigger one)
   * @param {string} details - string of json object
   * @param {string} author - id of user creating orderSlice
   *
   * @example
   * ```ts
   * const orderSlice = {
   *    "id": "1",
   *    "name": "McChicken",
   *    "price": 5,
   *    "quantity": 1
   * }
   * const orderSliceAsJson = JSON.stringify(orderSlice);
   * const mutation = trpc.order.createOrderSlice.useMutation()
   *
   * mutation.mutateAsync({
   *    orderId: "1",
   *    details: orderSliceAsJson,
   *    author: "Example author",
   * });
   * ```
   */
  createOrderSlice: protectedProcedure
    .input(
      z.object({
        details: z.string(),
        orderId: z.string(),
        author: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.orderSlice.create({
        data: {
          details: input.details,
          orderId: input.orderId,
          authorId: input.author,
        },
      });
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
        details: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.orderSlice.update({
        where: {
          id: input.id,
        },
        data: {
          details: input.details,
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
