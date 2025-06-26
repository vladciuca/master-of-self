// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { CheckCircle } from "lucide-react";
// import { RxChevronLeft, RxChevronRight } from "react-icons/rx";

// import { PreMade } from "@components/disciplines/PreMade";
// import { UserDisciplines } from "@components/disciplines/UserDisciplines";
// import { UserProfileOverview } from "@components/profile/UserProfileOverview";
// import { JournalEntryActionButton } from "@components/journal/JournalEntryActionButton";
// import { useCreateJournalEntry } from "@hooks/journal/useCreateJournalEntry";

// export function OnboardingFlow({ userId }: { userId?: string }) {
//   const router = useRouter();
//   const {
//     createJournalEntry,
//     submittingJournalEntry,
//     createJournalEntryError,
//   } = useCreateJournalEntry();

//   const steps = [
//     {
//       id: 1,
//       title: "Welcome to Your Journey",
//       subtitle: "Build the perfect version of yourself",
//       content: (
//         <div className="space-y-6">
//           <div className="text-center space-y-4">
//             <h3 className="text-2xl font-semibold">
//               Ready to transform yourself?
//             </h3>
//             <p className="text-muted-foreground max-w-md mx-auto">
//               Our platform combines discipline tracking with habit formation to
//               help you become the best version of yourself.
//             </p>
//           </div>
//           <div className="grid gap-4 max-w-md mx-auto">
//             <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//               <CheckCircle className="w-5 h-5 text-green-500" />
//               <span className="text-sm">Track your disciplines</span>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//               <CheckCircle className="w-5 h-5 text-green-500" />
//               <span className="text-sm">Build lasting habits</span>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//               <CheckCircle className="w-5 h-5 text-green-500" />
//               <span className="text-sm">Monitor your progress</span>
//             </div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       id: 2,
//       title: "Choose a Discipline",
//       subtitle: "Add disciplines to your profile",
//       content: <PreMade />,
//     },
//     {
//       id: 3,
//       title: "Track and Manage your disciplines",
//       subtitle: "Pick and manage your disciplines",
//       content: <UserDisciplines onboarding />,
//     },
//     {
//       id: 4,
//       title: "Character Overview",
//       subtitle: "Your personal dashboard",
//       content: (
//         <UserProfileOverview
//           userId={userId}
//           notCurrentUser={false}
//           onboarding
//         />
//       ),
//     },
//   ];

//   const [currentStep, setCurrentStep] = useState(1);
//   const progress = (currentStep / steps.length) * 100;

//   const currentStepData = steps.find((step) => step.id === currentStep);
//   const isFirstStep = currentStep === 1;
//   const isLastStep = currentStep === steps.length;

//   const handleNext = () => {
//     if (!isLastStep) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (!isFirstStep) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleCreateJournalEntry = async () => {
//     try {
//       const newEntryId = await createJournalEntry();
//       router.push(`/update-journal-entry/${newEntryId}`);
//     } catch (error) {
//       console.error(
//         "Failed to create new journal entry:",
//         createJournalEntryError
//       );
//     }
//   };

//   return (
//     <div className="h-full flex flex-col">
//       {/* Fixed Progress Header */}
//       <div className="flex-shrink-0 bg-card h-20">
//         <div className="container max-w-4xl mx-auto px-4 h-full flex items-center">
//           <div className="w-full space-y-2">
//             <div className="flex w-full items-center justify-end">
//               <div className="text-sm text-muted-foreground">
//                 Step {currentStep} of {steps.length}
//               </div>
//             </div>
//             <Progress value={progress} className="h-2" />
//           </div>
//         </div>
//       </div>

//       {/* Scrollable Content Area */}
//       <div className="flex-1 overflow-auto border rounded-3xl">
//         {/* Sticky Header Section */}
//         <div className="sticky top-0 bg-card z-10">
//           <div className="text-center py-8 px-4">
//             <h2 className="text-3xl font-bold mb-2">
//               {currentStepData?.title}
//             </h2>
//             <p className="text-lg text-muted-foreground">
//               {currentStepData?.subtitle}
//             </p>
//           </div>
//         </div>

//         {/* Content Section */}
//         <div className="w-full px-4">{currentStepData?.content}</div>
//       </div>

//       {/* Fixed Navigation Footer */}
//       <div className="flex-shrink-0 bg-card h-20">
//         <div className="container max-w-4xl mx-auto h-full flex items-center justify-center px-8">
//           <div className="flex justify-between items-center w-full">
//             {!isFirstStep && (
//               <Button
//                 className={isLastStep ? "w-16" : "w-[40%]"}
//                 disabled={isFirstStep}
//                 variant="secondary"
//                 type="button"
//                 onClick={handlePrevious}
//               >
//                 <RxChevronLeft />
//                 {!isLastStep && "Back"}
//               </Button>
//             )}

