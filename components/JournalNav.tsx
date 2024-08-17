import Link from "next/link";
import { Target, Shell } from "lucide-react";
import {
  GiSpellBook,
  GiOpenBook,
  GiBookmark,
  GiBookmarklet,
} from "react-icons/gi";
import { Button } from "@components/ui/button";

const JournalNav = () => {
  return (
    <nav className="flex h-full justify-around items-center w-full">
      <Link href="/missions">
        <Button
          variant="ghost"
          className="flex flex-col items-center hover: rounded-full h-16 px-10"
        >
          <Target size={"2.4rem"} />
          <div className="text-xs mt-1">Missions</div>
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
          <Shell size={"2.4rem"} />
          <div className="text-xs mt-1">Habits</div>
        </Button>
      </Link>
    </nav>
  );
};

export default JournalNav;
