"use client";

import Link from "next/link";
import { LevelBar } from "@components/LevelBar";
// import { FaBoltLightning } from "react-icons/fa6";
// import { useTotalWillpower } from "@hooks/useTotalWillpower";
import { useCurrentWillpower } from "@hooks/useCurrentWillpower";
import { useTodayJournalEntry } from "@hooks/useTodayJournalEntry";
import { Session } from "@app/types/types";
import { calculateLevel, xpForLevel } from "@lib/level";

type ProfileBarProps = {
  session: Session;
};

export function ProfileNav({ session }: ProfileBarProps) {
  // const { totalWillpower, totalWillpowerLoading } = useTotalWillpower();
  const { currentWillpower, currentWillpowerLoading } = useCurrentWillpower();
  const { todayEntry, todayEntryLoading, todayEntryError } =
    useTodayJournalEntry();

  const name = session.user?.name || "";
  const nameInitials = name
    ? name
        .split(" ")
        .map((word: string) => word[0])
        .join("")
    : "";

  const bonusWillpower = todayEntry?.bonusWillpower ?? 0;
  const dailyWillpower = todayEntry?.dailyWillpower ?? 0;

  const level = calculateLevel(currentWillpower);
  const { nextLevelXP } = xpForLevel(level);

  return (
    <div className="flex items-center h-full mx-5">
      <div className="flex justify-center">
        <Link href="/profile">
          <div className="avatar text-xl font-semibold bg-muted text-primary rounded-full h-14 w-14 flex justify-center items-center">
            {nameInitials}
          </div>
        </Link>
      </div>

      <div className="flex flex-grow flex-col ml-4 justify-end">
        <div className="flex items-center text-xl font-bold">
          {/* <div className="flex flex-col items-end">
            <div className="text-xs uppercase text-muted-foreground">Total</div>
            <span className="text-4xl">
              {totalWillpowerLoading ? "??" : totalWillpower}
            </span>
          </div>

          <div>
            <FaBoltLightning className="ml-1" size={"2.5rem"} />
          </div> */}
          <LevelBar
            level={level}
            //can use memo here for this value, as it will not change
            currentXP={currentWillpower}
            //also can be static since it does not change
            bonusXP={bonusWillpower}
            // while this can change
            projectedXP={dailyWillpower - bonusWillpower}
            maxXP={nextLevelXP}
          />
        </div>
      </div>
    </div>
  );
}
