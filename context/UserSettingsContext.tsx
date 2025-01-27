"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import type { Session, UserSettings } from "@app/types/types";

// Define the shape of our context
interface UserSettingsContextType {
  userSettings: UserSettings;
  userSettingsLoading: boolean;
  userSettingsError: string | null;
  handleRoutineChange: (step: "gratefulStep" | "reflectionStep") => void;
  handleTimeChange: (period: "morning" | "evening", value: string) => void;
}

// Create the context
const UserSettingsContext = createContext<UserSettingsContextType | undefined>(
  undefined
);

// Create a provider component
export function UserSettingsProvider({ children }: { children: ReactNode }) {
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
  useEffect(() => {
    const fetchUserSettings = async () => {
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
    };

    fetchUserSettings();
  }, [session]);

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
        // You could call fetchUserSettings() here if needed
      }
    } catch (error) {
      console.error("Error updating setting", error);
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

  // Create the context value
  const contextValue: UserSettingsContextType = {
    userSettings,
    userSettingsLoading,
    userSettingsError,
    handleRoutineChange,
    handleTimeChange,
  };

  // Provide the context to children components
  return (
    <UserSettingsContext.Provider value={contextValue}>
      {children}
    </UserSettingsContext.Provider>
  );
}

// Custom hook to use the UserSettingsContext
export function useUserSettings() {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useUserSettings must be used within a UserSettingsProvider"
    );
  }
  return context;
}
