"use client";

import { useSession } from "next-auth/react";
import { ProfileHeader } from "@components/profile/profile-header/ProfileHeader";
import { HeaderTitle } from "@components/HeaderTitle";
import { Session } from "@models/types";

export function Header() {
  const { data: session } = useSession() as { data: Session | null };

  return (
    <div className="w-full">
      {session?.user ? <ProfileHeader session={session} /> : <HeaderTitle />}
    </div>
  );
}
