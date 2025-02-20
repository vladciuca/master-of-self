"use client";

import { useSession } from "next-auth/react";
import { ProfileNav } from "@components/profile/profile-header/ProfileNav";
import { HeaderTitle } from "@components/HeaderTitle";
import { Session } from "@models/types";

export function Header() {
  const { data: session } = useSession() as { data: Session | null };

  return (
    <div className="w-full">
      {session?.user ? <ProfileNav session={session} /> : <HeaderTitle />}
    </div>
  );
}
