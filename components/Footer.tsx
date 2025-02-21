"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { BottomNav } from "@components/BottomNav";
import { Button } from "@components/ui/button";

export function Footer() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleCancel = () => {
    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="loader" />
      </div>
    );
  }

  if (session?.user) {
    return <BottomNav />;
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      {pathname === "/" ? (
        <Button className="w-1/2" onClick={handleSignIn}>
          Sign In
        </Button>
      ) : (
        <Button className="w-1/2" variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      )}
    </div>
  );
}
