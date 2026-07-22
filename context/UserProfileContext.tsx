// "use client";

// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useRef,
//   type ReactNode,
// } from "react";
// import type { UserProfile } from "@models/types";

// type UserProfileContextType = {
//   userProfile: UserProfile;
//   userProfileLoading: boolean;
//   userProfileError: string | null;
//   //UPDATE USER JOURNAL TIMES================================================================
//   handleTimeChange: (period: "morning" | "evening", value: string) => void;
//   //UPDATE ACTIVE DISCIPLINE LIST============================================================
//   updateActivePractice: (practiceId: string, isActive: boolean) => void;
//   submittingActiveUpdate: boolean;
//   updateActiveError: string | null;
//   //UPDATE DISCIPLINE VALUES=================================================================
//   updatePracticesValues: (
//     practiceUpdates: Record<string, number>
//   ) => Promise<{ success: boolean; data?: any; error?: string } | undefined>;
//   submittingPracticesValuesUpdate: boolean;
//   updatePracticesValuesError: string | null;
// };

// // Create the context
// const UserProfileContext = createContext<UserProfileContextType | undefined>(
//   undefined
// );

// // Create a provider component
// export function UserProfileProvider({ children }: { children: ReactNode }) {
//   const { data: session } = useSession() as { data: Session | null };

//   const [userProfile, setUserProfile] = useState<UserProfile>({
//     willpowerMultiplier: 1.5,
//     disciplines: {},
//     activePractices: [],
//     journalStartTime: {
//       morning: "08:00",
//       evening: "18:00",
//     },
//     onboardingCompleted: false, // Add the onboarding flag
//   });
//   const [userProfileLoading, setUserProfileLoading] = useState(true);
//   const [userProfileError, setUserProfileError] = useState<string | null>(null);

//   // State for discipline value updates
//   const [
//     submittingPracticesValuesUpdate,
//     setSubmittingPracticesValuesUpdate,
//   ] = useState(false);
//   const [updatePracticesValuesError, setUpdatePracticesValuesError] =
//     useState<string | null>(null);

//   //  State for Active Discipline ID list
//   const [submittingActiveUpdate, setSubmittingActiveUpdate] = useState(false);
//   const [updateActiveError, setUpdateActiveError] = useState<string | null>(
//     null
//   );

//   const fetchAbortControllerRef = useRef<AbortController | null>(null);
//   const updateAbortControllerRef = useRef<AbortController | null>(null);
//   // ref for DISCIPLINE VALUE updates
//   const practicesUpdateAbortControllerRef = useRef<AbortController | null>(
//     null
//   );
//   // ref for ACTIVE DISCIPLINE ID LIST updates
//   const activeUpdateAbortControllerRef = useRef<AbortController | null>(null);

//   // Cleanup effect
//   useEffect(() => {
//     return () => {
//       // Clean up all abort controllers on unmount
//       [
//         fetchAbortControllerRef,
//         updateAbortControllerRef,
//         practicesUpdateAbortControllerRef,
//         activeUpdateAbortControllerRef,
//       ].forEach((ref) => {
//         if (ref.current) {
//           ref.current.abort();
//           ref.current = null;
//         }
//       });
//     };
//   }, []);

//   // Fetch user profile from the server
//   useEffect(() => {
//     if (!user?.id) return;

//     // Cancel any in-progress fetch
//     if (fetchAbortControllerRef.current) {
//       fetchAbortControllerRef.current.abort();
//       fetchAbortControllerRef.current = null;
//     }

//     // Create a new AbortController for this fetch
//     fetchAbortControllerRef.current = new AbortController();
//     const { signal } = fetchAbortControllerRef.current;

//     setUserProfileError(null);
//     setUserProfileLoading(true);

//     const fetchUserProfile = async () => {
//       try {
//         const response = await fetch(`/api/users/${user.id}/profile`, {
//           signal,
//         });

//         if (signal.aborted) return;

//         if (!response.ok) {
//           throw new Error("Failed to fetch user profile");
//         }

//         const { profile } = await response.json();

