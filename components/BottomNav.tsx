import Link from "next/link";
import { Button } from "@components/ui/button";
import { Target, Shell } from "lucide-react";
import { GiSpellBook } from "react-icons/gi";

export function BottomNav() {
  return (
    <nav className="h-full w-full flex justify-around items-center">
      <Link href="/goals">
        <Button
          variant="ghost"
          className="flex flex-col items-center hover: rounded-full h-16 px-10"
        >
          <Target size={"2rem"} />
          <div className="text-xs mt-1">Goals</div>
        </Button>
      </Link>

      <Link href="/journal">
        <Button
          variant="ghost"
          className="flex flex-col items-center hover: rounded-full h-16 px-10"
        >
          <GiSpellBook size={"2.8rem"} />
        </Button>
      </Link>

      <Link href="/habits">
        <Button
          variant="ghost"
          className="flex flex-col items-center hover: rounded-full h-16 px-10"
        >
          <Shell size={"2rem"} />
          <div className="text-xs mt-1">Habits</div>
        </Button>
      </Link>
    </nav>
  );
}
