"use client";

import { useSession } from "next-auth/react";
import { Session } from "@models/types";

//NOTE: can remove th session hook form here and just pass the props?
//Maybe no cause we need to change name image form here

export function UserDetails() {
  const { data: session } = useSession() as { data: Session | null };

  const name = session?.user?.name || "";
  const email = session?.user?.email || "";
  const nameInitials = name
    ? name
        .split(" ")
        .map((word: string) => word[0])
        .join("")
    : "";

  return (
    <div>
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-muted-foreground">{email}</p>
    </div>
  );
}
