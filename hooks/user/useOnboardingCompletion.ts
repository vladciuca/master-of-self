import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useCreateJournalEntry } from "@hooks/journal/useCreateJournalEntry";
import { useUserProfile } from "@context/UserProfileContext";
import type { User } from "@models/types";

export function useOnboardingCompletion() {
  const router = useRouter();
  const { user } = useUser() as { user: User | null };
  const { updateOnboardingStatus } = useUserProfile();
  const {
    createJournalEntry,
    submittingJournalEntry,
    createJournalEntryError,
  } = useCreateJournalEntry();

  const [isCompletingOnboarding, setIsCompletingOnboarding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patchOnboardingStatus = async () => {
    if (!user?.id) {
      throw new Error("No user ID found");
    }

    const response = await fetch(`/api/users/${user.id}/onboarding`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: true }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Failed to complete onboarding:", responseData);
      throw new Error(responseData.error || "Failed to complete onboarding");
    }

    return responseData;
  };

  const completeOnboarding = async () => {
    setIsCompletingOnboarding(true);
    setError(null);

    try {
      updateOnboardingStatus(true);

      const [, newEntryId] = await Promise.all([
        patchOnboardingStatus(),
        createJournalEntry(),
      ]);

      router.push(`/update-journal-entry/${newEntryId}`);
    } catch (err) {
      console.error("Error during onboarding completion:", err);

      updateOnboardingStatus(false);

      if (err instanceof Error) {
        setError(err.message);
      } else if (createJournalEntryError) {
        setError("Failed to create journal entry");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsCompletingOnboarding(false);
    }
  };

  return {
    completeOnboarding,
    isLoading: isCompletingOnboarding || submittingJournalEntry,
    error,
  };
}
