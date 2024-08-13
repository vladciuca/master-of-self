"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@components/ui/button";

interface JournalEntry {
  dailyWillpower: number;
  dayEntry: { myDay: string };
  nightEntry: { myNight: string };
}

type JournalEntryFormProps = {
  type: "create" | "update";
  submitting: boolean;
  onSubmit: (journalEntry: JournalEntry) => Promise<void>;
  journalEntryData?: JournalEntry;
};

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  type,
  journalEntryData,
  submitting,
  onSubmit,
}) => {
  const [journalEntry, setJournalEntry] = useState<JournalEntry>({
    dailyWillpower: 0,
    dayEntry: { myDay: "" },
    nightEntry: { myNight: "" },
  });

  useEffect(() => {
    if (journalEntryData) setJournalEntry(journalEntryData);
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "dailyWillpowerField" | "dayField" | "nightField"
  ) => {
    const value = event.target.value;
    if (field === "dailyWillpowerField") {
      setJournalEntry({ ...journalEntry, dailyWillpower: Number(value) });
    }
    if (field === "dayField") {
      setJournalEntry({ ...journalEntry, dayEntry: { myDay: value } });
    }
    if (field === "nightField") {
      setJournalEntry({ ...journalEntry, nightEntry: { myNight: value } });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(journalEntry);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full p-2">
      <h1 className="py-10 text-3xl">
        {type === "create" ? "Create" : "Edit"}
      </h1>
      <label className="w-full mb-4">
        Daily Willpower:
        <input
          className="w-full"
          type="number"
          value={journalEntry.dailyWillpower}
          onChange={(e) => handleChange(e, "dailyWillpowerField")}
        />
      </label>
      <label className="w-full mb-4">
        Day Entry:
        <textarea
          className="w-full"
          value={journalEntry.dayEntry.myDay}
          onChange={(e) => handleChange(e, "dayField")}
        />
      </label>
      <label className="w-full mb-4">
        Night Entry:
        <textarea
          className="w-full"
          value={journalEntry.nightEntry.myNight}
          onChange={(e) => handleChange(e, "nightField")}
        />
      </label>
      <Button type="submit" disabled={submitting}>
        {type === "create" ? "Create Entry" : "Update Entry"}
      </Button>
    </form>
  );
};

export default JournalEntryForm;
