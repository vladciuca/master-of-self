"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import FormStepController from "@components/journal-entry-form/FormStepController";
import PageLogo from "@components/PageLogo";

export interface JournalEntry {
  dailyWillpower: number;
  dayEntry?: {
    greatToday?: string[];
    gratefulFor?: string[];
  };
  nightEntry?: {
    dailyHighlights?: string[];
  };
}

const UpdateJournalEntry = () => {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [submitting, setSubmitting] = useState(false);
  const [journalEntryData, setJournalEntryData] = useState<JournalEntry | null>(
    null
  );

  useEffect(() => {
    const getJournalEntryData = async () => {
      const response = await fetch(`/api/journal-entry/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      setJournalEntryData(data);
    };
    getJournalEntryData();
  }, [id]);

  const updateJournalEntry = async (journalEntry: JournalEntry) => {
    setSubmitting(true);

    try {
      const response = await fetch(`/api/journal-entry/${id}`, {
        method: "PATCH",
        body: JSON.stringify(journalEntry),
      });

      if (response.ok) {
        setJournalEntryData(journalEntry);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return journalEntryData ? (
    <FormStepController
      journalEntryData={journalEntryData}
      submitting={submitting}
      onSubmit={updateJournalEntry}
    />
  ) : (
    <PageLogo />
  );
};

export default UpdateJournalEntry;
