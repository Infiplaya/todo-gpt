import { MouseEvent, useState } from "react";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export const Todos = () => {
  const { data } = api.todos.getAllTodos.useQuery();
  const [loading, setLoading] = useState(false);
  const [generatedRecommendation, setGeneratedRecommendation] = useState("");

  const deleteTodo = api.todos.deleteTodo.useMutation();

  const getTodoRecommendation = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    description: string
  ) => {
    const prompt = `Please give me 3 recommendations of similar Todos based on description provided: ${description}`;
    e.preventDefault();
    setGeneratedRecommendation("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedRecommendation((prev) => prev + chunkValue);
    }
    setLoading(false);
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

  return (
    <>
      <AddTodos />
      <div>
        Todos:
        {data?.map((todo) => (
          <div key={todo.id}>
            <li>{todo.title}</li>
            <li>{todo.description}</li>
            <Button
              onClick={() => handleDeleteTodo(todo.id)}
              variant={"destructive"}
            >
              Delete Todo
            </Button>
            <Button
              onClick={(e) => void getTodoRecommendation(e, todo.description)}
            >
              Get Recommendation
            </Button>
          </div>
        ))}
      </div>

      {loading ? <div>Loading...</div> : null}

      {generatedRecommendation ? <div>{generatedRecommendation}</div> : null}
    </>
  );
};

const AddTodos = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const addTodo = api.todos.createTodo.useMutation();

  const handleAddTodo = () => {
    addTodo.mutate(
      {
        title,
        description,
      },
      {
        onSuccess: () => console.log("Success!"),
      }
    );
  };

  return (
    <div className="flex flex-col gap-10">
      <label>Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        className="h-20 w-48 border border-red-500"
      />
      <label>Description</label>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button onClick={handleAddTodo}>Add Todo</Button>
    </div>
  );
};
