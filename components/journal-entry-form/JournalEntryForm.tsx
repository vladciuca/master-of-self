import React, { ChangeEvent, useState } from "react";
import { Button } from "@components/ui/button";

interface User {
  id: string;
  name?: string;
  email?: string;
}

interface Session {
  user: User;
}

interface JournalEntry {
  dailyWillpower: number;
  day: { myDay: string };
  night: { myNight: string };
}

type JournalEntryFormProps = {
  type: "create" | "update";
  session: Session | null;
  submitting: boolean;
  onSubmit: (entry: JournalEntry) => Promise<void>;
  initialData?: JournalEntry;
};

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  type,
  session,
  submitting,
  onSubmit,
  initialData,
}) => {
  const [entry, setEntry] = useState<JournalEntry>(
    initialData || {
      dailyWillpower: 0,
      day: { myDay: "" },
      night: { myNight: "" },
    }
  );

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "dailyWillpower" | "day" | "night"
  ) => {
    const value = event.target.value;
    if (field === "dailyWillpower") {
      setEntry({ ...entry, dailyWillpower: Number(value) });
    } else if (field === "day") {
      setEntry({ ...entry, day: { myDay: value } });
    } else {
      setEntry({ ...entry, night: { myNight: value } });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.user) {
      await onSubmit(entry);
    } else {
      console.error("User not authenticated");
    }
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
          value={entry.dailyWillpower}
          onChange={(e) => handleChange(e, "dailyWillpower")}
        />
      </label>
      <label className="w-full mb-4">
        Day Entry:
        <textarea
          className="w-full"
          value={entry.day.myDay}
          onChange={(e) => handleChange(e, "day")}
        />
      </label>
      <label className="w-full mb-4">
        Night Entry:
        <textarea
          className="w-full"
          value={entry.night.myNight}
          onChange={(e) => handleChange(e, "night")}
        />
      </label>
      <Button type="submit" disabled={submitting}>
        {type === "create" ? "Create Entry" : "Update Entry"}
      </Button>
    </form>
  );
};

export default JournalEntryForm;
