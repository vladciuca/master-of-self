import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getToday, getTomorrow } from "@lib/time";
import { Session, JournalEntryMetadata } from "@app/types/types";

export function useTodayJournalEntry() {
  const [todayEntry, setTodayEntry] = useState<JournalEntryMetadata | null>(
    null
  );
  const [todayEntryLoading, setTodayEntryLoading] = useState(false);
  const [todayEntryError, setTodayEntryError] = useState<string | null>(null);
  const { data: session } = useSession() as { data: Session | null };

  const fetchTodayEntry = useCallback(async () => {
    if (!session?.user.id) return;

    setTodayEntryError(null);
    setTodayEntryLoading(true);

    try {
      const today = getToday();
      const tomorrow = getTomorrow();

      const todayEntryResponse = await fetch(
        `/api/users/${session.user.id}/journal-entries/today?today=${today}&tomorrow=${tomorrow}`
      );

      if (!todayEntryResponse.ok) {
        throw new Error(
          `Error fetching today's entry: ${todayEntryResponse.status}`
        );
      }

      const responseData = await todayEntryResponse.json();
      const entry = responseData?.todaysJournalEntry || null;
      setTodayEntry(entry);
    } catch (error) {
      console.error("Failed to fetch today's journal entry", error);
      setTodayEntryError("Failed to fetch today's journal entry");
    } finally {
      setTodayEntryLoading(false);
    }
  }, [session]);

  // useEffect(() => {
  //   const getTodayEntry = async () => {
  //     setTodayEntryError(null);
  //     setTodayEntryLoading(true);

  //     try {
  //       const today = getToday();
  //       const tomorrow = getTomorrow();

  //       const todayEntryResponse = await fetch(
  //         `/api/users/${session?.user.id}/journal-entries/today?today=${today}&tomorrow=${tomorrow}`
  //       );

  //       if (!todayEntryResponse.ok) {
  //         console.error(
  //           `Error fetching todays's entry: ${todayEntryResponse.status}`
  //         );
  //         return;
  //       }

  //       // const todayEntry = await todayEntryResponse.json();

  //       // if (!todayEntry) return;
  //       // setTodayEntry(todayEntry);
  //       const responseData = await todayEntryResponse.json();

  //       // Change: Check if the response contains todaysJournalEntry
  //       const entry = responseData?.todaysJournalEntry || null;

  //       setTodayEntry(entry);
  //     } catch (error) {
  //       console.error("Failed to fetch today's journal entry", error);
  //       setTodayEntryError("Failed to fetch today's journal entry");
  //     } finally {
  //       setTodayEntryLoading(false);
  //     }
  //   };

  //   if (session?.user.id) {
  //     getTodayEntry();
  //   }
  // }, [session]);

  useEffect(() => {
    fetchTodayEntry();
  }, [fetchTodayEntry]);

  return {
    todayEntry,
    todayEntryLoading,
    todayEntryError,
    refetchTodayEntry: fetchTodayEntry,
  };
}
