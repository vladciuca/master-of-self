"use client";

import { useEffect } from "react";
import { Skeleton } from "@components/ui/skeleton";
import { CardDescription, CardTitle } from "@components/ui/card";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";
import { useUserProfile } from "@context/UserProfileContext";

import { customStepConfigs } from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";
import { DisciplineStep } from "./DisciplineStep";
import { FaSun, FaMoon } from "react-icons/fa";
import { JOURNAL_COLORS } from "@lib/colors";

export function Disciplines() {
  const {
    // userProfile,
    userProfileLoading,
    userProfileError,
    refetchUserProfile,
  } = useUserProfile();

  //NOTE: should try and move the loading states inside the DisciplineStep?
  const { todayEntry, todayEntryLoading, todayEntryError } =
    useTodayJournalEntry();
  const { lastEntry, lastEntryLoading, lastEntryError } = useLastJournalEntry();

  // refetch const { disciplines } = userProfile; on mount
  // Might change the dependency to something else
  useEffect(() => {
    refetchUserProfile();
  }, []);

  // Check if any data is loading
  const isLoading = userProfileLoading || todayEntryLoading || lastEntryLoading;

  // Check for any errors
  const hasError = userProfileError || todayEntryError || lastEntryError;

  return (
    <>
      <div className="mx-1 mb-4">
        <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {"Disciplines"}
        </CardTitle>

        <CardDescription>
          {"You can only have 2 disciplines per morning or evening."}
        </CardDescription>
      </div>
      <>
        {isLoading ? (
          <>
            {[1].map((i) => (
              <div key={i} className="flex flex-col items-start w-full">
                <Skeleton className="h-5 w-24 mb-4 mt-2" />
                <Skeleton className="h-4 w-full rounded-full mb-2" />
              </div>
            ))}
          </>
        ) : !isLoading && hasError ? (
          <div>
            <span>Error:</span>
            <div>
              {userProfileError ||
                todayEntryError ||
                lastEntryError ||
                "There was an error loading your disciplines. Please try again later."}
            </div>
          </div>
        ) : (
          <>
            <DisciplineStep
              title="Motivation"
              description="Your motivation level"
              discipline="motivation"
            />

            <div className="flex items-center justify-between px-2 mt-6 mb-2">
              <CardTitle className="flex items-center scroll-m-20 text-md sm:text-md text-muted-foreground font-normal">
                {"Morning Steps"}
              </CardTitle>
              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="flex items-center space-x-2">
                  <FaSun
                    size={20}
                    className={`mr-2 text-${JOURNAL_COLORS.day}`}
                  />
                  <span className="scroll-m-20 text-lg font-semibold tracking-tight">
                    0
                    <span className="font-thin mx-1 text-muted-foreground">
                      /
                    </span>
                    <span className="text-muted-foreground">2</span>
                  </span>
                </div>
              </div>
            </div>
            {customStepConfigs
              .filter((step) => step.type === "dayEntry")
              .map((step) => {
                return (
                  <DisciplineStep
                    icon={step.icon}
                    title={step.title}
                    description={step.description}
                    discipline={step.discipline}
                    type={step.type}
                  />
                );
              })}

            <div className="flex items-center justify-between px-2 mt-6 mb-2">
              <CardTitle className="flex items-center scroll-m-20 text-md sm:text-md text-muted-foreground font-normal">
                {"Evening Steps"}
              </CardTitle>
              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="flex items-center space-x-2">
                  <FaMoon
                    size={17}
                    className={`mr-2 text-${JOURNAL_COLORS.night}`}
                  />
                  <span className="scroll-m-20 text-lg font-semibold tracking-tight">
                    0
                    <span className="font-thin mx-1 text-muted-foreground">
                      /
                    </span>
                    <span className="text-muted-foreground">2</span>
                  </span>
                </div>
              </div>
            </div>
            {customStepConfigs
              .filter((step) => step.type === "nightEntry")
              .map((step) => {
                return (
                  <DisciplineStep
                    icon={step.icon}
                    title={step.title}
                    description={step.description}
                    discipline={step.discipline}
                    type={step.type}
                  />
                );
              })}
          </>
        )}
      </>
    </>
  );
}