//             {isLastStep ? (
//               <div className={isFirstStep ? "w-full" : "flex-1 ml-4"}>
//                 <JournalEntryActionButton
//                   text={
//                     submittingJournalEntry
//                       ? "Creating..."
//                       : "Start Your Journey"
//                   }
//                   handleClick={handleCreateJournalEntry}
//                   handleDisabled={submittingJournalEntry}
//                   isSubmitting={submittingJournalEntry}
//                 />
//               </div>
//             ) : (
//               <Button
//                 className={isFirstStep ? "w-full" : "w-[40%]"}
//                 variant="default"
//                 type="button"
//                 onClick={handleNext}
//               >
//                 Next
//                 <RxChevronRight />
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//================================================================================================
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { CheckCircle } from "lucide-react";
// import { RxChevronLeft, RxChevronRight } from "react-icons/rx";

// import { PreMade } from "@components/disciplines/PreMade";
// import { UserDisciplines } from "@components/disciplines/UserDisciplines";
// import { UserProfileOverview } from "@components/profile/UserProfileOverview";
// import { JournalEntryActionButton } from "@components/journal/JournalEntryActionButton";
// import { useCreateJournalEntry } from "@hooks/journal/useCreateJournalEntry";
// import type { Session } from "@models/types";

// export function OnboardingFlow() {
//   const router = useRouter();
//   const { data: session } = useSession() as { data: Session | null };
//   const {
//     createJournalEntry,
//     submittingJournalEntry,
//     createJournalEntryError,
//   } = useCreateJournalEntry();

//   // Add state for onboarding completion
//   const [isCompletingOnboarding, setIsCompletingOnboarding] = useState(false);
//   const [onboardingError, setOnboardingError] = useState<string | null>(null);

//   const steps = [
//     {
//       id: 1,
//       title: "Welcome to Your Journey",
//       subtitle: "Build the perfect version of yourself",
//       content: (
//         <div className="space-y-6">
//           <div className="text-center space-y-4">
//             <h3 className="text-2xl font-semibold">
//               Ready to transform yourself?
//             </h3>
//             <p className="text-muted-foreground max-w-md mx-auto">
//               Our platform combines discipline tracking with habit formation to
//               help you become the best version of yourself.
//             </p>
//           </div>
//           <div className="grid gap-4 max-w-md mx-auto">
//             <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//               <CheckCircle className="w-5 h-5 text-green-500" />
//               <span className="text-sm">Track your disciplines</span>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//               <CheckCircle className="w-5 h-5 text-green-500" />
//               <span className="text-sm">Build lasting habits</span>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//               <CheckCircle className="w-5 h-5 text-green-500" />
//               <span className="text-sm">Monitor your progress</span>
//             </div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       id: 2,
//       title: "Choose a Discipline",
//       subtitle: "Add disciplines to your profile",
//       content: <PreMade />,
//     },
//     {
//       id: 3,
//       title: "Track and Manage your disciplines",
//       subtitle: "Pick and manage your disciplines",
//       content: <UserDisciplines onboarding />,
//     },
//     {
//       id: 4,
//       title: "Character Overview",
//       subtitle: "Your personal dashboard",
//       content: (
//         <UserProfileOverview
//           userId={session?.user.id}
//           notCurrentUser={false}
//           onboarding
//         />
//       ),
//     },
//   ];

//   const [currentStep, setCurrentStep] = useState(1);
//   const progress = (currentStep / steps.length) * 100;

//   const currentStepData = steps.find((step) => step.id === currentStep);
//   const isFirstStep = currentStep === 1;
//   const isLastStep = currentStep === steps.length;

//   const handleNext = () => {
//     if (!isLastStep) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (!isFirstStep) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   // Function to complete onboarding
//   const completeOnboarding = async () => {
//     if (!session?.user?.id) {
//       throw new Error("No user session found");
//     }

//     const response = await fetch(`/api/users/${session.user.id}/onboarding`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ completed: true }),
//     });

//     const responseData = await response.json();

//     if (!response.ok) {
//       throw new Error(responseData.error || "Failed to complete onboarding");
//     }

//     return responseData;
//   };

//   // Combined function that runs both operations in parallel
//   const handleCompleteOnboardingAndCreateJournal = async () => {
//     setIsCompletingOnboarding(true);
//     setOnboardingError(null);

//     try {
//       // Run both operations in parallel using Promise.all
//       const [onboardingResult, newEntryId] = await Promise.all([
//         completeOnboarding(),
//         createJournalEntry(),
//       ]);

//       console.log("Onboarding completed:", onboardingResult);
//       console.log("Journal entry created:", newEntryId);

