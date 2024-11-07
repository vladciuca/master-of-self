import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { calculateHabitsXpSumsFromActions } from "@/lib/level";
import { Session, JournalEntry } from "@/app/types/types";

type HabitsXp = { [key: string]: number };

export function useLastJournalEntry() {
  const [lastEntry, setLastEntry] = useState<JournalEntry | null>(null);
  const [lastEntryLoading, setLastEntryLoading] = useState(false);
  const [lastEntryError, setLastEntryError] = useState<string | null>(null);
  const [lastHighlights, setLastHighlights] = useState<string[]>([]);
  const [bonusWillpower, setBonusWillpower] = useState<number>(0);
  const [habitsXp, setHabitsXp] = useState<HabitsXp>({});
  const { data: session } = useSession() as { data: Session | null };

  const calculateBonusWillpower = (stringArray: string[]) => {
    const totalEntries = stringArray.length;
    const totalLength = stringArray.join("").length;
    return Math.floor((totalEntries * 5 + totalLength) / 10);
  };

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
          actions: {},
        };
        const dailyWillpower = entry?.dailyWillpower || 0;

        if (
          Array.isArray(nightEntry.dailyHighlights) &&
          nightEntry.dailyHighlights.length > 0
        ) {
          setLastHighlights(nightEntry.dailyHighlights);
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
          setLastHighlights([]);
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
    lastHighlights,
    bonusWillpower,
    habitsXp,
  };
}
