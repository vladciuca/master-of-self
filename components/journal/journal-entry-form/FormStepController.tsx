"use client";

// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { FormStepProgressBar } from "@components/journal/journal-entry-form/FormStepProgressBar";
// import { FormStepNavigation } from "@components/journal/journal-entry-form/FormStepNavigation";
import { DailyBonus } from "@components/journal/journal-entry-form/form-steps/DailyBonus";
import { GreatToday } from "@components/journal/journal-entry-form/form-steps/GreatToday";
import { GratefulFor } from "@components/journal/journal-entry-form/form-steps/GratefulFor";
import { DailyHighlights } from "@components/journal/journal-entry-form/form-steps/DailyHighlights";
import { LearnedToday } from "@components/journal/journal-entry-form/form-steps/LearnedToday";
// import { HabitsStep } from "@components/journal/journal-entry-form/form-steps/HabitsStep";
import { HabitActionsStep } from "@components/journal/journal-entry-form/form-steps/habit-actions-step/HabitActionsStep";
import { isEvening } from "@lib/time";
// import { JournalEntry } from "@app/types/types";

// // TEST_FLAG: used for enabling all forms steps
// const SHOW_ALL_TEST = true;

// type FormStepControllerProps = {
//   submitting: boolean;
//   onSubmit: (journalEntry: JournalEntry) => Promise<void>;
//   journalEntryData?: JournalEntry;
//   userEveningTime?: string;
//   hasHabits?: boolean;
//   hasGratitude?: boolean;
//   hasReflection?: boolean;
// };

// function FormStepController({
//   journalEntryData,
//   submitting,
//   onSubmit,
//   userEveningTime = "18:00",
//   hasGratitude = false,
//   hasReflection = false,
//   hasHabits = false,
// }: FormStepControllerProps) {
//   const searchParams = useSearchParams();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [formData, setFormData] = useState<JournalEntry>(() => ({
//     dailyWillpower: journalEntryData?.dailyWillpower || 0,
//     bonusWillpower: journalEntryData?.bonusWillpower || 0,
//     dayEntry: {
//       greatToday: journalEntryData?.dayEntry?.greatToday || [],
//       gratefulFor: journalEntryData?.dayEntry?.gratefulFor || [],
//     },
//     nightEntry: {
//       dailyHighlights: journalEntryData?.nightEntry?.dailyHighlights || [],
//       learnedToday: journalEntryData?.nightEntry?.learnedToday || "",
//       habits: journalEntryData?.nightEntry?.habits || {},
//       actions: journalEntryData?.nightEntry?.actions || {},
//     },
//   }));

//   const calculateScore = useMemo(
//     () => (entries: string[]) => {
//       const totalEntries = entries.length;
//       const totalLength = entries.join("").length;
//       return Math.floor((totalEntries * 5 + totalLength) / 10);
//     },
//     []
//   );

//   const calculateWillpower = useMemo(
//     () => (data: JournalEntry) => {
//       const greatTodayScore = calculateScore(data.dayEntry?.greatToday || []);
//       const gratefulForScore = calculateScore(data.dayEntry?.gratefulFor || []);
//       return Math.floor((greatTodayScore + gratefulForScore) * 1.5);
//     },
//     [calculateScore]
//   );

//   useEffect(() => {
//     if (journalEntryData) {
//       setFormData((prev) => ({
//         ...prev,
//         ...journalEntryData,
//         dayEntry: {
//           ...prev.dayEntry,
//           ...journalEntryData.dayEntry,
//         },
//         nightEntry: {
//           ...prev.nightEntry,
//           ...journalEntryData.nightEntry,
//         },
//       }));
//     }
//   }, [journalEntryData]);

//   //what is this exactly doing
//   useEffect(() => {
//     const willpower = calculateWillpower(formData) + formData.bonusWillpower;
//     if (willpower !== formData.dailyWillpower) {
//       setFormData((prev) => ({ ...prev, dailyWillpower: willpower }));
//     }
//   }, [formData, calculateWillpower]);

//   const handleChange = useCallback(
//     (
//       field:
//         | "greatToday"
//         | "gratefulFor"
//         | "dailyHighlights"
//         | "learnedToday"
//         | "habits"
//         | "actions",
//       value:
//         | string[]
//         | string
//         | { [key: string]: number }
//         | { [key: string]: { [key: string]: number } }
//     ) => {
//       setFormData((prev) => {
//         const newData = { ...prev };
//         if (field === "greatToday" || field === "gratefulFor") {
//           newData.dayEntry = {
//             ...prev.dayEntry,
//             [field]: value as string[],
//           };
//         } else if (
//           field === "dailyHighlights" ||
//           field === "learnedToday" ||
//           field === "habits" ||
//           field === "actions"
//         ) {
//           newData.nightEntry = {
//             ...prev.nightEntry,
//             [field]: value,
//           };
//         }
//         return newData;
//       });
//     },
//     []
//   );

