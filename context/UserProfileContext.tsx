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
import type { Session, UserProfile } from "@models/types";

// Define the shape of our context
interface UserProfileContextType {
  userProfile: UserProfile;
  userProfileLoading: boolean;
  userProfileError: string | null;
  // handleRoutineChange: (
  //   step: "gratitude" | "reflection" | "affirmations"
  // ) => void;
  handleTimeChange: (period: "morning" | "evening", value: string) => void;
  refetchUserProfile: () => void;
}

// Create the context
const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

// Create a provider component
export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession() as { data: Session | null };

  const [userProfile, setUserProfile] = useState<UserProfile>({
    // steps: {
    //   gratitude: false,
    //   affirmations: false,
    //   reflection: false,
    // },
    willpowerSMultiplier: 1.5,
    disciplines: {
      motivation: 0,
    },
    journalStartTime: {
      morning: "08:00",
      evening: "18:00",
    },
  });
  const [userProfileLoading, setUserProfileLoading] = useState(true);
  const [userProfileError, setUserProfileError] = useState<string | null>(null);

  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const updateAbortControllerRef = useRef<AbortController | null>(null);

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

  // // Fetch user profile from the server
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

  //   setUserProfileError(null);
  //   setUserProfileLoading(true);

  //   const fetchUserProfile = async () => {
  //     try {
  //       const response = await fetch(`/api/users/${session.user.id}/profile`, {
  //         signal,
  //       });

  //       if (signal.aborted) return;

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch user profile");
  //       }

  //       const { profile } = await response.json();
  //       setUserProfile(profile);
  //     } catch (error) {
  //       // Only set error if it's not an abort error
  //       if (error instanceof Error && error.name !== "AbortError") {
  //         console.error("Failed to fetch user profile", error);
  //         setUserProfileError("Failed to fetch user profile");
  //       }
  //     } finally {
  //       // Only update loading state if the request wasn't aborted
  //       if (!signal.aborted) {
  //         setUserProfileLoading(false);
  //       }
  //     }
  //   };

  //   fetchUserProfile();

  //   // Cleanup function
  //   return () => {
  //     if (fetchAbortControllerRef.current) {
  //       fetchAbortControllerRef.current.abort();
  //       fetchAbortControllerRef.current = null;
  //     }
  //   };
  // }, [session?.user?.id]);

  // NOTE: Extracted the fetch function in a useCallback to be able to call a refetch
  const fetchUserProfile = useCallback(async () => {
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

    try {
      const response = await fetch(`/api/users/${session.user.id}/profile`, {
        signal,
      });

      if (signal.aborted) return;

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const { profile } = await response.json();
      setUserProfile(profile);
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
  }, [session?.user?.id]);

  // Existing useEffect for initial fetch
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Update a specific setting
  // NOTE: add proper values here
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

  // Handle routine change
  // const handleRoutineChange = (
  //   step: "gratitude" | "reflection" | "affirmations"
  // ) => {
  //   const newValue = !userProfile.steps[step];
  //   updateProfile("steps", {
  //     ...userProfile.steps,
  //     [step]: newValue,
  //   });
  // };

  // Handle time change
  const handleTimeChange = (period: "morning" | "evening", value: string) => {
    updateProfile("journalStartTime", {
      ...userProfile.journalStartTime,
      [period]: value,
    });
  };

  // Create the context value
  const contextValue: UserProfileContextType = {
    userProfile,
    userProfileLoading,
    userProfileError,
    // handleRoutineChange,
    handleTimeChange,
    refetchUserProfile: fetchUserProfile,
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
