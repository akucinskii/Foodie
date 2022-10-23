import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { McListItemType, McListType } from "../../../pages/Client/[orderId]";

export const orderRouter = router({
  healthcheck: publicProcedure.query(() => {
    return {
      message: "ok",
    };
  }),

  getAllOrders: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.order.findMany();
  }),

  /**
   * Get new date then set the hour to 00:00:00,
   * Then return all orders from that date
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

  /// TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT

  deleteOrderSlice: publicProcedure
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
