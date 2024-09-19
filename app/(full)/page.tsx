"use client";

import { useSession } from "next-auth/react";
import { WeeklyWillpowerChart } from "@/components/WeeklyWillpowerChart";
import { Session } from "@/app/types/types";

export default function Home() {
  const { data: session } = useSession() as { data: Session | null };
  return (
    <>
      <WeeklyWillpowerChart userId={session?.user.id} />
    </>
  );
}
