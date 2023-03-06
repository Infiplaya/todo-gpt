import type { NextPage } from "next";
import { Todos } from "~/components/todos";

const Home: NextPage = () => {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center py-2">
      <Todos />
    </div>
  );
};

export default Home;
