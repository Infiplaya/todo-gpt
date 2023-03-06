import type { NextPage } from "next";
import { type MouseEvent, useRef, useState } from "react";
import { Todos } from "~/components/todos";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [generatedAnswer, setGeneratedAnswer] = useState("");

  const answerRef = useRef<null | HTMLDivElement>(null);

  const scrollToAnswer = () => {
    if (answerRef.current !== null) {
      answerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prompt = question
    ? `Please let respond to my question like elves from the Tolkien's World. They are known for answering by not telling the truth and not lying in the same time. Don't be so poetic. Question is: ${question}`
    : "Please let respond to my question like elves from the Tolkien's World. Say that the answer for this question is 42";

  const generateAnswer = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    setGeneratedAnswer("");
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
      setGeneratedAnswer((prev) => prev + chunkValue);
    }
    scrollToAnswer();
    setLoading(false);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center py-2">
      <main className="mt-12 flex w-full flex-1 flex-col items-center justify-center px-4 text-center sm:mt-20">
        <Todos />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Ask elf for an advice
        </h1>
        {generatedAnswer && (
          <div className="my-10 space-y-5">
            <>
              <div>
                <h2
                  className="mt-10 scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
                  ref={answerRef}
                >
                  Here is answer
                </h2>
              </div>
              <div className="mx-auto flex max-w-xl flex-col items-center justify-center">
                <p className="leading-7">{generatedAnswer}</p>
              </div>
            </>
          </div>
        )}
        <div className="my-10 w-full max-w-xl space-y-5">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={"eg. What is the meaning of life?"}
          />
          {!loading && (
            <Button onClick={(e) => void generateAnswer(e)} className="w-full">
              Find out
            </Button>
          )}
          {loading && <Button>Loading...</Button>}
        </div>

        <hr className="border-1 h-px bg-gray-700 dark:bg-gray-700" />
      </main>
    </div>
  );
};

export default Home;
