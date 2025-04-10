"use client";

import React from "react";
import { useEffect } from "react";
import { Skeleton } from "@components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardDescription, CardTitle } from "@components/ui/card";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";
import { useUserProfile } from "@context/UserProfileContext";

import { customStepConfigs } from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";
import { DisciplineStep } from "./DisciplineStep";
import { DisciplineStepDescription } from "./DisciplineStepDescription";
import { DisciplineSectionDelimiter } from "./DisciplineSectionDelimiter";

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
      <div className="mx-1">
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
            {[1, 2, 3].map((i) => (
              <Card key={i} className="flex flex-col items-start w-full p-4">
                <Skeleton className="h-5 w-24 mb-4 mt-2" />
                <Skeleton className="h-4 w-full rounded-full mb-2" />
              </Card>
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
            <Accordion type="single" collapsible>
              <AccordionItem
                key={"motivation"}
                value={"motivation"}
                className="p-0 px-2"
              >
                <AccordionTrigger className="pt-5 pb-3">
                  <DisciplineStep discipline="motivation" />
                </AccordionTrigger>
                <AccordionContent>
                  <DisciplineStepDescription
                    title={"title"}
                    description={"description"}
                  />
                </AccordionContent>
              </AccordionItem>

              <DisciplineSectionDelimiter
                day={true}
                activeSteps={0}
                maxSteps={2}
              />

              {customStepConfigs
                .filter((step) => step.type === "dayEntry")
                .map((step) => {
                  return (
                    <AccordionItem
                      key={step.discipline}
                      value={step.discipline}
                      className="p-0 px-2 mb-3"
                    >
                      <AccordionTrigger className="pt-5 pb-3">
                        <DisciplineStep
                          icon={step.icon}
                          discipline={step.discipline}
                          type={step.type}
                        />
                      </AccordionTrigger>
                      <AccordionContent>
                        <DisciplineStepDescription
                          title={step.title}
                          description={step.description}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}

              <DisciplineSectionDelimiter
                day={false}
                activeSteps={0}
                maxSteps={2}
              />

              {customStepConfigs
                .filter((step) => step.type === "nightEntry")
                .map((step) => {
                  return (
                    <AccordionItem
                      key={step.discipline}
                      value={step.discipline}
                      className="p-0 px-2 mb-3"
                    >
                      <AccordionTrigger className="pt-5 pb-3">
                        <DisciplineStep
                          icon={step.icon}
                          discipline={step.discipline}
                          type={step.type}
                        />
                      </AccordionTrigger>
                      <AccordionContent>
                        <DisciplineStepDescription
                          title={step.title}
                          description={step.description}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
            </Accordion>
          </>
        )}
      </>
    </>
  );
}
