"use client";

import Link from "next/link";
import { WillpowerLevelBar } from "@components/WillpowerLevelBar";
import { GiCharacter } from "react-icons/gi";
// import { FaBoltLightning } from "react-icons/fa6";
// import { useTotalWillpower } from "@hooks/useTotalWillpower";
import { Session } from "@models/types";

type ProfileBarProps = {
  session: Session;
};

export function ProfileNav({ session }: ProfileBarProps) {
  // const { totalWillpower, totalWillpowerLoading } = useTotalWillpower();

  // const name = session.user?.name || "";
  // const nameInitials = name
  //   ? name
  //       .split(" ")
  //       .map((word: string) => word[0])
  //       .join("")
  //   : "";

  return (
    <div className="flex items-center h-full mx-4">
      <div className="flex justify-center">
        <Link href="/profile">
          <div className="overflow-hidden avatar text-xl font-semibold bg-muted text-primary rounded-full h-14 w-14 flex justify-center items-center">
            {/* {nameInitials} */}
            <GiCharacter size={60} className="mt-2" />
          </div>
        </Link>
      </div>

      <div className="flex flex-grow flex-col justify-end ml-3">
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
          <WillpowerLevelBar />
        </div>
      </div>
    </div>
  );
}