//         setUserProfile((prev) => ({
//           ...prev,
//           ...profile,
//           disciplines: profile.disciplines ?? prev.disciplines ?? {},
//           onboardingCompleted: profile.onboardingCompleted ?? false, // Handle onboarding flag
//         }));
//       } catch (error) {
//         // Only set error if it's not an abort error
//         if (error instanceof Error && error.name !== "AbortError") {
//           console.error("Failed to fetch user profile", error);
//           setUserProfileError("Failed to fetch user profile");
//         }
//       } finally {
//         // Only update loading state if the request wasn't aborted
//         if (!signal.aborted) {
//           setUserProfileLoading(false);
//         }
//       }
//     };

//     fetchUserProfile();

//     // Cleanup function
//     return () => {
//       if (fetchAbortControllerRef.current) {
//         fetchAbortControllerRef.current.abort();
//         fetchAbortControllerRef.current = null;
//       }
//     };
//   }, [user?.id]);

//   // Rest of your existing methods remain the same...
//   const updateProfile = async (key: keyof UserProfile, value: any) => {
//     if (!user?.id) return;

//     // Cancel any in-progress update
//     if (updateAbortControllerRef.current) {
//       updateAbortControllerRef.current.abort();
//     }

//     // Create a new AbortController for this update
//     updateAbortControllerRef.current = new AbortController();
//     const { signal } = updateAbortControllerRef.current;

//     try {
//       const response = await fetch(`/api/users/${user.id}/profile`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ [key]: value }),
//         signal,
//       });

//       if (signal.aborted) return;

//       if (response.ok) {
//         // Update local state immediately
//         setUserProfile((prev) => ({ ...prev, [key]: value }));
//       } else {
//         console.error("Failed to update profile");
//       }
//     } catch (error) {
//       if (error instanceof Error && error.name !== "AbortError") {
//         console.error("Error updating setting", error);
//       }
//     } finally {
//       // Clear the ref after completion if it's the same controller
//       if (
//         updateAbortControllerRef.current &&
//         signal === updateAbortControllerRef.current.signal
//       ) {
//         updateAbortControllerRef.current = null;
//       }
//     }
//   };

//   const handleTimeChange = (period: "morning" | "evening", value: string) => {
//     updateProfile("journalStartTime", {
//       ...userProfile.journalStartTime,
//       [period]: value,
//     });
//   };

//   const updatePracticesValues = async (
//     practiceUpdates: Record<string, number>
//   ) => {
//     if (!user?.id) {
//       return { success: false, error: "User not authenticated" };
//     }

//     // Cancel any in-progress update
//     if (practicesUpdateAbortControllerRef.current) {
//       practicesUpdateAbortControllerRef.current.abort();
//     }

//     // Create a new AbortController
//     practicesUpdateAbortControllerRef.current = new AbortController();
//     const { signal } = practicesUpdateAbortControllerRef.current;

//     setSubmittingPracticesValuesUpdate(true);
//     setUpdatePracticesValuesError(null);

//     // Create a copy of the current disciplines for optimistic update
//     const currentPractices = { ...userProfile.disciplines };

//     // Apply optimistic update
//     setUserProfile((prev) => ({
//       ...prev,
//       disciplines: {
//         ...prev.disciplines,
//         ...practiceUpdates,
//       },
//     }));

//     try {
//       const payload = {
//         userId: user.id,
//         disciplines: practiceUpdates,
//       };

//       const response = await fetch(
//         `/api/users/${user.id}/profile/disciplines`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//           signal,
//         }
//       );

//       if (signal.aborted) return;

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to update disciplines");
//       }

//       const result = await response.json();

//       setUserProfile((prev) => ({
//         ...prev,
//         disciplines: result.disciplines ?? prev.disciplines ?? {},
//       }));

//       return { success: true, data: result };
//     } catch (error) {
//       if ((error as Error).name === "AbortError") {
//         console.warn("Update disciplines request was aborted");
//         return;
//       }

//       // Rollback optimistic update on error
//       setUserProfile((prev) => ({
//         ...prev,
//         disciplines: currentPractices || {},
//       }));

//       console.error("Error updating disciplines:", error);
//       setUpdatePracticesValuesError(
//         (error as Error).message || "Failed to update disciplines"
//       );
//       return { success: false, error: (error as Error).message };
//     } finally {
//       if (!signal.aborted) {
//         setSubmittingPracticesValuesUpdate(false);
//       }

