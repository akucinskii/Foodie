import { createRouter } from "./context";
import { z } from "zod";
import moment from "moment";

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
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.order.findMany();
    },
  })
  .query("getAllToday", {
    async resolve({ ctx }) {
      const currentDate = moment(Date.now()).format("YYYY-MM-DD");

      return await ctx.prisma.order.findMany({
        where: {
          createdAt: currentDate,
        },
      });
    },
  })
  .mutation("create", {
    input: z.object({
      details: z.string(),
    }),
    async resolve({ ctx, input }) {
      const currentDate = moment(Date.now()).format("YYYY-MM-DD");

      return await ctx.prisma.order.create({
        data: {
          details: input.details,
          createdAt: currentDate,
        },
      });
    },
  });
