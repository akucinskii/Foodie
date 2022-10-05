import { createRouter } from "./context";
import { z } from "zod";
import { McListItemType, McListType } from "../../pages/Client/[orderId]";
import { OrderSlice } from "@prisma/client";

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
  .query("getAllOrderSlices", {
    async resolve({ ctx }) {
      return await ctx.prisma.orderSlice.findMany();
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
  .mutation("createOrderSlice", {
    input: z.object({
      details: z.string(),
      orderId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.orderSlice.create({
        data: {
          details: input.details,
          orderId: input.orderId,
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
  });
