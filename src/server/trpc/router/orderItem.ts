import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const orderItemRouter = router({
  createOrderItem: protectedProcedure
    .input(
      z.object({
        quantity: z.number().min(1).max(50),
        restaurantMenuItemId: z.string(),
        orderSliceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.orderItem.create({
        data: {
          quantity: input.quantity,
          restaurantMenuItemId: input.restaurantMenuItemId,
          orderSliceId: input.orderSliceId,
        },
      });
      return response;
    }),

  updateOrderItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        quantity: z.number().min(1).max(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.orderItem.update({
        where: {
          id: input.id,
        },
        data: {
          quantity: input.quantity,
        },
      });
      return response;
    }),

  removeOrderItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.orderItem.delete({
        where: {
          id: input.id,
        },
      });
      return response;
    }),
});