//       // Clear the ref after completion if it's the same controller
//       if (
//         practicesUpdateAbortControllerRef.current &&
//         signal === practicesUpdateAbortControllerRef.current.signal
//       ) {
//         practicesUpdateAbortControllerRef.current = null;
//       }
//     }
//   };

//   const updateActivePractice = async (
//     practiceId: string,
//     isActive: boolean
//   ) => {
//     if (!userProfile || !user?.id) return;

//     // Cancel any in-progress update
//     if (activeUpdateAbortControllerRef.current) {
//       activeUpdateAbortControllerRef.current.abort();
//     }

//     // Create a new AbortController
//     activeUpdateAbortControllerRef.current = new AbortController();
//     const { signal } = activeUpdateAbortControllerRef.current;

//     // Set loading state
//     setSubmittingActiveUpdate(true);
//     setUpdateActiveError(null);

//     const current = [...userProfile.activePractices];
//     const nextDisciplines = isActive
//       ? [...current, practiceId]
//       : current.filter((id) => id !== practiceId);

//     // Optimistically update local state
//     setUserProfile({
//       ...userProfile,
//       activePractices: nextDisciplines,
//     });

//     try {
//       const action = isActive ? "add" : "remove";
//       const response = await fetch(
//         `/api/users/${user.id}/practices/active`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ practiceId, action }),
//           signal,
//         }
//       );

//       // Return early if the request was aborted
//       if (signal.aborted) return;

//       if (!response.ok) {
//         throw new Error("Failed to update discipline on server");
//       }

//       const data = await response.json();

//       // Sync state from server
//       setUserProfile((prev) => ({
//         ...prev!,
//         activePractices: data.activePractices,
//       }));
//     } catch (error) {
//       // Handle abort error separately
//       if ((error as Error).name === "AbortError") {
//         console.warn("Update active disciplines request was aborted");
//         return;
//       }

//       console.error("Error updating active discipline:", error);
//       setUpdateActiveError(
//         (error as Error).message || "Failed to update active disciplines"
//       );

//       // Rollback optimistic update
//       setUserProfile({
//         ...userProfile,
//         activePractices: current,
//       });
//     } finally {
//       // Only update state if the request wasn't aborted
//       if (!signal.aborted) {
//         setSubmittingActiveUpdate(false);
//       }

//       // Clear the ref after completion if it's the same controller
//       if (
//         activeUpdateAbortControllerRef.current &&
//         signal === activeUpdateAbortControllerRef.current.signal
//       ) {
//         activeUpdateAbortControllerRef.current = null;
//       }
//     }
//   };

//   // Create the context value
//   const contextValue: UserProfileContextType = {
//     userProfile,
//     userProfileLoading,
//     userProfileError,
//     handleTimeChange,
//     // UPDATE_DISC VALUES
//     updatePracticesValues,
//     submittingPracticesValuesUpdate,
//     updatePracticesValuesError,
//     // UPDATE_ACTIVE_DISC list with IDS
//     updateActivePractice,
//     submittingActiveUpdate,
//     updateActiveError,
//   };

//   // Provide the context to children components
//   return (
//     <UserProfileContext.Provider value={contextValue}>
//       {children}
//     </UserProfileContext.Provider>
//   );
// }

// // Custom hook to use the UserProfileContext
// export function useUserProfile() {
//   const context = useContext(UserProfileContext);
//   if (context === undefined) {
//     throw new Error(
//       "useUserProfile must be used within a UserSettingsProvider"
//     );
//   }
//   return context;
// }

//=============================================================================================

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import type { User, UserProfile } from "@models/types";

type UserProfileContextType = {
  userProfile: UserProfile;
  userProfileLoading: boolean;
  userProfileError: string | null;
  // Add method to update onboarding status locally
  updateOnboardingStatus: (completed: boolean) => void;
  //UPDATE USER JOURNAL TIMES================================================================
  handleTimeChange: (period: "morning" | "evening", value: string) => void;
  //UPDATE ACTIVE PRACTICE LIST============================================================
  updateActivePractice: (practiceId: string, isActive: boolean) => void;
  submittingActiveUpdate: boolean;
  updateActiveError: string | null;
  updatePracticeOrder: (practiceOrder: string[]) => Promise<void>;
  //UPDATE PRACTICE VALUES=================================================================
  updatePracticesValues: (
    practiceUpdates: Record<string, number>
  ) => Promise<{ success: boolean; data?: any; error?: string } | undefined>;
  submittingPracticesValuesUpdate: boolean;
  updatePracticesValuesError: string | null;
  deletePracticeFromProfile: (practiceId: string) => Promise<void>;
};

