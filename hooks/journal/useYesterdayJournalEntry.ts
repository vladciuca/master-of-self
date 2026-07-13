import { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { getYesterday } from "@/lib/time";
import { getNightDisciplineScores } from "@/lib/score";
import { useUserProfile } from "@context/UserProfileContext";
import type { User, JournalEntry } from "@models/types";

export function useYesterdayJournalEntry() {
  const { user } = useUser() as { user: User | null };
  const { userProfile, userProfileLoading, userProfileError } =
    useUserProfile();

  const [yesterdayEntry, setYesterdayEntry] = useState<JournalEntry | null>(
    null
  );
  const [yesterdayEntryLoading, setYesterdayEntryLoading] = useState(false);
  const [yesterdayEntryError, setYesterdayEntryError] = useState<string | null>(
    null
  );

  const nightEntryDisciplineScores = useMemo((): Record<string, number> => {
    if (!yesterdayEntry || !yesterdayEntry.nightEntry) {
      return {};
    }

    return getNightDisciplineScores(yesterdayEntry.nightEntry);
  }, [yesterdayEntry]);

  const bonusWillpower = useMemo(() => {
    if (userProfileLoading) {
      return null;
    }

    if (userProfileError) {
      console.error("Error loading willpower multiplier:", userProfileError);
      return null;
    }

    const totalScore = Object.entries(nightEntryDisciplineScores)
      .filter(([key]) => key !== "_motivationMultiplier")
      .reduce((sum, [, score]) => sum + (score || 0), 0);

    return Math.floor(totalScore * (userProfile?.willpowerMultiplier || 1.5));
  }, [
    nightEntryDisciplineScores,
    userProfile?.willpowerMultiplier,
    userProfileLoading,
    userProfileError,
  ]);

  useEffect(() => {
    if (!user?.id) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    setYesterdayEntryError(null);
    setYesterdayEntryLoading(true);

    const getYesterdayEntry = async () => {
      try {
        const yesterday = getYesterday();
        const url = `/api/users/${user.id}/journal-entries/yesterday?yesterday=${yesterday}`;

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
        if (!signal.aborted) {
          setYesterdayEntryLoading(false);
        }
      }
    };

    getYesterdayEntry();

    return () => {
      abortController.abort();
    };
  }, [user?.id]);

  return {
    yesterdayEntry,
    yesterdayEntryLoading: yesterdayEntryLoading || userProfileLoading,
    yesterdayEntryError,
    nightEntryDisciplineScores,
    bonusWillpower,
  };
}
