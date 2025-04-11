"use client";

import Link from "next/link";
import { UserWillpowerLevelBar } from "@components/profile/user-level/UserWillpowerLevelBar";
import { GiCharacter } from "react-icons/gi";
import { Session } from "@models/types";

type UserLevelProps = {
  session: Session;
};

export function UserLevel({ session }: UserLevelProps) {
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
        <Link href="/settings">
          <div className="overflow-hidden avatar text-xl font-semibold bg-muted text-primary rounded-full h-14 w-14 flex justify-center items-center">
            {/* {nameInitials} */}
            <GiCharacter size={60} className="mt-2" />
          </div>
        </Link>
      </div>

      <div className="flex flex-grow flex-col justify-end ml-3">
        <UserWillpowerLevelBar />
      </div>
    </div>
  );
}