//   const formSteps = [
//     {
//       type: "reward",
//       component: <DailyBonus bonusWillpower={formData.bonusWillpower} />,
//       isAvailable: formData.bonusWillpower > 0,
//     },
//     {
//       type: "gratitude",
//       component: (
//         <GratefulFor
//           dailyWillpower={formData.dailyWillpower}
//           entryList={formData.dayEntry?.gratefulFor || []}
//           onChange={(value) => handleChange("gratefulFor", value)}
//         />
//       ),
//       isAvailable:
//         SHOW_ALL_TEST || (!isEvening(userEveningTime) && hasGratitude),
//     },
//     {
//       type: "day",
//       component: (
//         <GreatToday
//           dailyWillpower={formData.dailyWillpower}
//           entryList={formData.dayEntry?.greatToday || []}
//           onChange={(value) => handleChange("greatToday", value)}
//         />
//       ),
//       isAvailable: SHOW_ALL_TEST || !isEvening(userEveningTime),
//     },

//     {
//       type: "night",
//       component: (
//         <DailyHighlights
//           entryList={formData.nightEntry?.dailyHighlights || []}
//           onChange={(value) => handleChange("dailyHighlights", value)}
//         />
//       ),
//       isAvailable: SHOW_ALL_TEST || isEvening(userEveningTime),
//     },
//     {
//       type: "reflection",
//       component: (
//         <LearnedToday
//           learnedToday={formData.nightEntry?.learnedToday || ""}
//           onChange={(value) => handleChange("learnedToday", value)}
//         />
//       ),
//       isAvailable:
//         SHOW_ALL_TEST || (isEvening(userEveningTime) && hasReflection),
//     },
//     // {
//     //   type: "habits",
//     //   component: (
//     //     <HabitsStep
//     //       dailyWillpower={formData.dailyWillpower}
//     //       onChange={(value) => handleChange("habits", value)}
//     //       habitXpChanges={formData.nightEntry?.habits || {}}
//     //     />
//     //   ),
//     //   isAvailable: SHOW_ALL_TEST || (isEvening(userEveningTime) && hasHabits),
//     // },
//     {
//       type: "habits",
//       component: (
//         <HabitActionsStep
//           onChange={(value) => handleChange("actions", value)}
//           actionChanges={formData.nightEntry?.actions || {}}
//         />
//       ),
//       isAvailable: SHOW_ALL_TEST || hasHabits,
//     },
//   ];

//   useEffect(() => {
//     const stepParam = searchParams.get("step");
//     if (stepParam) {
//       console.log("======stepParam", stepParam);
//       const stepIndex = formSteps.findIndex((step) => step.type === stepParam);
//       console.log("======stepParam", stepIndex);

//       if (stepIndex !== -1) {
//         setCurrentStep(stepIndex);
//       }
//     }
//   }, [searchParams, formSteps]);

//   const availableSteps = formSteps.filter((step) => step.isAvailable);
//   const CurrentStepComponent = availableSteps[currentStep].component;
//   const stepTypes = availableSteps.map((step) => step.type);

//   return (
//     <div className="grid grid-rows-[auto,1fr,auto] h-full">
//       <FormStepProgressBar
//         steps={availableSteps}
//         currentStep={currentStep}
//         onStepChange={setCurrentStep}
//       />

//       <div className="h-full overflow-hidden">{CurrentStepComponent}</div>

//       <FormStepNavigation
//         currentStep={currentStep}
//         totalSteps={availableSteps.length}
//         onSubmit={onSubmit}
//         formData={formData}
//         setCurrentStep={setCurrentStep}
//         isSubmitting={submitting}
//         stepTypes={stepTypes}
//       />
//     </div>
//   );
// }

// const MemoizedFormStepController = React.memo(
//   FormStepController,
//   (prevProps, nextProps) => {
//     return (
//       prevProps.submitting === nextProps.submitting &&
//       prevProps.userEveningTime === nextProps.userEveningTime &&
//       prevProps.hasGratitude === nextProps.hasGratitude &&
//       prevProps.hasReflection === nextProps.hasReflection &&
//       prevProps.hasHabits === nextProps.hasHabits &&
//       JSON.stringify(prevProps.journalEntryData) ===
//         JSON.stringify(nextProps.journalEntryData)
//     );
//   }
// );

