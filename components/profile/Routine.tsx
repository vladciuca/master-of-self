"use client";

import { Card, CardDescription, CardTitle } from "@components/ui/card";
import { Switch } from "@components/ui/switch";
import { GiPrayer, GiBackup, GiPlayerTime } from "react-icons/gi";
import { useUserSettings } from "@hooks/user/useUserSettings";

export function Routine() {
  const { userSettings, userSettingsLoading, handleRoutineChange } =
    useUserSettings();

  return (
    <div>
      <div className="mx-1 mb-4">
        <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {"Daily Routine"}
        </CardTitle>
        <CardDescription>{"Configure your daily routine."}</CardDescription>
      </div>

      <Card>
        <div className="p-4 flex flex-col items-center w-full">
          <div className="my-4 flex justify-between items-center">
            <GiPrayer size={"4rem"} className="mr-4" />
            <div>
              <h1>Gratitude</h1>
              <p className="text-sm text-muted-foreground">
                Unlock this step in your daily morning routine.
              </p>
            </div>
            <Switch
              className="ml-2 mr-6"
              checked={userSettings.steps.gratefulStep}
              onCheckedChange={() => handleRoutineChange("gratefulStep")}
              disabled={userSettingsLoading}
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
            <Switch
              className="ml-2 mr-6"
              checked={userSettings.steps.reflectionStep}
              onCheckedChange={() => handleRoutineChange("reflectionStep")}
              disabled={userSettingsLoading}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
