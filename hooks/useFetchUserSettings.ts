import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Session, UserSettings } from "@app/types/types";

export function useFetchUserSettings() {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await fetch(`/api/users/${session?.user.id}/settings`);
        const data = await response.json();
        setUserSettings(data.settings);
      } catch (error) {
        console.error("Failed to fetch user settings", error);
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

  return { hasGratitude, hasReflection, userMorningTime, userEveningTime };
}
