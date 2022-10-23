import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { McListItemType, McListType } from "../../../pages/Client/[orderId]";

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

  /**
   * Get order details also return its author object
   *
   * @param id
   *
   *
   * @example
   * ```ts
   * const order = await trpc.order.getOrderDetails({ id: "someOrderId" });
   * ```
   *
   *
   */
  getOrderDetails: publicProcedure
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

      if (response) {
        const notMergedDetails: McListType[] = response.orderSlices.map(
          (orderSlice) => {
            const parsed = JSON.parse(orderSlice.details) as McListType;
            return parsed;
          }
        );

        if (notMergedDetails.length === 1) {
          return notMergedDetails[0];
        }
        const mergedArray: McListItemType[] = [];

        const mergedDetails = ([] as McListType).concat(
          [],
          ...notMergedDetails
        );

        mergedDetails.forEach((item) => {
          const found = mergedArray.find(
            (helperItem) => helperItem.id === item.id
          );

          if (found) {
            found.quantity += item.quantity;
          } else {
            mergedArray.push(item);
          }
        });

        return mergedArray;
      }
    }),

  /**
   * Returns object with author as key and accumulated price of all items in all slices as value
   *
   * @params id - order id
   *
   * @example
   * ```ts
   * const response = await trpc.order.getAccumulatedPriceByAuthor({
   *   id: "someId"
   * });
   * ```
   */
  getAccumulatedPriceByAuthor: protectedProcedure
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

      if (response) {
        const authors: { [key: string]: number } = {};

        response.orderSlices.forEach((orderSlice) => {
          const OrderSliceAccumulatedPrice = JSON.parse(
            orderSlice.details
          ).reduce(
            (acc: number, curr: McListItemType) =>
              acc + curr.quantity * curr.price,
            0
          );
          if (authors[orderSlice.author.name]) {
            authors[orderSlice.author.name] += OrderSliceAccumulatedPrice;
          } else {
            authors[orderSlice.author.name] = OrderSliceAccumulatedPrice;
          }
        });

        return authors;
      }

      return {};
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
  createOrder: publicProcedure
    .input(
      z.object({
        name: z.string(),
        author: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentDate = new Date();
      return await ctx.prisma.order.create({
        data: {
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
