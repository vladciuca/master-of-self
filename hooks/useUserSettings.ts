"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import type { Session, UserSettings } from "@models/types";

export function useUserSettings() {
  const [userSettings, setUserSettings] = useState<UserSettings>({
    steps: {
      gratefulStep: false,
      reflectionStep: false,
    },
    journalStartTime: {
      morning: "08:00",
      evening: "18:00",
    },
  });
  const [userSettingsLoading, setUserSettingsLoading] = useState(true);
  const [userSettingsError, setUserSettingsError] = useState<string | null>(
    null
  );
  const { data: session } = useSession() as { data: Session | null };

  // Fetch user settings from the server
  const fetchUserSettings = useCallback(async () => {
    if (!session?.user?.id) return;

    setUserSettingsError(null);
    setUserSettingsLoading(true);

    try {
      const response = await fetch(`/api/users/${session.user.id}/settings`);
      if (!response.ok) {
        throw new Error("Failed to fetch user settings");
      }
      const { settings } = await response.json();
      setUserSettings(settings);
    } catch (error) {
      console.error("Failed to fetch user settings", error);
      setUserSettingsError("Failed to fetch user settings");
    } finally {
      setUserSettingsLoading(false);
    }
  }, [session]);

  // Fetch user settings when the session changes
  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  // Update a specific setting
  const updateSetting = async (key: keyof UserSettings, value: any) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/users/${session.user.id}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [key]: value }),
      });

      if (response.ok) {
        // Update local state immediately
        setUserSettings((prev) => ({ ...prev, [key]: value }));
      } else {
        console.error("Failed to update setting");
        // Optionally, refetch settings to ensure consistency
        fetchUserSettings();
      }
    } catch (error) {
      console.error("Error updating setting", error);
      // Optionally, refetch settings to ensure consistency
      fetchUserSettings();
    }
  };

  // Handle routine change
  const handleRoutineChange = (step: "gratefulStep" | "reflectionStep") => {
    const newValue = !userSettings.steps[step];
    updateSetting("steps", {
      ...userSettings.steps,
      [step]: newValue,
    });
  };

  // Handle time change
  const handleTimeChange = (period: "morning" | "evening", value: string) => {
    updateSetting("journalStartTime", {
      ...userSettings.journalStartTime,
      [period]: value,
    });
  };

  return {
    userSettings,
    userSettingsLoading,
    userSettingsError,
    handleRoutineChange,
    handleTimeChange,
  };
}
