import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { McListType } from "../../../pages/Client/[orderId]";

export const orderSliceRouter = router({
  getAllOrderSlices: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.orderSlice.findMany();
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
      return response;
    }),

  /**
   * Merges order slices with the same author in order.
   * Then sums all items with the same id.
   *
   * @param id
   * @example
   * ```ts
   * const orderSlices = await trpc.orderSlice.getMergedItemsAndAuthorByOrderId({ id: "123" });
   * ```
   */
  getMergedItemsAndAuthorByOrderId: protectedProcedure
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
            },
          },
        },
      });

      if (response && response.orderSlices) {
        const notMergedDetails = response.orderSlices.map((orderSlice) => {
          const parsed = JSON.parse(orderSlice.details) as McListType;
          return { ...orderSlice, details: parsed };
        });

        const mergedArray = [] as typeof notMergedDetails;

        notMergedDetails.forEach((item) => {
          const found = mergedArray.find(
            (helperItem) => helperItem.author.id === item.author.id
          );

          if (found) {
            found.details = ([] as McListType).concat(
              [],
              found.details,
              item.details
            );
          } else {
            mergedArray.push(item);
          }
        });

        const mergedArrayWithMergedDetails = [] as typeof notMergedDetails;
        mergedArray.forEach((item) => {
          const mergedDetails = [] as McListType;

          item.details.forEach((detail) => {
            const found = mergedDetails.find(
              (helperItem) => helperItem.id === detail.id
            );

            if (found) {
              found.quantity += detail.quantity;
            } else {
              mergedDetails.push(detail);
            }
          });

          mergedArrayWithMergedDetails.push({
            ...item,
            details: mergedDetails,
          });
        });

        return mergedArrayWithMergedDetails;
      }

      return [];
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
