import React, { useEffect, useState } from "react";
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
  session: Session | null;
  submitting: boolean;
  onSubmit: (
    dailyWillpower: number,
    dayEntry: object,
    nightEntry: object
  ) => Promise<void>;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  session,
  submitting,
  onSubmit,
}) => {
  const [dailyWillpower, setDailyWillpower] = useState<number>(0);
  const [dayEntry, setDayEntry] = useState<object>({});
  const [nightEntry, setNightEntry] = useState<object>({});

  const handleSubmit = async () => {
    onSubmit(dailyWillpower, dayEntry, nightEntry);
  };
  return (
    <div>
      {/* POST_FUNC FOR The journal-entry obj in DB */}
      {/* check to see if any journal-entry exists in DB - GET_BY_ID */}

      {/* render button for Day or Night form based time*/}

      {/* PATCH_FUN to update dailyWillpower for both Day & Night forms */}

      {/*DAY FORM */}
      {/* PATCH_FUNC FOR The journal-entry object with the dayEntry: {} obj + dailyWillpower nr */}
      {/* NIGHT FORM*/}
      {/* PATCH_FUNC FOR The journal-entry object with the nightEntry: {} obj + dailyWillpower nr */}
      <Button onClick={handleSubmit} disabled={submitting}>
        Create entry
      </Button>
    </div>
  );
};

export default JournalEntryForm;
