import { createRouter } from "./context";
import { z } from "zod";
import { McListItemType, McListType } from "../../pages/Client/[orderId]";
import { OrderSlice } from "@prisma/client";
import dayjs from "dayjs";

export const orderRouter = createRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("getAllOrders", {
    async resolve({ ctx }) {
      return await ctx.prisma.order.findMany();
    },
  })
  .query("getAllTodayOrders", {
    async resolve({ ctx }) {
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
    },
  })
  .query("getAllOrderSlices", {
    async resolve({ ctx }) {
      return await ctx.prisma.orderSlice.findMany();
    },
  })
  .query("getOrderSlicesByOrderId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.orderSlice.findMany({
        where: {
          orderId: input.id,
        },
      });
    },
  })
  .query("getOrderDetails", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
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

        if (notMergedDetails[0]) {
          const mergedDetails = notMergedDetails[0].concat(...notMergedDetails);

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
      }
    },
  })
  .query("getOrderSlicesAuthors", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
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
    },
  })
  .mutation("createOrderSlice", {
    input: z.object({
      details: z.string(),
      orderId: z.string(),
      author: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.orderSlice.create({
        data: {
          details: input.details,
          orderId: input.orderId,
          author: input.author,
        },
      });
    },
  })
  .mutation("updateOrderSlice", {
    input: z.object({
      id: z.string(),
      details: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.orderSlice.update({
        where: {
          id: input.id,
        },
        data: {
          details: input.details,
        },
      });
    },
  })
  .mutation("deleteOrderSlice", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.orderSlice.delete({
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation("createOrder", {
    input: z.object({
      name: z.string(),
      author: z.string(),
    }),
    async resolve({ ctx, input }) {
      const currentDate = new Date();

      return await ctx.prisma.order.create({
        data: {
          author: input.author,
          name: input.name,
          createdAt: currentDate,
        },
      });
    },
  })
  .mutation("removeOrder", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.order.delete({
        where: {
          id: input.id,
        },
      });
    },
  });
