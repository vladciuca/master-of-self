import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Session } from "@app/types/types";

type UserSettings = {
  steps: {
    gratefulStep: boolean;
    reflectionStep: boolean;
  };
  journalStartTime: {
    morning: string;
    evening: string;
  };
};

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

  return {
    userSettings,
    isLoading,
    handleCheckboxChange,
    handleTimeChange,
  };
}
