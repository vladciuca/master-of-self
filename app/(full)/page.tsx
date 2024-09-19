"use client";

import { useSession } from "next-auth/react";
import { WeeklyWillpowerChart } from "@components/WeeklyWillpowerChart";
import { Routine } from "@components/Routine";
import { DaySplit } from "@components/DaySplit";
import { SignOut } from "@components/SignOut";
import { Session } from "@app/types/types";

export default function Home() {
  const { data: session } = useSession() as { data: Session | null };
  return (
    <div className="flex flex-col space-y-10 pb-4">
      <WeeklyWillpowerChart userId={session?.user.id} />
      <Routine />
      <DaySplit />
      <SignOut />
    </div>
  );
}
