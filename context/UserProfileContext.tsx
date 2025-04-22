"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import type { Session, UserProfile } from "@models/types";

type UserProfileContextType = {
  userProfile: UserProfile;
  userProfileLoading: boolean;
  userProfileError: string | null;
  //UPDATE USER JOURNAL TIMES================================================================
  handleTimeChange: (period: "morning" | "evening", value: string) => void;
  //UPDATE ACTIVE DISCIPLINE LIST============================================================
  updateActiveDiscipline: (disciplineId: string, isActive: boolean) => void;
  submittingActiveUpdate: boolean;
  updateActiveError: string | null;
  //UPDATE DISCIPLINE VALUES=================================================================
  updateDisciplinesValues: (
    disciplineUpdates: Record<string, number>
  ) => Promise<{ success: boolean; data?: any; error?: string } | undefined>;
  submittingDisciplinesValuesUpdate: boolean;
  updateDisciplinesValuesError: string | null;
};

// Create the context
const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

// Create a provider component
export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession() as { data: Session | null };

  const [userProfile, setUserProfile] = useState<UserProfile>({
    willpowerMultiplier: 1.5,
    disciplines: {},
    activeDisciplines: [],
    journalStartTime: {
      morning: "08:00",
      evening: "18:00",
    },
  });
  const [userProfileLoading, setUserProfileLoading] = useState(true);
  const [userProfileError, setUserProfileError] = useState<string | null>(null);

  // State for discipline value updates
  const [
    submittingDisciplinesValuesUpdate,
    setSubmittingDisciplinesValuesUpdate,
  ] = useState(false);
  const [updateDisciplinesValuesError, setUpdateDisciplinesValuesError] =
    useState<string | null>(null);

  //  State for Active Discipline ID list
  const [submittingActiveUpdate, setSubmittingActiveUpdate] = useState(false);
  const [updateActiveError, setUpdateActiveError] = useState<string | null>(
    null
  );

  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const updateAbortControllerRef = useRef<AbortController | null>(null);
  // ref for DISCIPLINE VALUE updates
  const disciplinesUpdateAbortControllerRef = useRef<AbortController | null>(
    null
  );
  // ref for ACTIVE DISCIPLINE ID LIST updates
  const activeUpdateAbortControllerRef = useRef<AbortController | null>(null);

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

      if (disciplinesUpdateAbortControllerRef.current) {
        disciplinesUpdateAbortControllerRef.current.abort();
        disciplinesUpdateAbortControllerRef.current = null;
      }

      if (activeUpdateAbortControllerRef.current) {
        activeUpdateAbortControllerRef.current.abort();
        activeUpdateAbortControllerRef.current = null;
      }
    };
  }, []);

  // Fetch user profile from the server
  useEffect(() => {
    //NOTE: here should I move this stuff at before the try or after
    if (!session?.user?.id) return;

    // Cancel any in-progress fetch
    if (fetchAbortControllerRef.current) {
      fetchAbortControllerRef.current.abort();
      fetchAbortControllerRef.current = null;
    }

    // Create a new AbortController for this fetch
    fetchAbortControllerRef.current = new AbortController();
    const { signal } = fetchAbortControllerRef.current;

    setUserProfileError(null);
    setUserProfileLoading(true);

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/users/${session.user.id}/profile`, {
          signal,
        });

        if (signal.aborted) return;

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const { profile } = await response.json();
        //FIX: 1
        // if (!profile.disciplines) {
        //   console.warn(
        //     "======⚠️ profile.disciplines missing from server response:",
        //     profile
        //   );
        // }
        setUserProfile((prev) => ({
          ...prev,
          ...profile,
          disciplines: profile.disciplines ?? prev.disciplines ?? {},
        }));
      } catch (error) {
        // Only set error if it's not an abort error
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Failed to fetch user profile", error);
          setUserProfileError("Failed to fetch user profile");
        }
      } finally {
        // Only update loading state if the request wasn't aborted
        if (!signal.aborted) {
          setUserProfileLoading(false);
        }
      }
    };

    fetchUserProfile();

    // Cleanup function
    return () => {
      if (fetchAbortControllerRef.current) {
        fetchAbortControllerRef.current.abort();
        fetchAbortControllerRef.current = null;
      }
    };
  }, [session?.user?.id]);

  //===============================================================================================
  // GENERAL FUNCTION TO UPDATE USER SETTINGS KEYS
  // NOTE: Currently only handles JOURNAL_START_TIMES in DB operations
  const updateProfile = async (key: keyof UserProfile, value: any) => {
    if (!session?.user?.id) return;

    // Cancel any in-progress update
    if (updateAbortControllerRef.current) {
      updateAbortControllerRef.current.abort();
    }

    // Create a new AbortController for this update
    updateAbortControllerRef.current = new AbortController();
    const { signal } = updateAbortControllerRef.current;

    try {
      const response = await fetch(`/api/users/${session.user.id}/profile`, {
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
        setUserProfile((prev) => ({ ...prev, [key]: value }));
      } else {
        console.error("Failed to update profile");
        // Optionally, refetch profile to ensure consistency
        // You could call fetchUserProfile() here if needed
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

  //===============================================================================================
  // CALLING GENERAL FUNCTION TO UPDATE USER JOURNAL TIMES
  const handleTimeChange = (period: "morning" | "evening", value: string) => {
    updateProfile("journalStartTime", {
      ...userProfile.journalStartTime,
      [period]: value,
    });
  };

  //===============================================================================================
  // UPDATE DISCIPLINE VALUES
  const updateDisciplinesValues = async (
    disciplineUpdates: Record<string, number>
  ) => {
    if (!session?.user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    // Cancel any in-progress update
    if (disciplinesUpdateAbortControllerRef.current) {
      disciplinesUpdateAbortControllerRef.current.abort();
    }

    // Create a new AbortController
    disciplinesUpdateAbortControllerRef.current = new AbortController();
    const { signal } = disciplinesUpdateAbortControllerRef.current;

    setSubmittingDisciplinesValuesUpdate(true);
    setUpdateDisciplinesValuesError(null);

    // Create a copy of the current disciplines for optimistic update
    const currentDisciplines = { ...userProfile.disciplines };

    // Apply optimistic update
    setUserProfile((prev) => ({
      ...prev,
      disciplines: {
        ...prev.disciplines,
        ...disciplineUpdates,
      },
    }));

    try {
      const payload = {
        userId: session.user.id,
        disciplines: disciplineUpdates,
      };

      const response = await fetch(
        `/api/users/${session.user.id}/profile/disciplines`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal,
        }
      );

      if (signal.aborted) return;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update disciplines");
      }

      const result = await response.json();
      //FIX 2
      // if (!result?.disciplines) {
      //   console.warn(
      //     "=====⚠️ Missing disciplines in updateDisciplinesValues response:",
      //     result
      //   );
      // }
      setUserProfile((prev) => ({
        ...prev,
        disciplines: result.disciplines ?? prev.disciplines ?? {},
      }));

      return { success: true, data: result };
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.warn("Update disciplines request was aborted");
        return;
      }

      //FIX: 3
      // console.warn("=====Rolling back to:", currentDisciplines);

      // Rollback optimistic update on error
      setUserProfile((prev) => ({
        ...prev,
        disciplines: currentDisciplines || {},
      }));

      console.error("Error updating disciplines:", error);
      setUpdateDisciplinesValuesError(
        (error as Error).message || "Failed to update disciplines"
      );
      return { success: false, error: (error as Error).message };
    } finally {
      if (!signal.aborted) {
        setSubmittingDisciplinesValuesUpdate(false);
      }

      // Clear the ref after completion if it's the same controller
      if (
        disciplinesUpdateAbortControllerRef.current &&
        signal === disciplinesUpdateAbortControllerRef.current.signal
      ) {
        disciplinesUpdateAbortControllerRef.current = null;
      }
    }
  };

  //TEST
  useEffect(() => {
    if (
      !userProfile.disciplines ||
      Object.keys(userProfile.disciplines).length === 0
    ) {
      // console.warn(
      //   "=========🛑 userProfile.disciplines is missing or empty!",
      //   userProfile
      // );
    } else {
      // console.log(
      //   "=========✅ userProfile.disciplines updated",
      //   userProfile.disciplines
      // );
    }
  }, [userProfile.disciplines]);

  //===============================================================================================
  // UPDATE ACTIVE DISCIPLINES LIST (steps to render in JOURNAL)
  const updateActiveDiscipline = async (
    disciplineId: string,
    isActive: boolean
  ) => {
    if (!userProfile || !session?.user?.id) return;

    // Cancel any in-progress update
    if (activeUpdateAbortControllerRef.current) {
      activeUpdateAbortControllerRef.current.abort();
    }

    // Create a new AbortController
    activeUpdateAbortControllerRef.current = new AbortController();
    const { signal } = activeUpdateAbortControllerRef.current;

    // Set loading state
    setSubmittingActiveUpdate(true);
    setUpdateActiveError(null);

    const current = [...userProfile.activeDisciplines];
    const nextDisciplines = isActive
      ? [...current, disciplineId]
      : current.filter((id) => id !== disciplineId);

    // Optimistically update local state
    setUserProfile({
      ...userProfile,
      activeDisciplines: nextDisciplines,
    });

    try {
      const action = isActive ? "add" : "remove";
      const response = await fetch(
        `/api/users/${session.user.id}/disciplines/active`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ disciplineId, action }),
          signal, // Add signal to make the request abortable
        }
      );

      // Return early if the request was aborted
      if (signal.aborted) return;

      if (!response.ok) {
        throw new Error("Failed to update discipline on server");
      }

      const data = await response.json();

      // Sync state from server
      setUserProfile((prev) => ({
        ...prev!,
        activeDisciplines: data.activeDisciplines,
      }));
    } catch (error) {
      // Handle abort error separately
      if ((error as Error).name === "AbortError") {
        console.warn("Update active disciplines request was aborted");
        return;
      }

      console.error("Error updating active discipline:", error);
      setUpdateActiveError(
        (error as Error).message || "Failed to update active disciplines"
      );

      // Rollback optimistic update
      setUserProfile({
        ...userProfile,
        activeDisciplines: current,
      });

      // Optionally show toast/error message
    } finally {
      // Only update state if the request wasn't aborted
      if (!signal.aborted) {
        setSubmittingActiveUpdate(false);
      }

      // Clear the ref after completion if it's the same controller
      if (
        activeUpdateAbortControllerRef.current &&
        signal === activeUpdateAbortControllerRef.current.signal
      ) {
        activeUpdateAbortControllerRef.current = null;
      }
    }
  };

  // Create the context value
  const contextValue: UserProfileContextType = {
    userProfile,
    userProfileLoading,
    userProfileError,
    handleTimeChange,
    // UPDATE_DISC VALUES
    updateDisciplinesValues,
    submittingDisciplinesValuesUpdate,
    updateDisciplinesValuesError,
    // UPDATE_ACTIVE_DISC list with IDS
    updateActiveDiscipline,
    submittingActiveUpdate,
    updateActiveError,
  };

  // Provide the context to children components
  return (
    <UserProfileContext.Provider value={contextValue}>
      {children}
    </UserProfileContext.Provider>
  );
}

// Custom hook to use the UserProfileContext
export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error(
      "useUserProfile must be used within a UserSettingsProvider"
    );
  }
  return context;
}
