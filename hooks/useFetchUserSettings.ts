import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Session, UserSettings } from "@app/types/types";

export function useFetchUserSettings() {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    const fetchUserSettings = async () => {
      setSettingsLoading(true);
      try {
        const response = await fetch(`/api/users/${session?.user.id}/settings`);
        const data = await response.json();

        setUserSettings(data.settings);
      } catch (error) {
        console.error("Failed to fetch user settings", error);
        setSettingsLoading(false);
        setSettingsError("Failed to fetch user settings");
      } finally {
        setSettingsLoading(false);
        setSettingsError(null);
      }
    };

    if (session?.user.id) {
      fetchUserSettings();
    }
  }, [session]);

  const userSteps = userSettings?.steps;

  const hasGratitude = userSteps?.gratefulStep;
  const hasReflection = userSteps?.reflectionStep;

  const userMorningTime = userSettings?.journalStartTime.morning;
  const userEveningTime = userSettings?.journalStartTime.evening;

  return {
    hasGratitude,
    hasReflection,
    userMorningTime,
    userEveningTime,
    settingsError,
    settingsLoading,
  };
}
