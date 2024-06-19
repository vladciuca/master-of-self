"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/toggle-mode";

const Settings = () => {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col items-center justify-center h-[400px]">
      <div className="flex items-center">
        <span className="mr-2">Change Theme Color</span>

        <ModeToggle />
      </div>
      <Button onClick={handleSignOut} className="w-1/2 mt-6">
        Sign Out
      </Button>
    </div>
  );
};

export default Settings;