// export { MemoizedFormStepController as FormStepController };

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Shell } from "lucide-react";
import { FaSun, FaMoon, FaStar } from "react-icons/fa6";
import { GiPrayer, GiBackup } from "react-icons/gi";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";
import { IconType } from "react-icons";
import { LucideProps } from "lucide-react";
import { JournalEntry } from "@/app/types/types";

type Step = {
  type: string;
  component: React.ReactNode;
  isAvailable: boolean;
};

type StepIconMap = {
  [key: string]:
    | IconType
    | React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >;
};

const stepIconMap: StepIconMap = {
  day: FaSun,
  night: FaMoon,
  gratitude: GiPrayer,
  reflection: GiBackup,
  habits: Shell,
  default: FaStar,
};

// TEST_FLAG: used for enabling all forms steps
const SHOW_ALL_TEST = true;

type FormStepControllerProps = {
  submitting: boolean;
  onSubmit: (journalEntry: JournalEntry) => Promise<void>;
  journalEntryData?: JournalEntry;
  userEveningTime?: string;
  hasHabits?: boolean;
  hasGratitude?: boolean;
  hasReflection?: boolean;
};

export function FormStepController({
  journalEntryData,
  submitting,
  onSubmit,
  userEveningTime = "18:00",
  hasGratitude = false,
  hasReflection = false,
  hasHabits = false,
}: FormStepControllerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<JournalEntry>(() => ({
    dailyWillpower: journalEntryData?.dailyWillpower || 0,
    bonusWillpower: journalEntryData?.bonusWillpower || 0,
    dayEntry: {
      greatToday: journalEntryData?.dayEntry?.greatToday || [],
      gratefulFor: journalEntryData?.dayEntry?.gratefulFor || [],
    },
    nightEntry: {
      dailyHighlights: journalEntryData?.nightEntry?.dailyHighlights || [],
      learnedToday: journalEntryData?.nightEntry?.learnedToday || "",
      habits: journalEntryData?.nightEntry?.habits || {},
      actions: journalEntryData?.nightEntry?.actions || {},
    },
  }));

  const calculateScore = useMemo(
    () => (entries: string[]) => {
      const totalEntries = entries.length;
      const totalLength = entries.join("").length;
      return Math.floor((totalEntries * 5 + totalLength) / 10);
    },
    []
  );

  const calculateWillpower = useMemo(
    () => (data: JournalEntry) => {
      const greatTodayScore = calculateScore(data.dayEntry?.greatToday || []);
      const gratefulForScore = calculateScore(data.dayEntry?.gratefulFor || []);
      return Math.floor((greatTodayScore + gratefulForScore) * 1.5);
    },
    [calculateScore]
  );

  useEffect(() => {
    if (journalEntryData) {
      setFormData((prev) => ({
        ...prev,
        ...journalEntryData,
        dayEntry: {
          ...prev.dayEntry,
          ...journalEntryData.dayEntry,
        },
        nightEntry: {
          ...prev.nightEntry,
          ...journalEntryData.nightEntry,
        },
      }));
    }
  }, [journalEntryData]);

  //what is this exactly doing
  useEffect(() => {
    const willpower = calculateWillpower(formData) + formData.bonusWillpower;
    if (willpower !== formData.dailyWillpower) {
      setFormData((prev) => ({ ...prev, dailyWillpower: willpower }));
    }
  }, [formData, calculateWillpower]);

  const handleChange = useCallback(
    (
      field:
        | "greatToday"
        | "gratefulFor"
        | "dailyHighlights"
        | "learnedToday"
        | "habits"
        | "actions",
      value:
        | string[]
        | string
        | { [key: string]: number }
        | { [key: string]: { [key: string]: number } }
    ) => {
      setFormData((prev) => {
        const newData = { ...prev };
        if (field === "greatToday" || field === "gratefulFor") {
          newData.dayEntry = {
            ...prev.dayEntry,
            [field]: value as string[],
          };
        } else if (
          field === "dailyHighlights" ||
          field === "learnedToday" ||
          field === "habits" ||
          field === "actions"
        ) {
          newData.nightEntry = {
            ...prev.nightEntry,
            [field]: value,
          };
        }
        return newData;
      });
    },
    []
  );

  const formSteps: Step[] = useMemo(
    () => [
      {
        type: "reward",
        component: <DailyBonus bonusWillpower={formData.bonusWillpower} />,
        isAvailable: formData.bonusWillpower > 0,
      },
      {
        type: "gratitude",
        component: (
          <GratefulFor
            dailyWillpower={formData.dailyWillpower}
            entryList={formData.dayEntry?.gratefulFor || []}
            onChange={(value) => handleChange("gratefulFor", value)}
          />
        ),
        isAvailable:
          SHOW_ALL_TEST || (!isEvening(userEveningTime) && hasGratitude),
      },
      {
        type: "day",
        component: (
          <GreatToday
            dailyWillpower={formData.dailyWillpower}
            entryList={formData.dayEntry?.greatToday || []}
            onChange={(value) => handleChange("greatToday", value)}
          />
        ),
        isAvailable: SHOW_ALL_TEST || !isEvening(userEveningTime),
      },

      {
        type: "night",
        component: (
          <DailyHighlights
            entryList={formData.nightEntry?.dailyHighlights || []}
            onChange={(value) => handleChange("dailyHighlights", value)}
          />
        ),
        isAvailable: SHOW_ALL_TEST || isEvening(userEveningTime),
      },
      {
        type: "reflection",
        component: (
          <LearnedToday
            learnedToday={formData.nightEntry?.learnedToday || ""}
            onChange={(value) => handleChange("learnedToday", value)}
          />
        ),
        isAvailable:
          SHOW_ALL_TEST || (isEvening(userEveningTime) && hasReflection),
      },
      // {
      //   type: "habits",
      //   component: (
      //     <HabitsStep
      //       dailyWillpower={formData.dailyWillpower}
      //       onChange={(value) => handleChange("habits", value)}
      //       habitXpChanges={formData.nightEntry?.habits || {}}
      //     />
      //   ),
      //   isAvailable: SHOW_ALL_TEST || (isEvening(userEveningTime) && hasHabits),
      // },
      {
        type: "habits",
        component: (
          <HabitActionsStep
            onChange={(value) => handleChange("actions", value)}
            actionChanges={formData.nightEntry?.actions || {}}
          />
        ),
        isAvailable: SHOW_ALL_TEST || hasHabits,
      },
    ],
    [
      formData,
      handleChange,
      userEveningTime,
      hasGratitude,
      hasReflection,
      hasHabits,
    ]
  );

  const availableSteps = useMemo(
    () => formSteps.filter((step) => step.isAvailable),
    [formSteps]
  );

  const stepTypes = useMemo(
    () => availableSteps.map((step) => step.type),
    [availableSteps]
  );

  const updateUrlStep = useCallback(
    (step: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("step", stepTypes[step]);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, stepTypes]
  );

  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const stepIndex = stepTypes.indexOf(stepParam);
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex);
      }
    }
  }, [searchParams, stepTypes]);

  const handleStepChange = useCallback(
    (index: number) => {
      setCurrentStep(index);
      updateUrlStep(index);
    },
    [updateUrlStep]
  );

  const handleNextForm = useCallback(async () => {
    if (currentStep < availableSteps.length - 1) {
      await onSubmit(formData);
      handleStepChange(currentStep + 1);
    } else {
      await onSubmit(formData);
      router.push("/journal");
    }
  }, [
    currentStep,
    availableSteps.length,
    formData,
    onSubmit,
    handleStepChange,
    router,
  ]);

  const handlePrevForm = useCallback(() => {
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
  }, [currentStep, handleStepChange]);

  const progressPercentage = ((currentStep + 1) / availableSteps.length) * 100;

  return (
    <div className="grid grid-rows-[auto,1fr,auto] h-full">
      <div className="flex flex-col items-center w-full mb-4">
        <div className="flex items-center justify-around w-full my-4 px-4">
          {availableSteps.map((step, index) => {
            const Icon = stepIconMap[step.type] || stepIconMap.default;
            return (
              <span
                key={index}
                className={`text-sm ${
                  index === currentStep ? "" : "text-muted-foreground"
                } cursor-pointer`}
                onClick={() => handleStepChange(index)}
              >
                <Icon size={index === currentStep ? "1.4rem" : "1.3rem"} />
              </span>
            );
          })}
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex-grow mx-4">
            <Progress value={progressPercentage} className="w-full h-2" />
          </div>
        </div>
      </div>

      <div className="h-full overflow-hidden">
        {availableSteps[currentStep].component}
      </div>

      <div className="flex justify-around items-center my-4">
        <Button
          className="w-1/3"
          variant={currentStep === 0 ? "default" : "secondary"}
          type="button"
          onClick={
            currentStep === 0 ? () => router.push("/journal") : handlePrevForm
          }
        >
          <RxChevronLeft />
          {currentStep === 0 ? "Cancel" : "Back"}
        </Button>

        <Button
          className="w-1/3"
          variant={
            currentStep === availableSteps.length - 1 ? "default" : "secondary"
          }
          type="button"
          onClick={handleNextForm}
          disabled={submitting}
        >
          {currentStep === availableSteps.length - 1 ? "Complete" : "Next"}
          <RxChevronRight />
        </Button>
      </div>
    </div>
  );
}