// Create the context
const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

// Create a provider component
export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useUser() as { user: User | null };

  const [userProfile, setUserProfile] = useState<UserProfile>({
    willpowerMultiplier: 1.5,
    disciplines: {},
    practices: {},
    activePractices: [],
    practiceOrder: [],
    journalStartTime: {
      morning: "08:00",
      evening: "18:00",
    },
    onboardingCompleted: false, // Add the onboarding flag
  });
  const [userProfileLoading, setUserProfileLoading] = useState(true);
  const [userProfileError, setUserProfileError] = useState<string | null>(null);

  // State for practice value updates
  const [
    submittingPracticesValuesUpdate,
    setSubmittingPracticesValuesUpdate,
  ] = useState(false);
  const [updatePracticesValuesError, setUpdatePracticesValuesError] =
    useState<string | null>(null);

  //  State for Active Practice ID list
  const [submittingActiveUpdate, setSubmittingActiveUpdate] = useState(false);
  const [updateActiveError, setUpdateActiveError] = useState<string | null>(
    null
  );

  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const updateAbortControllerRef = useRef<AbortController | null>(null);
  // ref for PRACTICE VALUE updates
  const practicesUpdateAbortControllerRef = useRef<AbortController | null>(
    null
  );
  // ref for ACTIVE PRACTICE ID LIST updates
  const activeUpdateAbortControllerRef = useRef<AbortController | null>(null);

  // Method to update onboarding status locally (optimistic update)
  const updateOnboardingStatus = useCallback((completed: boolean) => {
    setUserProfile((prev) => ({
      ...prev,
      onboardingCompleted: completed,
    }));
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clean up all abort controllers on unmount
      [
        fetchAbortControllerRef,
        updateAbortControllerRef,
        practicesUpdateAbortControllerRef,
        activeUpdateAbortControllerRef,
      ].forEach((ref) => {
        if (ref.current) {
          ref.current.abort();
          ref.current = null;
        }
      });
    };
  }, []);

  // Fetch user profile from the server
  useEffect(() => {
    if (!user?.id) return;

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
        const response = await fetch(`/api/users/${user.id}/profile`, {
          signal,
        });

        if (signal.aborted) return;

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const { profile } = await response.json();

        setUserProfile((prev) => ({
          ...prev,
          ...profile,
          disciplines: profile.disciplines ?? prev.disciplines ?? {},
          practices: profile.practices ?? prev.practices ?? {},
          activePractices: profile.activePractices ?? prev.activePractices ?? [],
          onboardingCompleted: profile.onboardingCompleted ?? false, // Handle onboarding flag
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
  }, [user?.id]);

  // Rest of your existing methods remain the same...
  const updateProfile = async (key: keyof UserProfile, value: any) => {
    if (!user?.id) return;

    // Cancel any in-progress update
    if (updateAbortControllerRef.current) {
      updateAbortControllerRef.current.abort();
    }

    // Create a new AbortController for this update
    updateAbortControllerRef.current = new AbortController();
    const { signal } = updateAbortControllerRef.current;

    try {
      const response = await fetch(`/api/users/${user.id}/profile`, {
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

  const handleTimeChange = (period: "morning" | "evening", value: string) => {
    updateProfile("journalStartTime", {
      ...userProfile.journalStartTime,
      [period]: value,
    });
  };

  const updatePracticesValues = async (
    practiceUpdates: Record<string, number>
  ) => {
    if (!user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    // Cancel any in-progress update
    if (practicesUpdateAbortControllerRef.current) {
      practicesUpdateAbortControllerRef.current.abort();
    }

    // Create a new AbortController
    practicesUpdateAbortControllerRef.current = new AbortController();
    const { signal } = practicesUpdateAbortControllerRef.current;

    setSubmittingPracticesValuesUpdate(true);
    setUpdatePracticesValuesError(null);

    // Create a copy of the current practices for optimistic update
    const currentPractices = { ...userProfile.practices };

    // Apply optimistic update
    setUserProfile((prev) => ({
      ...prev,
      practices: {
        ...prev.practices,
        ...practiceUpdates,
      },
    }));

    try {
      const payload = {
        userId: user.id,
        practices: practiceUpdates,
      };

      const response = await fetch(
        `/api/users/${user.id}/profile/practices`,
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
        throw new Error(errorData.error || "Failed to update practices");
      }

      const result = await response.json();

      setUserProfile((prev) => ({
        ...prev,
        practices: result.practices ?? prev.practices ?? {},
      }));

      return { success: true, data: result };
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.warn("Update practices request was aborted");
        return;
      }

      // Rollback optimistic update on error
      setUserProfile((prev) => ({
        ...prev,
        practices: currentPractices || {},
      }));

      console.error("Error updating practices:", error);
      setUpdatePracticesValuesError(
        (error as Error).message || "Failed to update practices"
      );
      return { success: false, error: (error as Error).message };
    } finally {
      if (!signal.aborted) {
        setSubmittingPracticesValuesUpdate(false);
      }

      // Clear the ref after completion if it's the same controller
      if (
        practicesUpdateAbortControllerRef.current &&
        signal === practicesUpdateAbortControllerRef.current.signal
      ) {
        practicesUpdateAbortControllerRef.current = null;
      }
    }
  };

  const updateActivePractice = async (
    practiceId: string,
    isActive: boolean
  ) => {
    if (!userProfile || !user?.id) return;

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

    const current = [...userProfile.activePractices];
    const nextPractices = isActive
      ? [...current, practiceId]
      : current.filter((id) => id !== practiceId);

    // Optimistically update local state
    setUserProfile((prev) => ({
      ...prev,
      activePractices: nextPractices,
    }));

    try {
      const action = isActive ? "add" : "remove";
      const response = await fetch(
        `/api/users/${user.id}/practices/active`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ practiceId, action }),
          signal,
        }
      );

      // Return early if the request was aborted
      if (signal.aborted) return;

      if (!response.ok) {
        throw new Error("Failed to update practice on server");
      }

      const data = await response.json();

      // Sync state from server
      setUserProfile((prev) => ({
        ...prev!,
        activePractices: data.activePractices,
      }));
    } catch (error) {
      // Handle abort error separately
      if ((error as Error).name === "AbortError") {
        console.warn("Update active practices request was aborted");
        return;
      }

      console.error("Error updating active practice:", error);
      setUpdateActiveError(
        (error as Error).message || "Failed to update active practices"
      );

      // Rollback optimistic update
      setUserProfile((prev) => ({
        ...prev,
        activePractices: current,
      }));
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

  const updatePracticeOrder = async (practiceOrder: string[]) => {
    if (!userProfile || !user?.id) return;

    const current = [...(userProfile.practiceOrder ?? [])];

    setUserProfile((prev) => ({
      ...prev,
      practiceOrder,
    }));

    try {
      const response = await fetch(`/api/users/${user.id}/practice-order`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ practiceOrder }),
      });

      if (!response.ok) {
        throw new Error("Failed to update practice order on server");
      }

      const data = await response.json();

      setUserProfile((prev) => ({
        ...prev,
        practiceOrder: data.practiceOrder,
      }));
    } catch (error) {
      console.error("Error updating practice order:", error);

      setUserProfile((prev) => ({
        ...prev,
        practiceOrder: current,
      }));
    }
  };

  const deletePracticeFromProfile = async (practiceId: string) => {    if (!user?.id) return;

    const response = await fetch(`/api/practice/${practiceId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete practice");
    }

    setUserProfile((prev) => {
      const nextPractices = { ...prev.practices };
      delete nextPractices[practiceId];

      return {
        ...prev,
        practices: nextPractices,
        activePractices: prev.activePractices.filter(
          (id) => id !== practiceId
        ),
      };
    });
  };

  // Create the context value
  const contextValue: UserProfileContextType = {
    userProfile,
    userProfileLoading,
    userProfileError,
    updateOnboardingStatus,
    handleTimeChange,
    // UPDATE_PRACTICE VALUES
    updatePracticesValues,
    submittingPracticesValuesUpdate,
    updatePracticesValuesError,
    // UPDATE_ACTIVE_PRACTICE list with IDS
    updateActivePractice,
    submittingActiveUpdate,
    updateActiveError,
    updatePracticeOrder,
    deletePracticeFromProfile,
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
