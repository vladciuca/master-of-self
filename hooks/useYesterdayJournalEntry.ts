import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Session } from "@app/types/types";

type HabitXp = { [key: string]: number };

export function useYesterdayJournalEntry() {
  const [bonusWillpower, setBonusWillpower] = useState<number>(0);
  const [habitXp, setHabitXp] = useState<HabitXp>({});
  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    const getYesterdayEntryRewards = async () => {
      if (session?.user?.id) {
        try {
          const localDate = new Date().toISOString().split("T")[0];
          const yesterdayEntryResponse = await fetch(
            `/api/users/${session.user.id}/journal-entries/yesterday?date=${localDate}`
          );

          if (!yesterdayEntryResponse.ok) {
            console.error(
              `Error fetching yesterday's entry: ${yesterdayEntryResponse.status}`
            );
            return;
          }

          const yesterdayEntry = await yesterdayEntryResponse.json();

          if (!yesterdayEntry) return;

          if (yesterdayEntry.nightEntry.dailyHighlights.length > 0) {
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
          console.error("Failed to fetch yesterday's entry:", error);
        }
      }
    };

    getYesterdayEntryRewards();
  }, [session]);

  const calculateBonusWillpower = (highlights: string[]) => {
    const totalEntries = highlights.length;
    const totalLength = highlights.join("").length;
    return Math.floor((totalEntries * 5 + totalLength) / 10);
  };

  return { bonusWillpower, habitXp };
}
