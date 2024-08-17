import React from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";

const Missions = () => {
  return (
    <div>
      <section className="flex flex-col items-center justify-center h-[400px]">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-widest lg:text-5xl">
          COMING SOON
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          UNTIL THEN YOU CAN ADD HABITS
        </p>
        <Link href="/habits">
          <Button className="mt-5">TO HABITS</Button>
        </Link>
      </section>
    </div>
  );
};

export default Missions;
