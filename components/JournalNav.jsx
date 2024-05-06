import Link from "next/link";
import { LuTarget, LuAtom } from "react-icons/lu";
import { FaSun, FaMoon } from "react-icons/fa6";
import { Button } from "@components/ui/button";

const JournalNav = () => {
  return (
    <nav className="flex h-full justify-around items-center w-full">
      <Link href="/">
        <Button
          variant="ghost"
          className="flex flex-col items-center hover: rounded-full h-16 px-10"
        >
          <LuTarget size={"2.4rem"} />
          {/* <div className="text-xs mt-2">Powers</div> */}
        </Button>
      </Link>

      <Link href="/journal">
        <Button
          variant="ghost"
          className="flex flex-col items-center hover: rounded-full h-16 px-10"
        >
          <FaMoon size={"2.4rem"} />
          {/* <div className="text-xs mt-2">00:00</div> */}
        </Button>
      </Link>

      <Link href="/habits">
        <Button
          variant="ghost"
          className="flex flex-col items-center hover: rounded-full h-16 px-10"
        >
          <LuAtom size={"2.4rem"} />
          {/* <div className="text-xs mt-2">Habits</div> */}
        </Button>
      </Link>
    </nav>
  );
};

export default JournalNav;
