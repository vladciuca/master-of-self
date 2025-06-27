"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";

import { Welcome } from "./Welcome";
import { PreMade } from "@components/disciplines/PreMade";
import { UserDisciplines } from "@components/disciplines/UserDisciplines";
// import { UserProfileOverview } from "@components/profile/UserProfileOverview";
import { JournalEntryActionButton } from "@components/journal/JournalEntryActionButton";
import { useCreateJournalEntry } from "@hooks/journal/useCreateJournalEntry";
import { useUserProfile } from "@context/UserProfileContext";
import type { Session } from "@models/types";
import { LoadingScreen } from "@components/skeletons/LoadingScreen";

export function OnboardingFlow() {
  const router = useRouter();
  const {
    createJournalEntry,
    submittingJournalEntry,
    createJournalEntryError,
  } = useCreateJournalEntry();

  // Get context methods for updating onboarding status
  const { updateOnboardingStatus } = useUserProfile();
  const { data: session } = useSession() as { data: Session | null };

  const firstName = session?.user?.name?.split(" ")[0] || "there";

  const steps = [
    {
      id: 1,
      title: `Hello, ${firstName}!`,
      subtitle:
        "Begin building the best version of yourself, one thought at a time.",
      content: <Welcome firstName={firstName} />,
    },
    {
      id: 2,
      title: "Pick Your First Discipline",
      subtitle: "Focus your energy on what you want to grow.",
      content: <PreMade onboarding />,
    },
    {
      id: 3,
      title: "Craft Your Discipline Loop",
      subtitle: "Daily prompts fuel clarity, direction, and self-awareness.",
      content: <UserDisciplines onboarding />,
    },
    // {
    //   id: 4,
    //   title: "Your Growth Dashboard",
    //   subtitle: "",
    //   content: (
    //     <UserProfileOverview
    //       userId={session?.user.id}
    //       notCurrentUser={false}
    //       onboarding
    //     />
    //   ),
    // },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [isCompletingOnboarding, setIsCompletingOnboarding] = useState(false);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);
  const progress = (currentStep / steps.length) * 100;

  const currentStepData = steps.find((step) => step.id === currentStep);
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Function to complete onboarding
  const completeOnboarding = async () => {
    if (!session?.user.id) {
      throw new Error("No user ID found");
    }

    const response = await fetch(`/api/users/${session?.user.id}/onboarding`, {
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

  // Combined function that runs both operations in parallel
  const handleCompleteOnboardingAndCreateJournal = async () => {
    setIsCompletingOnboarding(true);
    setOnboardingError(null);

    try {
      // Update context immediately (optimistic update)
      updateOnboardingStatus(true);

      // Run both operations in parallel using Promise.all
      const [onboardingResult, newEntryId] = await Promise.all([
        completeOnboarding(),
        createJournalEntry(),
      ]);

      console.log("Onboarding completed:", onboardingResult);
      console.log("Journal entry created:", newEntryId);

      // Navigate to the journal entry page
      router.push(`/update-journal-entry/${newEntryId}`);
    } catch (error) {
      console.error("Error during onboarding completion:", error);

      // Rollback optimistic update on error
      updateOnboardingStatus(false);

      // Handle different types of errors
      if (error instanceof Error) {
        setOnboardingError(error.message);
      } else if (createJournalEntryError) {
        setOnboardingError("Failed to create journal entry");
      } else {
        setOnboardingError("An unexpected error occurred");
      }
    } finally {
      setIsCompletingOnboarding(false);
    }
  };

  // Determine if we're in a loading state
  const isLoading = isCompletingOnboarding || submittingJournalEntry;

  if (!session) return <LoadingScreen />;

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Progress Header */}
      <div className="flex-shrink-0 bg-card h-20">
        <div className="container max-w-4xl mx-auto px-4 h-full flex items-center">
          <div className="w-full space-y-2">
            <div className="flex w-full items-center justify-end">
              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-auto border rounded-3xl">
        {/* Sticky Header Section */}
        {/* <div className="sticky top-0 bg-card z-10"> */}
        <div
          className={`sticky top-0 bg-card z-10 ${
            currentStep === 1 ? "hidden" : ""
          }`}
        >
          <div className="text-center py-8 px-4">
            <h2 className="text-3xl font-bold mb-2">
              {currentStepData?.title}
            </h2>

            <p className="text-lg text-muted-foreground">
              {currentStepData?.subtitle}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full px-4">{currentStepData?.content}</div>

        {/* Error Display */}
        {onboardingError && (
          <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{onboardingError}</p>
          </div>
        )}
      </div>

      {/* Fixed Navigation Footer */}
      <div className="flex-shrink-0 bg-card h-20">
        <div className="container max-w-4xl mx-auto h-full flex items-center justify-center px-8">
          <div className="flex justify-between items-center w-full">
            {!isFirstStep && (
              <Button
                className={isLastStep ? "w-16" : "w-[40%]"}
                disabled={isFirstStep || isLoading}
                variant="secondary"
                type="button"
                onClick={handlePrevious}
              >
                <RxChevronLeft />
                {!isLastStep && "Back"}
              </Button>
            )}

            {isLastStep ? (
              <div className={isFirstStep ? "w-full" : "flex-1 ml-4"}>
                <JournalEntryActionButton
                  text={
                    isLoading ? "Completing Setup..." : "Start Your Journey"
                  }
                  handleClick={handleCompleteOnboardingAndCreateJournal}
                  handleDisabled={isLoading}
                  isSubmitting={isLoading}
                />
              </div>
            ) : (
              <Button
                className={isFirstStep ? "w-full" : "w-[40%]"}
                variant="default"
                type="button"
                onClick={handleNext}
                disabled={isLoading}
              >
                Next
                <RxChevronRight />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
