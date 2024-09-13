"use client";

import { useSession } from "next-auth/react";
import { ProfileNav } from "@components/ProfileNav";
import { HeaderTitle } from "@components/HeaderTitle";
import { Session } from "@app/types/types";

export function Header() {
  const { data: session } = useSession() as { data: Session | null };

  return (
    <div className="sticky top-0 w-full z-50 h-20">
      {session?.user ? <ProfileNav session={session} /> : <HeaderTitle />}
    </div>
  );
}
