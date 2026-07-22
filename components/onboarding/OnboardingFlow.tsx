"use client";

import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { FormStepNavigation } from "@components/FormStepNavigation";
import { OnboardingStepper } from "./OnboardingStepper";
import { Welcome } from "./Welcome";
import { PreMadePractices } from "@components/practices/PreMadePractices";
import { PracticeOverview } from "@components/settings/PracticeOverview";
import { JournalEntryActionButton } from "@components/journal/JournalEntryActionButton";
import { LoadingScreen } from "@components/skeletons/LoadingScreen";
import { useOnboardingCompletion } from "@hooks/user/useOnboardingCompletion";
import type { User } from "@models/types";

export function OnboardingFlow() {
  const { completeOnboarding, isLoading, error } = useOnboardingCompletion();
  const { user } = useUser() as { user: User | null };
  const { signOut } = useClerk();

  const firstName = user?.firstName || "there";

  const steps = [
    {
      id: 1,
      title: `Hello, ${firstName}!`,
      content: <Welcome firstName={firstName} />,
    },
    {
      id: 2,
      title: "Pick Your First Practice",
      content: <PreMadePractices onboarding />,
    },
    {
      id: 3,
      title: "Manage Your Practices",
      description:
        "Toggle practices on or off - active ones will appear in your daily journal.",
      content: <PracticeOverview showCreateCard={false} />,
    },
  ];

  const [currentStep, setCurrentStep] = useState(1);
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

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" });
  };

  if (!user) return <LoadingScreen />;

  return (
    <div className="h-full flex flex-col sm:pt-2">
      <OnboardingStepper
        steps={steps}
        currentStep={currentStep}
        progress={progress}
        onStepSelect={setCurrentStep}
      />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-auto border rounded-3xl">
        {/* Sticky Header Section */}
        <div
          className={`sticky top-0 bg-card z-10 ${
            isFirstStep ? "hidden" : ""
          }`}
        >
          <div className="text-center pt-8">
            <h2
              className={`text-2xl sm:text-3xl font-bold ${
                currentStepData?.description ? "mb-2" : "mb-6"
              }`}
            >
              {currentStepData?.title}
            </h2>
            {currentStepData?.description && (
              <p className="text-sm text-muted-foreground mt-6 mb-10 max-w-md mx-6">
                {currentStepData.description}
              </p>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full px-4 pt-0">{currentStepData?.content}</div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Fixed Navigation Footer */}
      <div className="flex-shrink-0 bg-card h-20">
        <div className="h-full flex items-center px-4">
          <FormStepNavigation
            stepsLength={steps.length}
            currentStepIndex={currentStep - 1}
            onPrev={handlePrevious}
            onNext={handleNext}
            onCancel={handleSignOut}
            disabled={isLoading}
            lastStepAction={
              <JournalEntryActionButton
                text={isLoading ? "Completing Setup..." : "Start the Loop"}
                handleClick={completeOnboarding}
                handleDisabled={isLoading}
                isSubmitting={isLoading}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
