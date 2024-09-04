"use client";

import { signOut } from "next-auth/react";
import { Button } from "@components/ui/button";
import { ModeToggle } from "@components/ui/toggle-mode";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@components/ui/checkbox";
import { GiPrayer, GiBackup } from "react-icons/gi";

const Settings = () => {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col items-center justify-between h-full">
      <div className="my-4 flex flex-col items-center w-4/5">
        <div className="my-4 flex justify-between items-center">
          <GiPrayer size={"4rem"} className="mr-4" />
          <div>
            <h1>Gratitude</h1>
            <p className="text-sm text-muted-foreground">
              Unlock this step in your daily morning routine.
            </p>
          </div>
          <Checkbox className="ml-4" />
        </div>
        <div className="my-4 flex justify-between items-center">
          <GiBackup size={"4rem"} className="mr-4" />
          <div>
            <h1>Refection</h1>
            <p className="text-sm text-muted-foreground">
              Unlock this step in your daily evening routine.
            </p>
          </div>
          <Checkbox className="ml-4" />
        </div>
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="flex items-center justify-center my-1 w-4/5">
          <Label htmlFor="morning-start">Morning start hour:</Label>
          <Input type="time" id="morning-start" className="max-w-fit ml-2" />
        </div>
        <div className="flex items-center justify-center my-1 w-4/5">
          <Label htmlFor="evening-start">Evening start hour:</Label>
          <Input type="time" id="evening-start" className="max-w-fit ml-2" />
        </div>
      </div>
      <div className="my-4 w-1/2 flex justify-between items-center">
        <Label>Change Theme</Label>
        <ModeToggle />
      </div>
      <Button onClick={handleSignOut} className="w-1/2 my-6">
        Sign Out
      </Button>
    </div>
  );
};

export default Settings;
