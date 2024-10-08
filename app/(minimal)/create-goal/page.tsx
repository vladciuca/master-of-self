import Link from "next/link";
import { Button } from "@components/ui/button";
import { Shell } from "lucide-react";

export default function CreateGoal() {
  return (
    <div>
      <section className="mt-20 flex flex-col items-center justify-center h-[400px]">
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-widest">
          COMING SOON
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Until then you can track your Habits!
        </p>
        <Link href="/habits">
          <Button className="mt-5">
            <Shell className="mr-2" />
            Go To Habits
          </Button>
        </Link>
      </section>
    </div>
  );
}
