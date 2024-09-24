"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Session, UserSettings } from "@app/types/types";

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

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!session?.user.id) {
        setUserSettingsError("User not logged in");
        return;
      }

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
      // setUserSettingsError(null);
      // setUserSettingsLoading(true);
      // if (session?.user.id) {
      //   try {
      //     const response = await fetch(
      //       `/api/users/${session.user.id}/settings`
      //     );
      //     if (!response.ok) {
      //       throw new Error("Failed to fetch user settings");
      //     }
      //     const { settings } = await response.json();

      //     setUserSettings(settings);
      //   } catch (error) {
      //     console.error("Failed to fetch user settings", error);
      //     setUserSettingsLoading(false);
      //     setUserSettingsError("Failed to fetch habits");
      //   } finally {
      //     setUserSettingsLoading(false);
      //   }
      // }
    };

    fetchUserSettings();
  }, [session]);

  const updateSetting = async (key: keyof UserSettings, value: any) => {
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

  const handleRoutineChange = (step: "gratefulStep" | "reflectionStep") => {
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

  return {
    userSettings,
    userSettingsLoading,
    userSettingsError,
    handleRoutineChange,
    handleTimeChange,
  };
}
