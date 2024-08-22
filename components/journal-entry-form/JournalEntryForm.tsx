"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";

interface JournalEntry {
  dailyWillpower: number;
  dayEntry?: { myDay: string };
  nightEntry?: { myNight: string };
}

type JournalEntryFormProps = {
  type: "create" | "edit";
  submitting: boolean;
  onSubmit: (journalEntry: JournalEntry) => Promise<void>;
  journalEntryData?: JournalEntry;
};

const JournalEntryForm = ({
  type,
  journalEntryData,
  submitting,
  onSubmit,
}: JournalEntryFormProps) => {
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full p-2 space-y-8"
    >
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl capitalize">
        {type} Entry
      </h1>
      {/*WILLPOWER SHOULD NEVER BE NEGATIVE */}
      <Label className="w-full mb-4">
        Daily Willpower:
        <Input
          className="w-full"
          type="number"
          value={journalEntry.dailyWillpower}
          onChange={(e) => handleChange(e, "dailyWillpowerField")}
        />
      </Label>
      <Label className="w-full mb-4">
        Day Entry:
        <Textarea
          className="w-full"
          value={journalEntry?.dayEntry?.myDay}
          onChange={(e) => handleChange(e, "dayField")}
        />
      </Label>
      <Label className="w-full mb-4">
        Night Entry:
        <Textarea
          className="w-full"
          value={journalEntry?.nightEntry?.myNight}
          onChange={(e) => handleChange(e, "nightField")}
        />
      </Label>
      <div className="flex flex-col justify-center items-center">
        <Button
          type="submit"
          className="w-1/2 mt-3 capitalize"
          disabled={submitting}
        >
          {type} Entry
        </Button>
        <Link href="/journal" className="w-full flex justify-center my-6">
          <Button variant="secondary" className="w-1/2">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
};

export default JournalEntryForm;
