import { Flower, XIcon } from "lucide-react";
import { useState } from "react";
import { useGenerateRecommendation } from "~/hooks/useGenerateRecommendation";
import { useToast } from "~/hooks/useToast";
import { useTodos } from "~/hooks/useTodos";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export const Todos = () => {
  const { data } = api.todos.getAllTodos.useQuery();

  const [parent] = useAutoAnimate();

  const { generatedRecommendation, getTodoRecommendation } =
    useGenerateRecommendation();

  const { handleAddTodo, handleDeleteTodo } = useTodos();

  const { toast } = useToast();

  return (
    <div className="my-20 w-full px-8">
      <CreateTodo />
      <div className="mt-10 flex gap-3">
        <div className="flex-1 space-y-10" ref={parent}>
          {data?.map((todo) => (
            <div
              key={todo.id}
              className="flex flex-col justify-center gap-5 rounded-md border border-slate-200 p-5 shadow-md"
            >
              <p>{todo.description}</p>
              <div className="flex space-x-3">
                <Button
                  onClick={(e) =>
                    void getTodoRecommendation(e, todo.description)
                  }
                  variant={"outline"}
                  className="flex gap-2 text-xs uppercase"
                >
                  <Flower className="h-5 w-5 text-slate-700" />
                  AI
                </Button>
                <Button
                  onClick={() => {
                    handleDeleteTodo(todo.id);
                    toast({
                      title: "Delete Todo",
                      description: "This Todo was deleted from your list!",
                      variant: "destructive",
                    });
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
                        toast({
                          title: "Add Todo",
                          description: "AI generated todo added to your list!",
                        });
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
        onSuccess: () => console.log("Success!"),
      }
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <label htmlFor="description" className="text-2xl font-semibold">
        Add Todo
      </label>
      <Textarea
        name="description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button
        onClick={() => {
          handleAddTodo();
          toast({
            title: "Add Todo",
            description: "AI generated todo added to your list!",
          });
        }}
        className="self-end"
      >
        Add Todo
      </Button>
    </div>
  );
};
