"use client";

import Link from "next/link";
import { Session } from "next-auth";

type ProfileProps = {
  session: Session;
};

const Profile = ({ session }: ProfileProps) => {
  const name = session.user?.name || "";
  const email = session.user?.email || "";

  const nameInitials = name
    ? name
        .split(" ")
        .map((word: string) => word[0])
        .join("")
    : "";

  return (
    <div className="flex items-center h-full">
      <div className="w-1/4 flex justify-center">
        <Link href="/settings">
          <div className="avatar text-xl font-semibold bg-primary text-primary-foreground rounded-full h-12 w-12 flex justify-center items-center">
            {nameInitials}
          </div>
        </Link>
      </div>
      <div className="flex grow">{email}</div>
    </div>
  );
};

export default Profile;
