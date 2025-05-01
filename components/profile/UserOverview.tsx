"use client";

import { useSession } from "next-auth/react";
import { Session } from "@models/types";
import { GiCharacter } from "react-icons/gi";
import { ProfileDisciplines } from "./profile-disciplines/ProfileDisciplines";

export function UserOverview() {
  const { data: session } = useSession() as { data: Session | null };

  const name = session?.user?.name || "";
  const nameInitials = name
    ? name
        .split(" ")
        .map((word: string) => word[0])
        .join("")
    : "";

  return (
    <>
      <div className="flex items-start mx-2">
        <span className="text-muted-foreground text-3xl">{name}</span>
      </div>
      <div>
        <div className="mx-1 mb-4">
          <div className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {"Disciplines"}
          </div>
          <div className="text-sm text-muted-foreground">
            {"Set your daily journaling hours."}
          </div>
        </div>
        <ProfileDisciplines />
      </div>
    </>
  );
}
