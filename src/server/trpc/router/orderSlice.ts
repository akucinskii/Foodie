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

      interface FormattedDetails
        extends Omit<typeof response[number], "details"> {
        details: {
          id: string;
          name: string;
          quantity: number;
          price: number;
        }[];
      }

      const formattedDetails: FormattedDetails[] = response.map(
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
   *
   *
   * @param {string} orderId - uuid of order (the bigger one)
   * @param {object
   *  {
   *   name: string,
   *  quantity: number,
   * price: number,
   * }[]} details - details of orderSlice
   *
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
        details: z
          .object({
            id: z.string(),
            name: z.string().max(100),
            price: z.number().min(1).max(50),
            quantity: z.number().min(1).max(20),
          })
          .array(),
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

      const details = JSON.stringify(input.details);

      const response = await ctx.prisma.orderSlice.create({
        data: {
          details,
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
        details: z
          .object({
            id: z.string(),
            name: z.string().max(100),
            price: z.number().min(1).max(50),
            quantity: z.number().min(1).max(20),
          })
          .array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const details = JSON.stringify(input.details);

      return await ctx.prisma.orderSlice.update({
        where: {
          id: input.id,
        },
        data: {
          details,
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
