"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import TextAreaList from "@components/TextAreaList";

interface JournalEntry {
  dailyWillpower: number;
  dayEntry: string[];
  nightEntry: string[];
}

type JournalEntryFormProps = {
  type: "create" | "update";
  submitting: boolean;
  onSubmit: (journalEntry: JournalEntry) => Promise<void>;
  journalEntryData?: JournalEntry;
  step?: 1 | 2;
};

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  type,
  journalEntryData,
  submitting,
  onSubmit,
  step,
}) => {
  const [journalEntry, setJournalEntry] = useState<JournalEntry>({
    dailyWillpower: 0,
    dayEntry: [],
    nightEntry: [],
  });

  const [inputTextDay, setInputTextDay] = useState<string[]>([""]);
  const [inputTextNight, setInputTextNight] = useState<string[]>([""]);

  const willpowerCounter = inputTextDay.length;

  useEffect(() => {
    if (journalEntryData) {
      setJournalEntry(journalEntryData);
      setInputTextDay(journalEntryData?.dayEntry);
    }
  }, []);

  useEffect(() => {
    setJournalEntry({
      ...journalEntry,
      dailyWillpower: willpowerCounter,
      dayEntry: inputTextDay,
      nightEntry: inputTextNight,
    });
  }, [inputTextDay, inputTextNight]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(journalEntry);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full p-2">
      {step === 1 && (
        <JournalStep1
          willpowerCounter={willpowerCounter}
          inputTextDay={inputTextDay}
          setInputTextDay={setInputTextDay}
        />
      )}
      {step === 2 && (
        <JournalStep2
          inputTextNight={inputTextNight}
          setInputTextNight={setInputTextNight}
        />
      )}
      {type === "update" && journalEntry.nightEntry.length < 1 ? (
        <JournalEditDay
          willpowerCounter={willpowerCounter}
          inputTextDay={inputTextDay}
          setInputTextDay={setInputTextDay}
        />
      ) : (
        <></>
      )}

      {type === "update" && journalEntry.nightEntry.length >= 1 ? (
        <JournalEditAll
          willpowerCounter={willpowerCounter}
          inputTextDay={inputTextDay}
          setInputTextDay={setInputTextDay}
          inputTextNight={inputTextNight}
          setInputTextNight={setInputTextNight}
        />
      ) : (
        <></>
      )}

      <Button type="submit" disabled={submitting}>
        Submit
      </Button>
    </form>
  );
};

const JournalStep1: React.FC<any> = ({
  willpowerCounter,
  inputTextDay,
  setInputTextDay,
}) => {
  return (
    <>
      <h1 className="py-10 text-3xl">Create DAY entry</h1>
      <label className="w-full mb-4">
        <h4 className="">{`Daily Willpower: ${willpowerCounter}`}</h4>
      </label>
      <label className="w-full mb-4">
        <h3 className="text-xl">What will make today great?</h3>
        <TextAreaList
          className="mx-0 bg-transparent ring-2 ring-white"
          inputText={inputTextDay}
          setInputText={setInputTextDay}
        />
      </label>
    </>
  );
};

const JournalStep2: React.FC<any> = ({ inputTextNight, setInputTextNight }) => {
  return (
    <>
      <h1 className="py-10 text-3xl">Create NIGHT entry</h1>
      <label className="w-full mb-4">
        <h3 className="text-xl">What were the highlights of your day?</h3>
        <TextAreaList
          className="mx-0 bg-transparent ring-2 ring-white"
          inputText={inputTextNight}
          setInputText={setInputTextNight}
        />
      </label>
    </>
  );
};

const JournalEditDay: React.FC<any> = ({
  willpowerCounter,
  inputTextDay,
  setInputTextDay,
}) => {
  return (
    <>
      <h1 className="py-10 text-3xl">Edit your DAY entry</h1>
      <label className="w-full mb-4">
        <h4 className="">{`Daily Willpower: ${willpowerCounter}`}</h4>
      </label>
      <label className="w-full mb-4">
        <h3 className="text-xl">What will make today great?</h3>
        <TextAreaList
          className="mx-0 bg-transparent ring-2 ring-white"
          inputText={inputTextDay}
          setInputText={setInputTextDay}
        />
      </label>
    </>
  );
};

const JournalEditAll: React.FC<any> = ({
  willpowerCounter,
  inputTextDay,
  setInputTextDay,
  inputTextNight,
  setInputTextNight,
}) => {
  return (
    <>
      <h1 className="py-10 text-3xl">Edit your entries for today</h1>
      <label className="w-full mb-4">
        <h4 className="">{`Daily Willpower: ${willpowerCounter}`}</h4>
      </label>
      <label className="w-full mb-4">
        <h3 className="text-xl">What will make today great?</h3>
        <TextAreaList
          className="mx-0 bg-transparent ring-2 ring-white"
          inputText={inputTextDay}
          setInputText={setInputTextDay}
        />
      </label>
      <label className="w-full mb-4">
        <h3 className="text-xl">What were the highlights of your day?</h3>
        <TextAreaList
          className="mx-0 bg-transparent ring-2 ring-white"
          inputText={inputTextNight}
          setInputText={setInputTextNight}
        />
      </label>
    </>
  );
};

export default JournalEntryForm;
