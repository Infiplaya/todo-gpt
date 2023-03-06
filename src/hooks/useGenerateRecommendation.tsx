import { type MouseEvent, useState } from "react";

export const useGenerateRecommendation = () => {
  const [loading, setLoading] = useState(false);
  const [generatedRecommendation, setGeneratedRecommendation] = useState("");

  const getTodoRecommendation = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    description: string
  ) => {
    const prompt = `Please give me 3 recommendations of similar tasks that I can add to my todo list based on description provided: ${description} Keep your recommendation max 15 characters. Make sure to label them 1., 2. etc. Make sure to write them in the same language as original description`;
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

  return { loading, generatedRecommendation, getTodoRecommendation };
};
