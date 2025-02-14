import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { calculateHabitsXpFromEntry } from "@/lib/level";
import { calculateWillpowerScore } from "@/lib/score";
import type { Session, JournalEntry } from "@models/types";

type HabitsXp = { [key: string]: number };

export function useLastJournalEntry() {
  const [lastEntry, setLastEntry] = useState<JournalEntry | null>(null);
  const [lastEntryLoading, setLastEntryLoading] = useState(false);
  const [lastEntryError, setLastEntryError] = useState<string | null>(null);
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
    const getLastEntry = async () => {
      if (!session?.user.id) return;

      setLastEntryError(null);
      setLastEntryLoading(true);

      try {
        const lastEntryResponse = await fetch(
          `/api/users/${session.user.id}/journal-entries/last`
        );

        if (!lastEntryResponse.ok) {
          throw new Error(
            `Error fetching last entry: ${lastEntryResponse.status}`
          );
        }

        const responseData = await lastEntryResponse.json();
        const entry = responseData?.lastJournalEntry || null;
        setLastEntry(entry);

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
        console.error("Failed to fetch last journal entry", error);
        setLastEntryError("Failed to fetch last journal entry");
      } finally {
        setLastEntryLoading(false);
      }
    };

    getLastEntry();
  }, [session?.user.id]);

  return {
    lastEntry,
    lastEntryLoading,
    lastEntryError,
    bonusWillpower,
    howGreatTodayBonusWillpower,
    dailyHighlightsBonusWillpower,
    learnedTodayBonusWillpower,
    habitsXp,
  };
}
