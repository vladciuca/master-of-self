import { signOut } from "next-auth/react";
import { Button } from "@components/ui/button";

export function SignOut() {
  return (
    <div className="w-full flex justify-center">
      <Button
        onClick={() => {
          signOut({ callbackUrl: "/" });
        }}
        className="w-1/2 my-6"
      >
        Sign Out
      </Button>
    </div>
  );
}
