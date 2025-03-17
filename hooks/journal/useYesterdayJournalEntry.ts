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

  const [willpowerScores, setWillpowerScores] = useState<WillpowerScores>({
    howGreatToday: 0,
    dailyHighlights: 0,
    learnedToday: 0,
  });

  const bonusWillpower = useMemo(() => {
    const { howGreatToday, dailyHighlights, learnedToday } = willpowerScores;
    return howGreatToday + dailyHighlights + learnedToday;
  }, [willpowerScores]);

  const calculateWillpowerScores = (
    nightEntry: JournalEntry["nightEntry"]
  ): WillpowerScores => {
    // Use nullish coalescing to handle undefined/null values
    const howGreatToday = calculateWillpowerScore(
      nightEntry?.howGreatToday ?? []
    );
    const dailyHighlights = calculateWillpowerScore(
      nightEntry?.dailyHighlights ?? []
    );
    const learnedToday = calculateWillpowerScore(
      nightEntry?.learnedToday ?? []
    );

    return { howGreatToday, dailyHighlights, learnedToday };
  };

  // Helper function to reset states on error
  const resetStates = () => {
    setWillpowerScores({
      howGreatToday: 0,
      dailyHighlights: 0,
      learnedToday: 0,
    });
  };

  useEffect(() => {
    if (!session?.user.id) return;

    // Create abort controller for cleanup
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getYesterdayEntry = async () => {
      setYesterdayEntryError(null);
      setYesterdayEntryLoading(true);

      try {
        const yesterday = getYesterday();
        const url = `/api/users/${session.user.id}/journal-entries/yesterday?yesterday=${yesterday}`;

        const yesterdayEntryResponse = await fetch(url, {
          signal,
        });

        if (!yesterdayEntryResponse.ok) {
          throw new Error(
            `Error fetching yesterday's entry: ${yesterdayEntryResponse.status}`
          );
        }

        const responseData = await yesterdayEntryResponse.json();
        const entry = responseData?.yesterdaysJournalEntry ?? null;

        setYesterdayEntry(entry);

        if (!entry) return;

        // NOTE: fallback here to prevent unexpected or modified DB returns
        const nightEntry = entry.nightEntry ?? {
          dailyHighlights: [],
          howGreatToday: [],
          learnedToday: [],
        };

        const scores = calculateWillpowerScores(nightEntry);
        setWillpowerScores(scores);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.warn("Fetch aborted");
          return;
        }

        console.error("Failed to fetch yesterday's journal entry", error);
        setYesterdayEntryError("Failed to fetch yesterday's journal entry");
        // Reset state here to ensure consistency
        resetStates();
      } finally {
        setYesterdayEntryLoading(false);
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