//       // Navigate to the journal entry page
//       router.push(`/update-journal-entry/${newEntryId}`);
//     } catch (error) {
//       console.error("Error during onboarding completion:", error);

//       // Handle different types of errors
//       if (error instanceof Error) {
//         setOnboardingError(error.message);
//       } else if (createJournalEntryError) {
//         setOnboardingError("Failed to create journal entry");
//       } else {
//         setOnboardingError("An unexpected error occurred");
//       }
//     } finally {
//       setIsCompletingOnboarding(false);
//     }
//   };

//   // Determine if we're in a loading state
//   const isLoading = isCompletingOnboarding || submittingJournalEntry;

//   return (
//     <div className="h-full flex flex-col">
//       {/* Fixed Progress Header */}
//       <div className="flex-shrink-0 bg-card h-20">
//         <div className="container max-w-4xl mx-auto px-4 h-full flex items-center">
//           <div className="w-full space-y-2">
//             <div className="flex w-full items-center justify-end">
//               <div className="text-sm text-muted-foreground">
//                 Step {currentStep} of {steps.length}
//               </div>
//             </div>
//             <Progress value={progress} className="h-2" />
//           </div>
//         </div>
//       </div>

//       {/* Scrollable Content Area */}
//       <div className="flex-1 overflow-auto border rounded-3xl">
//         {/* Sticky Header Section */}
//         <div className="sticky top-0 bg-card z-10">
//           <div className="text-center py-8 px-4">
//             <h2 className="text-3xl font-bold mb-2">
//               {currentStepData?.title}
//             </h2>
//             <p className="text-lg text-muted-foreground">
//               {currentStepData?.subtitle}
//             </p>
//           </div>
//         </div>

//         {/* Content Section */}
//         <div className="w-full px-4">{currentStepData?.content}</div>

//         {/* Error Display */}
//         {onboardingError && (
//           <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
//             <p className="text-red-700 text-sm">{onboardingError}</p>
//           </div>
//         )}
//       </div>

//       {/* Fixed Navigation Footer */}
//       <div className="flex-shrink-0 bg-card h-20">
//         <div className="container max-w-4xl mx-auto h-full flex items-center justify-center px-8">
//           <div className="flex justify-between items-center w-full">
//             {!isFirstStep && (
//               <Button
//                 className={isLastStep ? "w-16" : "w-[40%]"}
//                 disabled={isFirstStep || isLoading}
//                 variant="secondary"
//                 type="button"
//                 onClick={handlePrevious}
//               >
//                 <RxChevronLeft />
//                 {!isLastStep && "Back"}
//               </Button>
//             )}

//             {isLastStep ? (
//               <div className={isFirstStep ? "w-full" : "flex-1 ml-4"}>
//                 <JournalEntryActionButton
//                   text={
//                     isLoading ? "Completing Setup..." : "Start Your Journey"
//                   }
//                   handleClick={handleCompleteOnboardingAndCreateJournal}
//                   handleDisabled={isLoading}
//                   isSubmitting={isLoading}
//                 />
//               </div>
//             ) : (
//               <Button
//                 className={isFirstStep ? "w-full" : "w-[40%]"}
//                 variant="default"
//                 type="button"
//                 onClick={handleNext}
//                 disabled={isLoading}
//               >
//                 Next
//                 <RxChevronRight />
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//================================================================================================
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";

import { PreMade } from "@components/disciplines/PreMade";
import { UserDisciplines } from "@components/disciplines/UserDisciplines";
import { UserProfileOverview } from "@components/profile/UserProfileOverview";
import { JournalEntryActionButton } from "@components/journal/JournalEntryActionButton";
import { useCreateJournalEntry } from "@hooks/journal/useCreateJournalEntry";
import { useUserProfile } from "@context/UserProfileContext";
import type { Session } from "@models/types";

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

  const steps = [
    {
      id: 1,
      title: "Welcome to Your Journey",
      subtitle: "Build the perfect version of yourself",
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold">
              Ready to transform yourself?
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Our platform combines discipline tracking with habit formation to
              help you become the best version of yourself.
            </p>
          </div>
          <div className="grid gap-4 max-w-md mx-auto">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Track your disciplines</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Build lasting habits</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Monitor your progress</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Choose a Discipline",
      subtitle: "Add disciplines to your profile",
      content: <PreMade />,
    },
    {
      id: 3,
      title: "Track and Manage your disciplines",
      subtitle: "Pick and manage your disciplines",
      content: <UserDisciplines onboarding />,
    },
    {
      id: 4,
      title: "Character Overview",
      subtitle: "Your personal dashboard",
      content: (
        <UserProfileOverview
          userId={session?.user.id}
          notCurrentUser={false}
          onboarding
        />
      ),
    },
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
        <div className="sticky top-0 bg-card z-10">
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
