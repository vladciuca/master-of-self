"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import FormStepController from "@components/journal/journal-entry-form/FormStepController";
import PageLogo from "@components/PageLogo";
import HeaderTitle from "@components/HeaderTitle";
import { JournalEntry } from "@app/types/types";

const UpdateJournalEntry = () => {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [submitting, setSubmitting] = useState(false);
  const [journalEntryData, setJournalEntryData] = useState<JournalEntry | null>(
    null
  );
  // const [error, setError] = useState<string | null>(null);

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

  const updateJournalEntry = async (journalEntry: JournalEntry) => {
    setSubmitting(true);
    // setError(null);

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

  return journalEntryData ? (
    <FormStepController
      journalEntryData={journalEntryData}
      submitting={submitting}
      onSubmit={updateJournalEntry}
    />
  ) : (
    <>
      <HeaderTitle />
      <div className="my-20 p-4 h-full w-full overflow-scroll border rounded-3xl">
        <PageLogo />
      </div>
      <div className="fixed bottom-0 w-full h-20">
        <div className="w-full h-full flex justify-center items-center">
          <div className="loader" />
        </div>
      </div>
    </>
  );
};

export default UpdateJournalEntry;
