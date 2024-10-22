import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getToday, getYesterday } from "@lib/time";
//TO DO: Move this in function in the actions update call and
// use ONE CALL to update both Actions Values & Xp Value
import { calculateHabitsXpSumsFromActions } from "@lib/level";
import { Session, JournalEntry } from "@app/types/types";

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

  useEffect(() => {
    const getYesterdayEntry = async () => {
      setYesterdayEntryError(null);
      setYesterdayEntryLoading(true);
      try {
        const today = getToday();
        const yesterday = getYesterday();

        const yesterdayEntryResponse = await fetch(
          `/api/users/${session?.user.id}/journal-entries/yesterday?today=${today}&yesterday=${yesterday}`
        );

        if (!yesterdayEntryResponse.ok) {
          throw new Error(
            `Error fetching yesterday's entry: ${yesterdayEntryResponse.status}`
          );
        }

        const responseData = await yesterdayEntryResponse.json();

        // Check if the response contains yesterdaysJournalEntry
        const entry = responseData?.yesterdaysJournalEntry || null;

        setYesterdayEntry(entry);

        // Handle the case where entry or nightEntry might be null
        const nightEntry = entry?.nightEntry || {
          dailyHighlights: [],
          actions: {},
        };

        const dailyWillpower = entry?.dailyWillpower || 0;

        if (
          Array.isArray(nightEntry.dailyHighlights) &&
          nightEntry.dailyHighlights.length > 0
        ) {
          setYesterdayHighlights(nightEntry.dailyHighlights);

          // FAST IMPLEMENTATION FOR ADDING BONUS FROM LEARNED_TODAY NIGHT_STEP
          let extraBonus = 0;

          if (
            Array.isArray(nightEntry.learnedToday) &&
            nightEntry.learnedToday.length > 0
          ) {
            extraBonus = calculateBonusWillpower(nightEntry.learnedToday);
          }

          const calculatedBonus = calculateBonusWillpower(
            nightEntry.dailyHighlights
          );
          setBonusWillpower(calculatedBonus + extraBonus);
        } else {
          setYesterdayHighlights([]);
          setBonusWillpower(0);
        }

        if (
          nightEntry.actions &&
          typeof nightEntry.actions === "object" &&
          Object.keys(nightEntry.actions).length > 0
        ) {
          const habitXpFromActions = calculateHabitsXpSumsFromActions(
            nightEntry.actions,
            dailyWillpower
          );
          setHabitsXp(habitXpFromActions);
        } else {
          setHabitsXp({});
        }
      } catch (error) {
        console.error("Failed to fetch yesterday's journal entry", error);
        setYesterdayEntryError("Failed to fetch yesterday's journal entry");
      } finally {
        setYesterdayEntryLoading(false);
      }
    };

    if (session?.user.id) {
      getYesterdayEntry();
    }
  }, [session]);

  const calculateBonusWillpower = (stringArray: string[]) => {
    const totalEntries = stringArray.length;
    const totalLength = stringArray.join("").length;
    return Math.floor((totalEntries * 5 + totalLength) / 10);
  };

  return {
    yesterdayEntry,
    yesterdayEntryLoading,
    yesterdayEntryError,
    yesterdayHighlights,
    bonusWillpower,
    habitsXp,
  };
}
