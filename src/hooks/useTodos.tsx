import { type Todo } from "@prisma/client";
import { api } from "~/utils/api";
import { useToast } from "./useToast";

export const useTodos = () => {
  const utils = api.useContext();

  const { toast } = useToast();

  const addTodo = api.todos.createTodo.useMutation({
    async onMutate(newTodo) {
      await utils.todos.getAllTodos.cancel();

      const prevData = utils.todos.getAllTodos.getData();

      utils.todos.getAllTodos.setData(
        undefined,
        (old) => [...(old as Todo[]), newTodo] as Todo[]
      );

      return { prevData };
    },
    onError(err, newPost, ctx) {
      utils.todos.getAllTodos.setData(undefined, ctx?.prevData);
    },
    onSettled() {
      void utils.todos.getAllTodos.invalidate();
    },
  });

  const completeTodo = api.todos.completeTodo.useMutation({
    async onMutate(completeTodo) {
      await utils.todos.getAllTodos.cancel();

      const prevData = utils.todos.getAllTodos.getData();

      utils.todos.getAllTodos.setData(
        undefined,
        (old) => [...(old as Todo[]), completeTodo] as Todo[]
      );

      return { prevData };
    },
    onError(err, newPost, ctx) {
      utils.todos.getAllTodos.setData(undefined, ctx?.prevData);
    },
    onSettled() {
      void utils.todos.getAllTodos.invalidate();
    },
  });

  const deleteTodo = api.todos.deleteTodo.useMutation({
    async onMutate(deletedTodo) {
      await utils.todos.getAllTodos.cancel();

      const prevData = utils.todos.getAllTodos.getData();

      utils.todos.getAllTodos.setData(undefined, (old) =>
        old?.filter((todo) => todo.id != deletedTodo.id)
      );

      return { prevData };
    },
    onError(err, newPost, ctx) {
      utils.todos.getAllTodos.setData(undefined, ctx?.prevData);
    },
    onSettled() {
      void utils.todos.getAllTodos.invalidate();
    },
  });

  const handleAddTodo = (recommendation: string) => {
    addTodo.mutate(
      {
        description: recommendation,
      },
      {
        onSuccess: () =>
          toast({
            title: "Add Todo",
            description: "AI generated todo added to your list!",
          }),
      }
    );
  };

  const handleDeleteTodo = (todoId: string) => {
    deleteTodo.mutate(
      {
        id: todoId,
      },
      {
        onSuccess: () =>
          toast({
            title: "Delete Todo",
            description: "Todo succesfully deleted from your list!",
            variant: "destructive",
          }),
        onError: (error) => console.log(error),
      }
    );
  };

  const handleCompleteTodo = (todoId: string, completed: boolean) => {
    completeTodo.mutate(
      {
        todoId: todoId,
        completed: !completed,
      },
      {
        onSuccess: () => console.log("Todo updated"),
        onError: (error) => console.log(error),
      }
    );
  };

  return { handleAddTodo, handleDeleteTodo, handleCompleteTodo, addTodo };
};
