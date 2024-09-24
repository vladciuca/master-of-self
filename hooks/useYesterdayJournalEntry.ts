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
          const yesterdayEntryResponse = await fetch(
            `/api/users/${session.user.id}/journal-entries/yesterday`
          );

          if (!yesterdayEntryResponse.ok) {
            console.error(
              `Error fetching yesterday's entry: ${yesterdayEntryResponse.status}`
            );
            return;
          }

          // TO DO: deconstruct data here
          const data = await yesterdayEntryResponse.json();

          if (!data) return;

          // if (yesterdayEntry?.nightEntry?.dailyHighlights?.length) {
          //   const calculatedBonus = calculateBonusWillpower(
          //     yesterdayEntry.nightEntry.dailyHighlights
          //   );
          //   setBonusWillpower(calculatedBonus);
          // }

          // if (yesterdayEntry?.nightEntry?.habits) {
          //   setHabitXp(yesterdayEntry.nightEntry.habits);
          // }
          if (data.entry) {
            if (data.entry.nightEntry?.dailyHighlights?.length) {
              const calculatedBonus = calculateBonusWillpower(
                data.entry.nightEntry.dailyHighlights
              );
              setBonusWillpower(calculatedBonus);
            }

            if (data.entry.nightEntry?.habits) {
              setHabitXp(data.entry.nightEntry.habits);
            }
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
