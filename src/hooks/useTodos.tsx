import { type Todo } from "@prisma/client";
import { api } from "~/utils/api";

export const useTodos = () => {
  const utils = api.useContext();

  const addTodo = api.todos.createTodo.useMutation({
    async onMutate(newTodo) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.todos.getAllTodos.cancel();

      // Get the data from the queryCache
      const prevData = utils.todos.getAllTodos.getData();

      // Optimistically update the data with our new post
      utils.todos.getAllTodos.setData(
        undefined,
        (old) => [...(old as Todo[]), newTodo] as Todo[]
      );

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError(err, newPost, ctx) {
      // If the mutation fails, use the context-value from onMutate
      utils.todos.getAllTodos.setData(undefined, ctx?.prevData);
    },
    onSettled() {
      // Sync with server once mutation has settled
      void utils.todos.getAllTodos.invalidate();
    },
  });

  const deleteTodo = api.todos.deleteTodo.useMutation({
    async onMutate(deletedTodo) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.todos.getAllTodos.cancel();

      // Get the data from the queryCache
      const prevData = utils.todos.getAllTodos.getData();

      // Optimistically update the data with our new post
      utils.todos.getAllTodos.setData(undefined, (old) =>
        old?.filter((todo) => todo.id != deletedTodo.id)
      );

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError(err, newPost, ctx) {
      // If the mutation fails, use the context-value from onMutate
      utils.todos.getAllTodos.setData(undefined, ctx?.prevData);
    },
    onSettled() {
      // Sync with server once mutation has settled
      void utils.todos.getAllTodos.invalidate();
    },
  });

  const handleAddTodo = (recommendation: string) => {
    addTodo.mutate(
      {
        description: recommendation,
      },
      {
        onSuccess: () => console.log("Success!"),
      }
    );
  };

  const handleDeleteTodo = (todoId: string) => {
    deleteTodo.mutate(
      {
        id: todoId,
      },
      {
        onSuccess: () => console.log("Deleted"),
        onError: (error) => console.log(error),
      }
    );
  };

  return { handleAddTodo, handleDeleteTodo, addTodo };
};
