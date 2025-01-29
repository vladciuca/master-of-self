import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getToday, getYesterday } from "@/lib/time";
import { calculateHabitsXpSumsFromActions } from "@/lib/level";
import { Session, JournalEntry } from "@/app/types/types";

type HabitsXp = { [key: string]: number };

export function useYesterdayJournalEntry() {
  const [yesterdayEntry, setYesterdayEntry] = useState<JournalEntry | null>(
    null
  );
  const [yesterdayEntryLoading, setYesterdayEntryLoading] = useState(false);
  const [yesterdayEntryError, setYesterdayEntryError] = useState<string | null>(
    null
  );
  const [yesterdayHighlights, setYesterdayHighlights] = useState<string[]>([]);
  const [bonusWillpower, setBonusWillpower] = useState<number>(0);
  const [habitsXp, setHabitsXp] = useState<HabitsXp>({});
  const { data: session } = useSession() as { data: Session | null };

  const calculateBonusWillpower = (stringArray: string[]) => {
    const totalEntries = stringArray.length;
    const totalLength = stringArray.join("").length;
    return Math.floor((totalEntries * 5 + totalLength) / 10);
  };

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
          actions: {},
        };
        const dailyWillpower = entry?.dailyWillpower || 0;

        if (
          Array.isArray(nightEntry.dailyHighlights) &&
          nightEntry.dailyHighlights.length > 0
        ) {
          setYesterdayHighlights(nightEntry.dailyHighlights);
          let extraBonus = 0;

          if (
            Array.isArray(nightEntry.howGreatToday) &&
            nightEntry.howGreatToday.length > 0
          ) {
            extraBonus += calculateBonusWillpower(nightEntry.howGreatToday);
          }

          if (
            Array.isArray(nightEntry.learnedToday) &&
            nightEntry.learnedToday.length > 0
          ) {
            extraBonus += calculateBonusWillpower(nightEntry.learnedToday);
          }

          const calculatedBonus = calculateBonusWillpower(
            nightEntry.dailyHighlights
          );
          setBonusWillpower(calculatedBonus + extraBonus);
        } else {
          setYesterdayHighlights([]);
          setBonusWillpower(0);
        }

        let currentHabitsXp = {};
        if (
          nightEntry.actions &&
          typeof nightEntry.actions === "object" &&
          Object.keys(nightEntry.actions).length > 0
        ) {
          currentHabitsXp = calculateHabitsXpSumsFromActions(
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
    yesterdayHighlights,
    bonusWillpower,
    habitsXp,
  };
}
