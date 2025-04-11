"use client";

import { useSession } from "next-auth/react";
import { UserLevel } from "@components/profile/user-level/UserLevel";
import { HeaderTitle } from "@components/HeaderTitle";
import { Session } from "@models/types";

export function Header() {
  const { data: session } = useSession() as { data: Session | null };

  return (
    <div className="w-full">
      {session?.user ? <UserLevel session={session} /> : <HeaderTitle />}
    </div>
  );
}
