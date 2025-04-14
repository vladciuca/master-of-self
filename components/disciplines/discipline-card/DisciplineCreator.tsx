import { useSession } from "next-auth/react";
import { Session } from "@models/types";

import { GiCharacter } from "react-icons/gi";

export function DisciplineCreator() {
  const { data: session } = useSession() as { data: Session | null };

  const name = session?.user?.name || "";
  const nameInitials = name
    ? name
        .split(" ")
        .map((word: string) => word[0])
        .join("")
    : "";

  return (
    <div className="flex items-end mx-2 text-xs">
      <span className="text-muted-foreground"> Created by</span>

      <span className="ml-1 mr-2 font-semibold">{name}</span>

      <div className="overflow-hidden avatar text-xl font-semibold bg-muted text-primary rounded-full h-6 w-6 flex justify-center items-center">
        {/* {nameInitials} */}
        <GiCharacter size={25} className="mt-2" />
      </div>
    </div>
  );
}
