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
        <div className="overflow-hidden avatar text-xl font-semibold bg-muted text-primary rounded-full h-12 w-12 flex justify-center items-center">
          {/* {nameInitials} */}
          <GiCharacter size={50} className="mt-2" />
        </div>
        <span className="text-muted-foreground ml-4">{name}</span>
      </div>
      <ProfileDisciplines />
    </>
  );
}
