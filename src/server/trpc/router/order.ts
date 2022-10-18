import { z } from "zod";

import { OrderSlice } from "@prisma/client";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { McListItemType, McListType } from "../../../pages/Client/[orderId]";

export const orderRouter = router({
  hello: publicProcedure
    .input(
      z
        .object({
          text: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAllOrders: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.order.findMany();
  }),
  getAllTodayOrders: publicProcedure.query(async ({ ctx }) => {
    let lastDay: string | number = Date.now() - 24 * 60 * 60 * 1000;
    lastDay = new Date(lastDay).toISOString();

    const response = await ctx.prisma.order.findMany({
      where: {
        createdAt: {
          gte: lastDay,
        },
      },
    });
    return response;
  }),
  getAllOrderSlices: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.orderSlice.findMany();
  }),
  getOrderSlicesByOrderId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.orderSlice.findMany({
        where: {
          orderId: input.id,
        },
      });
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
          orderSlices: true,
        },
      });

      if (response) {
        const notMergedDetails: McListType[] = response.orderSlices.map(
          (orderSlice: OrderSlice) => {
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
  getOrderSlicesAuthors: publicProcedure
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
          orderSlices: true,
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
          if (authors[orderSlice.author]) {
            authors[orderSlice.author] += OrderSliceAccumulatedPrice;
          } else {
            authors[orderSlice.author] = OrderSliceAccumulatedPrice;
          }
        });

        return authors;
      }

      return {};
    }),

  createOrderSlice: publicProcedure
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
          author: input.author,
        },
      });
    }),

  updateOrderSlice: publicProcedure
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
          author: input.author,
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
