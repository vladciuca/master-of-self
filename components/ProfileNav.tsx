"use client";

import Link from "next/link";
import { useTotalWillpower } from "@hooks/useTotalWillpower";
import { FaBoltLightning, FaLink, FaSun } from "react-icons/fa6";
// import { Progress } from "@components/ui/progress";
import { Session } from "@app/types/types";

type ProfileBarProps = {
  session: Session;
};

export function ProfileNav({ session }: ProfileBarProps) {
  const { totalWillpower, totalWillpowerLoading, totalWillpowerError } =
    useTotalWillpower();
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

      <div className="flex flex-col flex-grow ml-6">
        <div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium">Journal Streak</span>
            <div className="flex items-center text-xl font-bold">
              {1}
              <div className="text-sm">
                <FaSun className="ml-2 text-xl" />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium">Willpower Generated</span>
            <div className="flex items-center text-xl font-bold">
              {totalWillpowerLoading ? "??" : totalWillpower}
              <div className="text-sm">
                <FaBoltLightning className="ml-2 text-xl" />
              </div>
            </div>
          </div>
          {/* <Progress value={10} max={30} className="h-2 mt-1 mb-2" />
          <div className="flex justify-between">
            <span className="text-xs font-medium">Milestone 1 (7 days)</span>
            <span className="text-xs font-medium">Evening 00:00</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
