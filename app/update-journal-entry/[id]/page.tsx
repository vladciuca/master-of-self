"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import JournalEntryForm from "@components/journal-entry-form/JournalEntryForm";
import FormStepController from "@components/journal-entry-form/FormStepController";
import PageLogo from "@components/PageLogo";

interface JournalEntry {
  dailyWillpower: number;
  dayEntry?: { myDay: string };
  nightEntry?: { myNight: string };
}

const UpdateJournalEntry = () => {
  const router = useRouter();
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
        //can be deconstructed, or use spread operator and new properties
        body: JSON.stringify(journalEntry),
      });

      if (response.ok) {
        router.push("/journal");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return journalEntryData ? (
    // <JournalEntryForm
    //   type="edit"
    //   journalEntryData={journalEntryData}
    //   submitting={submitting}
    //   onSubmit={updateJournalEntry}
    // />
    <FormStepController />
  ) : (
    <PageLogo />
  );
};

export default UpdateJournalEntry;
