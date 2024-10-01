// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { getToday, getYesterday } from "@lib/time";
// import { Session, JournalEntry } from "@app/types/types";

// type HabitXp = { [key: string]: number };

// export function useYesterdayJournalEntry() {
//   const [yesterdayEntry, setYesterdayEntry] = useState<JournalEntry | null>(
//     null
//   );
//   const [yesterdayEntryLoading, setYesterdayEntryLoading] = useState(false);
//   const [yesterdayEntryError, setYesterdayEntryError] = useState<string | null>(
//     null
//   );
//   const [yesterdayHighlights, setYesterdayHighlights] = useState([]);
//   const [bonusWillpower, setBonusWillpower] = useState<number>(0);
//   const [habitXp, setHabitXp] = useState<HabitXp>({});
//   const { data: session } = useSession() as { data: Session | null };

//   // useEffect(() => {
//   //   const getYesterdayEntry = async () => {
//   //     setYesterdayEntryError(null);
//   //     setYesterdayEntryLoading(true);
//   //     try {
//   //       const today = getToday();
//   //       const yesterday = getYesterday();

//   //       const yesterdayEntryResponse = await fetch(
//   //         `/api/users/${session?.user.id}/journal-entries/yesterday?today=${today}&yesterday=${yesterday}`
//   //       );

//   //       if (!yesterdayEntryResponse.ok) {
//   //         console.error(
//   //           `Error fetching yesterday's entry: ${yesterdayEntryResponse.status}`
//   //         );
//   //         return;
//   //       }

//   //       const yesterdayEntry = await yesterdayEntryResponse.json();

//   //       if (!yesterdayEntry) return;

//   //       setYesterdayEntry(yesterdayEntry);

//   //       if (yesterdayEntry.nightEntry.dailyHighlights.length > 0) {
//   //         setYesterdayHighlights(yesterdayEntry.nightEntry.dailyHighlights);
//   //         const calculatedBonus = calculateBonusWillpower(
//   //           yesterdayEntry.nightEntry.dailyHighlights
//   //         );
//   //         setBonusWillpower(calculatedBonus);
//   //       }

//   //       if (
//   //         yesterdayEntry.nightEntry.habits &&
//   //         typeof yesterdayEntry.nightEntry.habits === "object" &&
//   //         Object.keys(yesterdayEntry.nightEntry.habits).length > 0
//   //       ) {
//   //         setHabitXp(yesterdayEntry.nightEntry.habits);
//   //       }
//   //     } catch (error) {
//   //       console.error("Failed to fetch journal entries", error);
//   //       setYesterdayEntryError("Failed to fetch journal entries");
//   //     } finally {
//   //       setYesterdayEntryLoading(false);
//   //     }
//   //   };

//   //   if (session?.user.id) {
//   //     getYesterdayEntry();
//   //   }
//   // }, [session]);

//   useEffect(() => {
//     const getYesterdayEntry = async () => {
//       setYesterdayEntryError(null);
//       setYesterdayEntryLoading(true);
//       try {
//         const today = getToday();
//         const yesterday = getYesterday();

//         const yesterdayEntryResponse = await fetch(
//           `/api/users/${session?.user.id}/journal-entries/yesterday?today=${today}&yesterday=${yesterday}`
//         );

//         if (!yesterdayEntryResponse.ok) {
//           throw new Error(
//             `Error fetching yesterday's entry: ${yesterdayEntryResponse.status}`
//           );
//         }

//         const responseData = await yesterdayEntryResponse.json();

//         // Check if the response contains yesterdaysJournalEntry
//         const entry = responseData?.yesterdaysJournalEntry || null;

//         // Use default values when entry is null
//         const safeEntry = entry || {
//           nightEntry: {
//             dailyHighlights: [],
//             habits: {},
//           },
//         };

//         setYesterdayEntry(safeEntry);

//         // Change: Use optional chaining to safely access properties
//         if (safeEntry.nightEntry?.dailyHighlights?.length > 0) {
//           setYesterdayHighlights(safeEntry.nightEntry.dailyHighlights);
//           const calculatedBonus = calculateBonusWillpower(
//             safeEntry.nightEntry.dailyHighlights
//           );
//           setBonusWillpower(calculatedBonus);
//         } else {
//           // Set default values when no highlights are present
//           setYesterdayHighlights([]);
//           setBonusWillpower(0);
//         }

//         if (
//           safeEntry.nightEntry?.habits &&
//           typeof entry.nightEntry.habits === "object" &&
//           Object.keys(safeEntry.nightEntry.habits).length > 0
//         ) {
//           setHabitXp(safeEntry.nightEntry.habits);
//         } else {
//           // Set default value when no habits are present
//           setHabitXp({});
//         }
//       } catch (error) {
//         console.error("Failed to fetch yesterday's journal entry", error);
//         setYesterdayEntryError("Failed to fetch yesterday's journal entry");
//       } finally {
//         setYesterdayEntryLoading(false);
//       }
//     };

//     if (session?.user.id) {
//       getYesterdayEntry();
//     }
//   }, [session]);

//   const calculateBonusWillpower = (highlights: string[]) => {
//     const totalEntries = highlights.length;
//     const totalLength = highlights.join("").length;
//     return Math.floor((totalEntries * 5 + totalLength) / 10);
//   };

//   return {
//     yesterdayEntry,
//     yesterdayEntryLoading,
//     yesterdayEntryError,
//     yesterdayHighlights,
//     bonusWillpower,
//     habitXp,
//   };
// }

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
  const [yesterdayHighlights, setYesterdayHighlights] = useState<string[]>([]);
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
          habits: {},
        };

        if (
          Array.isArray(nightEntry.dailyHighlights) &&
          nightEntry.dailyHighlights.length > 0
        ) {
          setYesterdayHighlights(nightEntry.dailyHighlights);
          const calculatedBonus = calculateBonusWillpower(
            nightEntry.dailyHighlights
          );
          setBonusWillpower(calculatedBonus);
        } else {
          setYesterdayHighlights([]);
          setBonusWillpower(0);
        }

        if (
          nightEntry.habits &&
          typeof nightEntry.habits === "object" &&
          Object.keys(nightEntry.habits).length > 0
        ) {
          setHabitXp(nightEntry.habits);
        } else {
          setHabitXp({});
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
