"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@components/ui/button";

export function SignOut() {
  const { signOut } = useClerk();

  return (
    <div className="w-full flex justify-center">
      <Button
        onClick={() => {
          signOut({ redirectUrl: "/" });
        }}
        className="w-1/2"
      >
        Sign Out
      </Button>
    </div>
  );
}
