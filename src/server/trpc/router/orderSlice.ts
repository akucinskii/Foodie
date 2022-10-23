import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { McListItemType, McListType } from "../../../pages/Client/[orderId]";

export const orderSliceRouter = router({
  getAllOrderSlices: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.orderSlice.findMany();
  }),

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

  getOrderSlicesByAuthors: protectedProcedure
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
        console.log("NOT MERGED DETAILS", notMergedDetails);

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
        console.log("MERGED ARRAY", mergedArrayWithMergedDetails);

        return mergedArrayWithMergedDetails;
      }

      return [];
    }),

  getOrderSlicesAuthors: protectedProcedure
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
});
