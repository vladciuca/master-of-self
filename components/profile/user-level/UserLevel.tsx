"use client";

import Link from "next/link";
import { UserWillpowerLevelBar } from "@components/profile/user-level/UserWillpowerLevelBar";
import { GiCharacter } from "react-icons/gi";
import { User } from "@models/types";

type UserLevelProps = {
  user: User;
};

export function UserLevel({ user }: UserLevelProps) {
  return (
    <div className="flex items-center h-full mx-4">
      <div className="flex justify-center">
        <Link href="/settings?page=Overview">
          <div className="cursor-pointer overflow-hidden avatar text-xl font-semibold bg-muted text-primary rounded-full h-14 w-14 flex justify-center items-center">
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
