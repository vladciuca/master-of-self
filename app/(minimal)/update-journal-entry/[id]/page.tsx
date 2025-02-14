"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FormStepController } from "@components/journal/journal-entry-form/FormStepController";
import { PageLogo } from "@components/PageLogo";
import { HeaderTitle } from "@components/HeaderTitle";
import { useUserSettings } from "@hooks/useUserSettings";
import { useUserHabits } from "@hooks/useUserHabits";
import { JournalEntry } from "@models/types";

export default function UpdateJournalEntry() {
  const [submitting, setSubmitting] = useState(false);
  const [journalEntryData, setJournalEntryData] = useState<JournalEntry | null>(
    null
  );
  const [journalEntryLoading, setJournalEntryLoading] = useState(false);
  const [journalEntryError, setJournalEntryError] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams<{ id: string }>();
  const { id } = params;

  const { userSettings, userSettingsLoading } = useUserSettings();
  const { hasHabits, habitsLoading } = useUserHabits();

  const userSteps = userSettings?.steps;

  const hasGratitude = userSteps?.gratefulStep;
  const hasReflection = userSteps?.reflectionStep;

  // const userMorningTime = userSettings?.journalStartTime.morning;
  const userEveningTime = userSettings?.journalStartTime.evening;

  useEffect(() => {
    const getJournalEntryData = async () => {
      setJournalEntryLoading(true);
      try {
        const response = await fetch(`/api/journal-entry/${id}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch journal entry");
        }
        const data = await response.json();

        setJournalEntryData(data);
      } catch (error) {
        console.error("Error fetching journal entry:", error);

        setJournalEntryLoading(false);
        setJournalEntryError("Failed to load journal entry. Please try again.");
      } finally {
        setJournalEntryLoading(false);
        setJournalEntryError(null);
      }
    };
    getJournalEntryData();
  }, [id]);

  useEffect(() => {
    if (!journalEntryLoading && !userSettingsLoading && !habitsLoading) {
      // Small delay to ensure all state updates have propagated
      const timer = setTimeout(() => setIsLoading(false), 0);
      return () => clearTimeout(timer);
    }
  }, [journalEntryLoading, userSettingsLoading, habitsLoading]);

  const updateJournalEntry = async (journalEntry: JournalEntry) => {
    setSubmitting(true);

    try {
      const response = await fetch(`/api/journal-entry/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(journalEntry),
      });

      if (!response.ok) {
        throw new Error("Failed to update journal entry");
      }

      const updatedData = await response.json();
      setJournalEntryData(updatedData);
    } catch (error) {
      console.error("Error updating journal entry:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {!isLoading && journalEntryData && (
        <FormStepController
          journalEntryData={journalEntryData}
          submitting={submitting}
          onSubmit={updateJournalEntry}
          userEveningTime={userEveningTime}
          hasGratitude={hasGratitude}
          hasReflection={hasReflection}
          hasHabits={hasHabits}
        />
      )}
      {isLoading && (
        <div className="flex flex-col w-full h-full relative sm:pt-2">
          <div className="min-h-20 flex items-center justify-center py-2 sm:mt-1 sm:mb-2">
            <HeaderTitle />
          </div>
          <div className="flex-grow overflow-hidden border rounded-3xl">
            <div className="h-full px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <PageLogo />
            </div>
          </div>
          <div className="min-h-20">
            <div className="w-full h-full flex justify-center items-center">
              <div className="loader" />
            </div>
          </div>
        </div>
      )}
      {journalEntryError && <div>{journalEntryError}</div>}
    </>
  );
}
