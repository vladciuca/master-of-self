"use client";

import { Card, CardDescription, CardTitle } from "@components/ui/card";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { FaSun, FaMoon } from "react-icons/fa6";
import { useUserSettings } from "@hooks/useUserSettings";

export function DaySplit() {
  const { userSettings, userSettingsLoading, handleTimeChange } =
    useUserSettings();

  return (
    <div>
      <div className="mx-1 mb-4">
        <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {"Day Split"}
        </CardTitle>
        <CardDescription>{"Set your daily journaling hours."}</CardDescription>
      </div>
      <Card>
        <div className="p-4 flex flex-col w-full">
          <div className="my-4 flex items-center">
            <FaSun className="text-3xl ml-3 mr-6" />

            <div className="flex items-center justify-between w-full">
              <Label htmlFor="morning-start">Morning start hour</Label>
              <Input
                type="time"
                id="morning-start"
                className="max-w-fit mr-4"
                value={userSettings.journalStartTime.morning}
                onChange={(e) => handleTimeChange("morning", e.target.value)}
                disabled={userSettingsLoading}
              />
            </div>
          </div>
          <div className="my-4 flex items-center">
            <FaMoon className="text-3xl ml-3 mr-6" />

            <div className="flex items-center justify-between w-full">
              <Label htmlFor="evening-start">Evening start hour</Label>
              <Input
                type="time"
                id="evening-start"
                className="max-w-fit mr-4"
                value={userSettings.journalStartTime.evening}
                onChange={(e) => handleTimeChange("evening", e.target.value)}
                disabled={userSettingsLoading}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
