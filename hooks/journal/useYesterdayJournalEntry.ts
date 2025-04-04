import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { getYesterday } from "@/lib/time";
import { getNightDisciplineScores } from "@/lib/score";
import { useUserSettings } from "@context/UserSettingsContext";
import type { Session, JournalEntry, UserDisciplines } from "@models/types";

export function useYesterdayJournalEntry() {
  const { data: session } = useSession() as { data: Session | null };
  const { willpowerMultiplier, userSettingsLoading, userSettingsError } =
    useUserSettings();

  const [yesterdayEntry, setYesterdayEntry] = useState<JournalEntry | null>(
    null
  );
  const [yesterdayEntryLoading, setYesterdayEntryLoading] = useState(false);
  const [yesterdayEntryError, setYesterdayEntryError] = useState<string | null>(
    null
  );

  // Derive discipline scores from yesterdayEntry using the new function
  const nightEntryDisciplineScores = useMemo((): Partial<UserDisciplines> => {
    if (!yesterdayEntry || !yesterdayEntry.nightEntry) {
      return {};
    }

    // Use the new function to calculate night discipline scores
    return getNightDisciplineScores(yesterdayEntry.nightEntry);
  }, [yesterdayEntry]);

  // Derive bonusWillpower from discipline scores
  const bonusWillpower = useMemo(() => {
    // Handle loading state
    if (userSettingsLoading) {
      return null; // Or some loading indicator value
    }

    // Handle error state
    if (userSettingsError) {
      console.error("Error loading willpower multiplier:", userSettingsError);
      return null; // Or some error indicator value, or fall back to a default
    }

    // Sum all the discipline scores
    const totalScore = Object.values(nightEntryDisciplineScores).reduce(
      (sum, score) => sum + (score || 0),
      0
    );

    // Apply the same WP multiplier
    return Math.floor(totalScore * (willpowerMultiplier || 1.5));
  }, [nightEntryDisciplineScores, willpowerMultiplier]);

  useEffect(() => {
    if (!session?.user.id) return;

    // Create abort controller for cleanup
    const abortController = new AbortController();
    const signal = abortController.signal;

    setYesterdayEntryError(null);
    setYesterdayEntryLoading(true);

    const getYesterdayEntry = async () => {
      try {
        const yesterday = getYesterday();
        const url = `/api/users/${session.user.id}/journal-entries/yesterday?yesterday=${yesterday}`;

        const yesterdayEntryResponse = await fetch(url, {
          signal,
        });

        if (signal.aborted) return;

        if (!yesterdayEntryResponse.ok) {
          throw new Error(
            `Error fetching yesterday's entry: ${yesterdayEntryResponse.status}`
          );
        }

        const responseData = await yesterdayEntryResponse.json();
        const entry = responseData?.yesterdaysJournalEntry ?? null;

        setYesterdayEntry(entry);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.warn("Fetch aborted");
          return;
        }
        console.error("Failed to fetch yesterday's journal entry", error);

        setYesterdayEntryError("Failed to fetch yesterday's journal entry");
      } finally {
        // NOTE: If the request was aborted (signal.aborted === true), we skip updating loading = false to prevent incorrect state updates.
        if (!signal.aborted) {
          setYesterdayEntryLoading(false);
        }
      }
    };

    getYesterdayEntry();

    // Cleanup function to abort fetch if component unmounts
    return () => {
      abortController.abort();
    };
  }, [session?.user.id]);

  return {
    yesterdayEntry,
    yesterdayEntryLoading: yesterdayEntryLoading || userSettingsLoading,
    yesterdayEntryError,
    nightEntryDisciplineScores,
    bonusWillpower,
  };
}
