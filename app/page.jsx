import { Button } from "@components/ui/button";
import Link from "next/link";

const Home = () => {
  return (
    <section className="flex flex-col items-center justify-center h-[400px]">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        COMING SOON
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        UNTIL THEN YOU CAN ADD HABITS
      </p>
      <Link href="/habits">
        <Button className="mt-5">TO HABITS</Button>
      </Link>
    </section>
  );
};

export default Home;
