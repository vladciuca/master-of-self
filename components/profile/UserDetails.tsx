"use client";

import { useUser } from "@clerk/nextjs";
import { User } from "@models/types";

//NOTE: can remove the user hook from here and just pass the props?
//Maybe no cause we need to change name image from here

export function UserDetails() {
  const { user } = useUser() as { user: User | null };

  const name = user?.fullName || user?.firstName || "";
  const email = user?.primaryEmailAddress?.emailAddress || "";
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
