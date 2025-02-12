import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getToday, getYesterday } from "@/lib/time";
import { calculateHabitsXpFromEntry } from "@/lib/level";
import type { Session, JournalEntry } from "@/app/types/types";
import { calculateWillpowerScore } from "@/lib/score";

type HabitsXp = { [key: string]: number };

export function useYesterdayJournalEntry() {
  const [yesterdayEntry, setYesterdayEntry] = useState<JournalEntry | null>(
    null
  );
  const [yesterdayEntryLoading, setYesterdayEntryLoading] = useState(false);
  const [yesterdayEntryError, setYesterdayEntryError] = useState<string | null>(
    null
  );
  const [bonusWillpower, setBonusWillpower] = useState<number>(0);
  const [howGreatTodayBonusWillpower, setHowGreatTodayBonusWillpower] =
    useState<number>(0);
  const [dailyHighlightsBonusWillpower, setDailyHighlightsBonusWillpower] =
    useState<number>(0);
  const [learnedTodayBonusWillpower, setLearnedTodayBonusWillpower] =
    useState<number>(0);
  const [habitsXp, setHabitsXp] = useState<HabitsXp>({});
  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    const getYesterdayEntry = async () => {
      if (!session?.user.id) return;

      setYesterdayEntryError(null);
      setYesterdayEntryLoading(true);

      try {
        const today = getToday();
        const yesterday = getYesterday();

        const yesterdayEntryResponse = await fetch(
          `/api/users/${session.user.id}/journal-entries/yesterday?today=${today}&yesterday=${yesterday}`
        );

        if (!yesterdayEntryResponse.ok) {
          throw new Error(
            `Error fetching yesterday's entry: ${yesterdayEntryResponse.status}`
          );
        }

        const responseData = await yesterdayEntryResponse.json();
        const entry = responseData?.yesterdaysJournalEntry || null;
        setYesterdayEntry(entry);

        const nightEntry = entry?.nightEntry || {
          dailyHighlights: [],
          howGreatToday: [],
          learnedToday: [],
          actions: {},
        };
        const dailyWillpower = entry?.dailyWillpower || 0;

        // Calculate individual bonus willpower scores
        const howGreatTodayScore = calculateWillpowerScore(
          nightEntry.howGreatToday || []
        );
        const dailyHighlightsScore = calculateWillpowerScore(
          nightEntry.dailyHighlights || []
        );
        const learnedTodayScore = calculateWillpowerScore(
          nightEntry.learnedToday || []
        );

        // Set individual scores
        setHowGreatTodayBonusWillpower(howGreatTodayScore);
        setDailyHighlightsBonusWillpower(dailyHighlightsScore);
        setLearnedTodayBonusWillpower(learnedTodayScore);

        // Calculate and set total bonus willpower
        const totalBonus =
          howGreatTodayScore + dailyHighlightsScore + learnedTodayScore;
        setBonusWillpower(totalBonus);

        // Calculate and set habits XP
        if (
          nightEntry.actions &&
          typeof nightEntry.actions === "object" &&
          Object.keys(nightEntry.actions).length > 0
        ) {
          const currentHabitsXp = calculateHabitsXpFromEntry(
            nightEntry.actions,
            dailyWillpower
          );
          setHabitsXp(currentHabitsXp);
        }
      } catch (error) {
        console.error("Failed to fetch yesterday's journal entry", error);
        setYesterdayEntryError("Failed to fetch yesterday's journal entry");
      } finally {
        setYesterdayEntryLoading(false);
      }
    };

    getYesterdayEntry();
  }, [session?.user.id]);

  return {
    yesterdayEntry,
    yesterdayEntryLoading,
    yesterdayEntryError,
    bonusWillpower,
    howGreatTodayBonusWillpower,
    dailyHighlightsBonusWillpower,
    learnedTodayBonusWillpower,
    habitsXp,
  };
}
