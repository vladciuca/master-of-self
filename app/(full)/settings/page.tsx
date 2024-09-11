"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@components/ui/checkbox";
import { GiPrayer, GiBackup } from "react-icons/gi";
import { Button } from "@components/ui/button";
import { ModeToggle } from "@components/ui/toggle-mode";
import { Session } from "@/app/types/types";

const Settings = () => {
  const [userSettings, setUserSettings] = useState({
    steps: {
      gratefulStep: false,
      reflectionStep: false,
    },
    journalStartTime: {
      morning: "08:00",
      evening: "18:00",
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (session?.user.id) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/users/${session.user.id}/settings`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch user settings");
          }
          const data = await response.json();
          setUserSettings(data.settings);
        } catch (error) {
          console.error("Failed to fetch user settings", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserSettings();
  }, [session]);

  const updateSetting = async (key: string, value: any) => {
    if (session?.user.id) {
      try {
        const response = await fetch(`/api/users/${session.user.id}/settings`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [key]: value }),
        });

        if (response.ok) {
          setUserSettings((prev) => ({ ...prev, [key]: value }));
        } else {
          console.error("Failed to update setting");
        }
      } catch (error) {
        console.error("Error updating setting", error);
      }
    }
  };

  const handleCheckboxChange = (step: "gratefulStep" | "reflectionStep") => {
    const newValue = !userSettings.steps[step];
    setUserSettings((prev) => ({
      ...prev,
      steps: { ...prev.steps, [step]: newValue },
    }));
    updateSetting("steps", {
      ...userSettings.steps,
      [step]: newValue,
    });
  };

  const handleTimeChange = (period: "morning" | "evening", value: string) => {
    updateSetting("journalStartTime", {
      ...userSettings.journalStartTime,
      [period]: value,
    });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          <Checkbox
            className="ml-4"
            checked={userSettings.steps.gratefulStep}
            onCheckedChange={() => handleCheckboxChange("gratefulStep")}
          />
        </div>
        <div className="my-4 flex justify-between items-center">
          <GiBackup size={"4rem"} className="mr-4" />
          <div>
            <h1>Reflection</h1>
            <p className="text-sm text-muted-foreground">
              Unlock this step in your daily evening routine.
            </p>
          </div>
          <Checkbox
            className="ml-4"
            checked={userSettings.steps.reflectionStep}
            onCheckedChange={() => handleCheckboxChange("reflectionStep")}
          />
        </div>
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="flex items-center justify-center my-1 w-4/5">
          <Label htmlFor="morning-start">Morning start hour:</Label>
          <Input
            type="time"
            id="morning-start"
            className="max-w-fit ml-2"
            value={userSettings.journalStartTime.morning}
            onChange={(e) => handleTimeChange("morning", e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center my-1 w-4/5">
          <Label htmlFor="evening-start">Evening start hour:</Label>
          <Input
            type="time"
            id="evening-start"
            className="max-w-fit ml-2"
            value={userSettings.journalStartTime.evening}
            onChange={(e) => handleTimeChange("evening", e.target.value)}
          />
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
