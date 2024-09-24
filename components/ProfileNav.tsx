"use client";

import Link from "next/link";
import { useTotalWillpower } from "@hooks/useTotalWillpower";
import { FaBoltLightning } from "react-icons/fa6";
import { Session } from "@app/types/types";

type ProfileBarProps = {
  session: Session;
};

export function ProfileNav({ session }: ProfileBarProps) {
  const { totalWillpower, totalWillpowerLoading } = useTotalWillpower();
  const name = session.user?.name || "";
  const nameInitials = name
    ? name
        .split(" ")
        .map((word: string) => word[0])
        .join("")
    : "";

  return (
    <div className="flex items-center justify-between h-full mx-8">
      <div className="flex justify-center mx-2">
        <Link href="/profile">
          <div className="avatar text-xl font-semibold bg-primary text-primary-foreground rounded-full h-12 w-12 flex justify-center items-center">
            {nameInitials}
          </div>
        </Link>
      </div>

      <div className="flex flex-col mr-1 justify-end">
        <div className="flex items-center text-xl font-bold">
          <div className="flex flex-col items-end">
            <div className="text-xs uppercase text-muted-foreground">Total</div>
            <span className="text-4xl">
              {totalWillpowerLoading ? "??" : totalWillpower}
            </span>
          </div>

          <div>
            <FaBoltLightning className="ml-1" size={"2.5rem"} />
          </div>
        </div>
      </div>
    </div>
  );
}
