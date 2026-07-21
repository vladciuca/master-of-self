"use client";

import Link from "next/link";
import { UserWillpowerLevelBar } from "@components/profile/user-level/UserWillpowerLevelBar";
import { GiWhiteBook } from "react-icons/gi";
import { User } from "@models/types";

type UserLevelProps = {
  user: User;
};

export function UserLevel({ user }: UserLevelProps) {
  return (
    <div className="flex items-center h-full mx-4">
      <div className="flex justify-center">
        <Link href="/settings?page=Overview">
          <div className="cursor-pointer text-primary flex justify-center items-center mx-2">
            <GiWhiteBook size={50} />
          </div>
        </Link>
      </div>

      <div className="flex flex-grow flex-col justify-end ml-3">
        <UserWillpowerLevelBar />
      </div>
    </div>
  );
}
