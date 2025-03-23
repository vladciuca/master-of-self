import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { getYesterday } from "@/lib/time";
import { calculateWillpowerScore } from "@/lib/score";
import type { Session, JournalEntry } from "@models/types";

// Define a type for our willpower scores state
type WillpowerScores = {
  howGreatToday: number;
  dailyHighlights: number;
  learnedToday: number;
};

export function useYesterdayJournalEntry() {
  const { data: session } = useSession() as { data: Session | null };

  const [yesterdayEntry, setYesterdayEntry] = useState<JournalEntry | null>(
    null
  );
  const [yesterdayEntryLoading, setYesterdayEntryLoading] = useState(false);
  const [yesterdayEntryError, setYesterdayEntryError] = useState<string | null>(
    null
  );

  // Derive willpowerScores from yesterdayEntry
  const willpowerScores = useMemo((): WillpowerScores => {
    if (!yesterdayEntry || !yesterdayEntry.nightEntry) {
      return {
        howGreatToday: 0,
        dailyHighlights: 0,
        learnedToday: 0,
      };
    }

    const nightEntry = yesterdayEntry.nightEntry;

    // Calculate scores from nightEntry
    const howGreatToday = calculateWillpowerScore(nightEntry?.night ?? []);
    const dailyHighlights = calculateWillpowerScore(
      nightEntry?.highlights ?? []
    );
    const learnedToday = calculateWillpowerScore(nightEntry?.reflection ?? []);

    return { howGreatToday, dailyHighlights, learnedToday };
  }, [yesterdayEntry]);

  // Derive bonusWillpower from willpowerScores
  const bonusWillpower = useMemo(() => {
    const { howGreatToday, dailyHighlights, learnedToday } = willpowerScores;
    return howGreatToday + dailyHighlights + learnedToday;
  }, [willpowerScores]);

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
    yesterdayEntryLoading,
    yesterdayEntryError,
    howGreatTodayBonusWillpower: willpowerScores.howGreatToday,
    dailyHighlightsBonusWillpower: willpowerScores.dailyHighlights,
    learnedTodayBonusWillpower: willpowerScores.learnedToday,
    bonusWillpower,
  };
}
