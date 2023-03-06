import { Flower, XIcon } from "lucide-react";
import { useState } from "react";
import { useGenerateRecommendation } from "~/hooks/useGenerateRecommendation";
import { useToast } from "~/hooks/useToast";
import { useTodos } from "~/hooks/useTodos";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import clsx from "clsx";
import { Input } from "./ui/input";

export const Todos = () => {
  const { data } = api.todos.getAllTodos.useQuery();

  const [parent] = useAutoAnimate();

  const { generatedRecommendation, getTodoRecommendation } =
    useGenerateRecommendation();

  const { handleAddTodo, handleDeleteTodo, handleCompleteTodo } = useTodos();

  console.log(data);

  return (
    <div className="my-20 w-full px-8">
      <CreateTodo />
      <div className="mt-10 flex gap-3">
        <div className="flex-1 space-y-10" ref={parent}>
          {data?.map((todo) => (
            <div
              key={todo.id}
              className="flex flex-col justify-center gap-5 rounded-md border border-slate-200 p-5 shadow-md transition-colors"
            >
              <p
                className={clsx(
                  todo.completed && "text-slate-500 line-through"
                )}
              >
                {todo.description}
              </p>
              <div className="flex items-center space-x-3">
                <Button
                  variant={"outline"}
                  onClick={() => handleCompleteTodo(todo.id, todo.completed)}
                  className={
                    "flex h-8 w-8 items-center justify-center rounded-full"
                  }
                >
                  {todo.completed ? "✔️" : null}
                </Button>

                <Button
                  onClick={(e) =>
                    void getTodoRecommendation(e, todo.description)
                  }
                  variant={"subtle"}
                  className="flex gap-2 text-xs uppercase"
                >
                  <Flower className="h-5 w-5 text-slate-700" />
                  AI
                </Button>
                <Button
                  onClick={() => {
                    handleDeleteTodo(todo.id);
                  }}
                  className="text-xs uppercase"
                  variant={"destructive"}
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 space-y-10">
          {generatedRecommendation ? (
            <div>
              {generatedRecommendation
                .substring(generatedRecommendation.indexOf("1") + 3)
                .split(/[2-3]\./)
                .map((recommendation) => (
                  <div
                    key={recommendation}
                    className="flex flex-col justify-center gap-5 rounded-md border border-slate-200 p-5 shadow-md"
                  >
                    <p>{recommendation}</p>
                    <Button
                      variant={"outline"}
                      className={"w-auto self-start text-xs uppercase"}
                      onClick={() => {
                        handleAddTodo(recommendation);
                      }}
                    >
                      Add Todo
                    </Button>
                  </div>
                ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const CreateTodo = () => {
  const [description, setDescription] = useState("");
  const { addTodo } = useTodos();

  const { toast } = useToast();

  const handleAddTodo = () => {
    addTodo.mutate(
      {
        description,
      },
      {
        onSuccess: () =>
          toast({
            title: "Add Todo",
            description: "Todo succesfully added to your list!",
          }),
      }
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <label htmlFor="description" className="text-2xl font-semibold">
        What needs to be done?
      </label>
      <Input
        name="description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button
        onClick={() => {
          handleAddTodo();
        }}
        className="self-end"
      >
        Add Todo
      </Button>
    </div>
  );
};
