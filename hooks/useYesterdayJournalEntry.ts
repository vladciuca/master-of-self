import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getToday, getYesterday } from "@lib/time";
import { Session, JournalEntry } from "@app/types/types";

type HabitXp = { [key: string]: number };

export function useYesterdayJournalEntry() {
  const [yesterdayEntry, setYesterdayEntry] = useState<JournalEntry | null>(
    null
  );
  const [yesterdayEntryLoading, setYesterdayEntryLoading] = useState(false);
  const [yesterdayEntryError, setYesterdayEntryError] = useState<string | null>(
    null
  );
  const [yesterdayHighlights, setYesterdayHighlights] = useState([]);
  const [bonusWillpower, setBonusWillpower] = useState<number>(0);
  const [habitXp, setHabitXp] = useState<HabitXp>({});
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
          console.error(
            `Error fetching yesterday's entry: ${yesterdayEntryResponse.status}`
          );
          return;
        }

        const yesterdayEntry = await yesterdayEntryResponse.json();

        if (!yesterdayEntry) return;

        setYesterdayEntry(yesterdayEntry);

        if (yesterdayEntry.nightEntry.dailyHighlights.length > 0) {
          setYesterdayHighlights(yesterdayEntry.nightEntry.dailyHighlights);
          const calculatedBonus = calculateBonusWillpower(
            yesterdayEntry.nightEntry.dailyHighlights
          );
          setBonusWillpower(calculatedBonus);
        }

        if (
          yesterdayEntry.nightEntry.habits &&
          typeof yesterdayEntry.nightEntry.habits === "object" &&
          Object.keys(yesterdayEntry.nightEntry.habits).length > 0
        ) {
          setHabitXp(yesterdayEntry.nightEntry.habits);
        }
      } catch (error) {
        console.error("Failed to fetch journal entries", error);
        setYesterdayEntryError("Failed to fetch journal entries");
      } finally {
        setYesterdayEntryLoading(false);
      }
    };

    if (session?.user.id) {
      getYesterdayEntry();
    }
  }, [session]);

  const calculateBonusWillpower = (highlights: string[]) => {
    const totalEntries = highlights.length;
    const totalLength = highlights.join("").length;
    return Math.floor((totalEntries * 5 + totalLength) / 10);
  };

  return {
    yesterdayEntry,
    yesterdayEntryLoading,
    yesterdayEntryError,
    yesterdayHighlights,
    bonusWillpower,
    habitXp,
  };
}
