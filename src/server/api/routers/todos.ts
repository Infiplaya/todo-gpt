import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

  completeTodo: publicProcedure
    .input(z.object({ todoId: z.string(), completed: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.todo.update({
        where: {
          id: input.todoId,
        },
        data: {
          completed: input.completed,
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
    return ctx.prisma.todo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
});
