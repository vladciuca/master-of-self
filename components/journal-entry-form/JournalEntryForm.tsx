import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@components/ui/button";

interface User {
  id: string;
  name?: string;
  email?: string;
  // Add other properties you expect in the user object
}

interface Session {
  user: User;
  // Add other properties you expect in the session object
}

interface JournalEntryFormProps {
  type?: "update" | "create";
  session: Session | null;
  submitting: boolean;
  onSubmit: (
    dailyWillpower: number,
    dayEntry: object,
    nightEntry: object
  ) => Promise<void>;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  type = "create",
  session,
  submitting,
  onSubmit,
}, {params: }) => {
  const [dailyWillpower, setDailyWillpower] = useState<number>(0);
  const [dayEntry, setDayEntry] = useState<object>({});
  const [nightEntry, setNightEntry] = useState<object>({});

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    entryType: "day" | "night"
  ) => {
    entryType === "day"
      ? setDayEntry({ day: event.target.value })
      : setNightEntry({ night: event.target.value });
  };

  const handleSubmit = async () => {
    onSubmit(dailyWillpower, dayEntry, nightEntry);
  };
  return (
    <div className="flex flex-col w-full p-2">
      {/* POST_FUNC FOR The journal-entry obj in DB */}
      {/* check to see if any journal-entry exists in DB - GET_BY_ID */}

      {/* render button for Day or Night form based time*/}

      {/* PATCH_FUN to update dailyWillpower for both Day & Night forms */}

      {/*DAY FORM */}
      {/* PATCH_FUNC FOR The journal-entry object with the dayEntry: {} obj + dailyWillpower nr */}
      {/* NIGHT FORM*/}
      {/* PATCH_FUNC FOR The journal-entry object with the nightEntry: {} obj + dailyWillpower nr */}
      <label className="w-full mb-10">
        DAY CONTENT:
        <input
          className="w-full"
          type="text"
          onChange={(event) => handleChange(event, "day")}
        />
      </label>
      <label className="w-full mb-10">
        NIGHT CONTENT:
        <input
          className="w-full"
          type="text"
          onChange={(event) => handleChange(event, "night")}
        />
      </label>

      <Button onClick={handleSubmit} disabled={submitting}>
        {type === "create" ? "Create entry" : "Update entry"}
      </Button>
    </div>
  );
};

export default JournalEntryForm;
