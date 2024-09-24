"use client";

import Link from "next/link";
import { useTotalWillpower } from "@hooks/useTotalWillpower";
import { Session } from "@app/types/types";

type ProfileBarProps = {
  session: Session;
};

export function ProfileNav({ session }: ProfileBarProps) {
  const { totalWillpower, totalWillpowerLoading, totalWillpowerError } =
    useTotalWillpower();
  const name = session.user?.name || "";
  // const email = session.user?.email || "";
  const nameInitials = name
    ? name
        .split(" ")
        .map((word: string) => word[0])
        .join("")
    : "";

  return (
    <div className="flex items-center h-full">
      <div className="w-1/4 flex justify-center mx-2">
        <Link href="/profile">
          <div className="avatar text-xl font-semibold bg-primary text-primary-foreground rounded-full h-12 w-12 flex justify-center items-center">
            {nameInitials}
          </div>
        </Link>
      </div>
      <div className="flex grow">
        {totalWillpowerLoading ? "??" : totalWillpower}
      </div>
    </div>
  );
}
