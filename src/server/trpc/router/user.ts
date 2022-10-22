import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  /**
   * Get all users
   * @returns user object Array\
   * @example
   * ```ts
   * const users = await trpc.user.getAllUsers();
   * ```
   */
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),
  /**
   * get User details (name, email, image, etc)
   * @param {String} userId
   * @returns user Object
   * @example
   * ```ts
   * const user = await trpc.user.getUserById("userId");
   * ```
   */
  getUserById: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      });
      return response;
    }),
  /**
   * Gets all orderSlices of a User in a given Order
   *
   * @param {string}userId
   * @param {string}orderId
   * @returns User Object with orderSlices
   * @returns null if user is not in order or order does not exist
   *
   * @example
   * ```ts
   * const user = await trpc.user.getUserOrderSlices("userId", "orderId");
   * ```
   */
  getSingleUserByIdWithOrderSlices: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        orderId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        include: {
          OrderSlice: {
            where: {
              orderId: input.orderId,
            },
          },
        },
      });
      return response;
    }),

  /**
   * Update a user by id
   * @param {string} userId
   * @param {string} name
   * @param {string} email
   * @param {string} image
   * @returns updated user object
   * @example
   * ```ts
   * const user = await trpc.user.updateUserById("userId", "name", "email", "image");
   * ```
   */
  updateUserById: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        user: z.object({
          name: z.string(),
          email: z.string(),
          image: z.string().nullable(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          name: input.user.name,
          email: input.user.email,
          image: input.user.image,
        },
      });
      return response;
    }),
});
