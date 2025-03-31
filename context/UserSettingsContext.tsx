"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import type { Session, UserSettings } from "@models/types";

// Define the shape of our context
interface UserSettingsContextType {
  userSettings: UserSettings;
  userSettingsLoading: boolean;
  userSettingsError: string | null;
  handleRoutineChange: (
    step: "gratitude" | "reflection" | "affirmations"
  ) => void;
  handleTimeChange: (period: "morning" | "evening", value: string) => void;
  refetchUserSettings: () => void;
  willpowerMultiplier: number;
}

// Create the context
const UserSettingsContext = createContext<UserSettingsContextType | undefined>(
  undefined
);

// Create a provider component
export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession() as { data: Session | null };

  const [userSettings, setUserSettings] = useState<UserSettings>({
    steps: {
      gratitude: false,
      affirmations: false,
      reflection: false,
    },
    disciplines: {},
    journalStartTime: {
      morning: "08:00",
      evening: "18:00",
    },
  });
  const [userSettingsLoading, setUserSettingsLoading] = useState(true);
  const [userSettingsError, setUserSettingsError] = useState<string | null>(
    null
  );

  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const updateAbortControllerRef = useRef<AbortController | null>(null);

  //NOTE: this will be added to the userSettings object after refactor to userProfile
  const WILLPOWER_MULTIPLIER = 1.5;

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clean up both abort controllers on unmount
      if (fetchAbortControllerRef.current) {
        fetchAbortControllerRef.current.abort();
        fetchAbortControllerRef.current = null;
      }

      if (updateAbortControllerRef.current) {
        updateAbortControllerRef.current.abort();
        updateAbortControllerRef.current = null;
      }
    };
  }, []);

  // // Fetch user settings from the server
  // useEffect(() => {
  //   //NOTE: here should I move this stuff at before the try or after
  //   if (!session?.user?.id) return;

  //   // Cancel any in-progress fetch
  //   if (fetchAbortControllerRef.current) {
  //     fetchAbortControllerRef.current.abort();
  //     fetchAbortControllerRef.current = null;
  //   }

  //   // Create a new AbortController for this fetch
  //   fetchAbortControllerRef.current = new AbortController();
  //   const { signal } = fetchAbortControllerRef.current;

  //   setUserSettingsError(null);
  //   setUserSettingsLoading(true);

  //   const fetchUserSettings = async () => {
  //     try {
  //       const response = await fetch(`/api/users/${session.user.id}/settings`, {
  //         signal,
  //       });

  //       if (signal.aborted) return;

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch user settings");
  //       }

  //       const { settings } = await response.json();
  //       setUserSettings(settings);
  //     } catch (error) {
  //       // Only set error if it's not an abort error
  //       if (error instanceof Error && error.name !== "AbortError") {
  //         console.error("Failed to fetch user settings", error);
  //         setUserSettingsError("Failed to fetch user settings");
  //       }
  //     } finally {
  //       // Only update loading state if the request wasn't aborted
  //       if (!signal.aborted) {
  //         setUserSettingsLoading(false);
  //       }
  //     }
  //   };

  //   fetchUserSettings();

  //   // Cleanup function
  //   return () => {
  //     if (fetchAbortControllerRef.current) {
  //       fetchAbortControllerRef.current.abort();
  //       fetchAbortControllerRef.current = null;
  //     }
  //   };
  // }, [session?.user?.id]);

  // NOTE: Extracted the fetch function in a useCallback to be able to call a refetch
  const fetchUserSettings = useCallback(async () => {
    if (!session?.user?.id) return;

    // Cancel any in-progress fetch
    if (fetchAbortControllerRef.current) {
      fetchAbortControllerRef.current.abort();
      fetchAbortControllerRef.current = null;
    }

    // Create a new AbortController for this fetch
    fetchAbortControllerRef.current = new AbortController();
    const { signal } = fetchAbortControllerRef.current;

    setUserSettingsError(null);
    setUserSettingsLoading(true);

    try {
      const response = await fetch(`/api/users/${session.user.id}/settings`, {
        signal,
      });

      if (signal.aborted) return;

      if (!response.ok) {
        throw new Error("Failed to fetch user settings");
      }

      const { settings } = await response.json();
      setUserSettings(settings);
    } catch (error) {
      // Only set error if it's not an abort error
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Failed to fetch user settings", error);
        setUserSettingsError("Failed to fetch user settings");
      }
    } finally {
      // Only update loading state if the request wasn't aborted
      if (!signal.aborted) {
        setUserSettingsLoading(false);
      }
    }
  }, [session?.user?.id]);

  // Existing useEffect for initial fetch
  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  // Update a specific setting
  // NOTE: add proper values here
  const updateSetting = async (key: keyof UserSettings, value: any) => {
    if (!session?.user?.id) return;

    // Cancel any in-progress update
    if (updateAbortControllerRef.current) {
      updateAbortControllerRef.current.abort();
    }

    // Create a new AbortController for this update
    updateAbortControllerRef.current = new AbortController();
    const { signal } = updateAbortControllerRef.current;

    try {
      const response = await fetch(`/api/users/${session.user.id}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [key]: value }),
        signal,
      });

      if (signal.aborted) return;

      if (response.ok) {
        // Update local state immediately
        setUserSettings((prev) => ({ ...prev, [key]: value }));
      } else {
        console.error("Failed to update setting");
        // Optionally, refetch settings to ensure consistency
        // You could call fetchUserSettings() here if needed
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error updating setting", error);
      }
    } finally {
      // Clear the ref after completion if it's the same controller
      if (
        updateAbortControllerRef.current &&
        signal === updateAbortControllerRef.current.signal
      ) {
        updateAbortControllerRef.current = null;
      }
    }
  };

  // Handle routine change
  const handleRoutineChange = (
    step: "gratitude" | "reflection" | "affirmations"
  ) => {
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
    refetchUserSettings: fetchUserSettings,
    willpowerMultiplier: WILLPOWER_MULTIPLIER,
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
