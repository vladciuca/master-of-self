"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { FormStepController } from "@components/journal/journal-entry-form/FormStepController";
import { PageLogo } from "@components/PageLogo";
import { HeaderTitle } from "@components/HeaderTitle";
import { JournalEntry, Session } from "@app/types/types";
import { useFetchUserSettings } from "@hooks/useFetchUserSettings";

export default function UpdateJournalEntry() {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [submitting, setSubmitting] = useState(false);
  const [journalEntryData, setJournalEntryData] = useState<JournalEntry | null>(
    null
  );
  const [habits, setHabits] = useState([]);
  const [habitsLoaded, setHabitsLoaded] = useState(false);
  const { data: session } = useSession() as { data: Session | null };
  const { hasGratitude, hasReflection, userEveningTime } =
    useFetchUserSettings();

  useEffect(() => {
    const getJournalEntryData = async () => {
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
        // setError("Failed to load journal entry. Please try again.");
      }
    };
    getJournalEntryData();
  }, [id]);

  useEffect(() => {
    const fetchHabits = async () => {
      setHabitsLoaded(false);
      try {
        const response = await fetch(`/api/users/${session?.user.id}/habits`);
        const data = await response.json();
        setHabits(data.reverse());
      } catch (error) {
        console.error("Failed to fetch habits", error);
      } finally {
        setHabitsLoaded(true);
      }
    };

    if (session?.user.id) {
      fetchHabits();
    }
  }, [session]);

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
      // setError("Failed to update journal entry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // if (error) {
  //   return <div className="text-center text-red-500">{error}</div>;
  // }

  return (
    <>
      {journalEntryData && (
        <FormStepController
          journalEntryData={journalEntryData}
          submitting={submitting}
          onSubmit={updateJournalEntry}
          userEveningTime={userEveningTime}
          hasHabits={habitsLoaded && habits.length > 0}
          hasGratitude={hasGratitude}
          hasReflection={hasReflection}
        />
      )}
      {!journalEntryData && (
        <div className="phone_container fixed sm:border-2 sm:rounded-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mx-auto flex flex-col items-center justify-center w-full max-w-[450px] sm:max-h-[800px] h-screen overflow-hidden">
          <div className="fixed top-0 w-full h-20">
            <HeaderTitle />
          </div>
          <div className="my-20 p-4 h-full w-full overflow-scroll border rounded-3xl">
            <PageLogo />
          </div>
          <div className="fixed bottom-0 w-full h-20">
            <div className="w-full h-full flex justify-center items-center">
              <div className="loader" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
