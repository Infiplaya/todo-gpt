import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  createTodo: publicProcedure
    .input(z.object({ description: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.todo.create({
        data: {
          description: input.description,
        },
      });
    }),

  deleteTodo: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.todo.delete({
        where: {
          id: input.id,
        },
      });
    }),

  getAllTodos: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany();
  }),
});
