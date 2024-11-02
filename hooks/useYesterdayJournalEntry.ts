// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { getToday, getYesterday } from "@lib/time";
// //TO DO: Move this in function in the actions update call and
// // use ONE CALL to update both Actions Values & Xp Value
// import { calculateHabitsXpSumsFromActions } from "@lib/level";
// import { Session, JournalEntry } from "@app/types/types";

// type HabitsXp = { [key: string]: number };

// export function useYesterdayJournalEntry() {
//   const [yesterdayEntry, setYesterdayEntry] = useState<JournalEntry | null>(
//     null
//   );
//   const [yesterdayEntryLoading, setYesterdayEntryLoading] = useState(false);
//   const [yesterdayEntryError, setYesterdayEntryError] = useState<string | null>(
//     null
//   );
//   const [yesterdayHighlights, setYesterdayHighlights] = useState<string[]>([]);
//   const [bonusWillpower, setBonusWillpower] = useState<number>(0);
//   const [habitsXp, setHabitsXp] = useState<HabitsXp>({});
//   const { data: session } = useSession() as { data: Session | null };

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

//         setYesterdayEntry(entry);

//         // Handle the case where entry or nightEntry might be null
//         const nightEntry = entry?.nightEntry || {
//           dailyHighlights: [],
//           actions: {},
//         };

//         const dailyWillpower = entry?.dailyWillpower || 0;

//         if (
//           Array.isArray(nightEntry.dailyHighlights) &&
//           nightEntry.dailyHighlights.length > 0
//         ) {
//           setYesterdayHighlights(nightEntry.dailyHighlights);

//           // FAST IMPLEMENTATION FOR ADDING BONUS FROM LEARNED_TODAY NIGHT_STEP
//           let extraBonus = 0;

//           if (
//             Array.isArray(nightEntry.learnedToday) &&
//             nightEntry.learnedToday.length > 0
//           ) {
//             extraBonus = calculateBonusWillpower(nightEntry.learnedToday);
//           }

//           const calculatedBonus = calculateBonusWillpower(
//             nightEntry.dailyHighlights
//           );
//           setBonusWillpower(calculatedBonus + extraBonus);
//         } else {
//           setYesterdayHighlights([]);
//           setBonusWillpower(0);
//         }

//         if (
//           nightEntry.actions &&
//           typeof nightEntry.actions === "object" &&
//           Object.keys(nightEntry.actions).length > 0
//         ) {
//           const habitXpFromActions = calculateHabitsXpSumsFromActions(
//             nightEntry.actions,
//             dailyWillpower
//           );

//           setHabitsXp(habitXpFromActions);
//         } else {
//           setHabitsXp({});
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

//   const calculateBonusWillpower = (stringArray: string[]) => {
//     const totalEntries = stringArray.length;
//     const totalLength = stringArray.join("").length;
//     return Math.floor((totalEntries * 5 + totalLength) / 10);
//   };

//   return {
//     yesterdayEntry,
//     yesterdayEntryLoading,
//     yesterdayEntryError,
//     yesterdayHighlights,
//     bonusWillpower,
//     habitsXp,
//   };
// }
// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { getToday, getYesterday } from "@/lib/time";
// import { calculateHabitsXpSumsFromActions } from "@/lib/level";
// import { Session, JournalEntry } from "@/app/types/types";
// import { HabitActionUpdate } from "@app/types/mongodb";

// type HabitsXp = { [key: string]: number };

// export function useYesterdayJournalEntry() {
//   const [yesterdayEntry, setYesterdayEntry] = useState<JournalEntry | null>(
//     null
//   );
//   const [yesterdayEntryLoading, setYesterdayEntryLoading] = useState(false);
//   const [yesterdayEntryError, setYesterdayEntryError] = useState<string | null>(
//     null
//   );
//   const [yesterdayHighlights, setYesterdayHighlights] = useState<string[]>([]);
//   const [bonusWillpower, setBonusWillpower] = useState<number>(0);
//   const [habitsXp, setHabitsXp] = useState<HabitsXp>({});
//   const { data: session } = useSession() as { data: Session | null };

//   const updateHabitXP = async (habits: { [key: string]: number }) => {
//     try {
//       const habitUpdates = Object.entries(habits);
//       const response = await fetch(
//         `/api/users/${session?.user.id}/habits/updateXp`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(habitUpdates),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update habits");
//       }
//     } catch (error) {
//       console.error("Error updating habits:", error);
//       throw error;
//     }
//   };

//   const updateHabitActions = async (habitActionUpdates: HabitActionUpdate) => {
//     try {
//       const response = await fetch(
//         `/api/users/${session?.user.id}/habits/updateActions`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(habitActionUpdates),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update habit actions");
//       }

//       const data = await response.json();
//       return data.habits;
//     } catch (error) {
//       console.error("Error updating habit actions:", error);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     const getYesterdayEntry = async () => {
//       setYesterdayEntryError(null);
//       setYesterdayEntryLoading(true);
//       try {
//         const today = getToday();
//         const yesterday = getYesterday();

//         // Fetch yesterday's entry
//         const yesterdayEntryResponse = await fetch(
//           `/api/users/${session?.user.id}/journal-entries/yesterday?today=${today}&yesterday=${yesterday}`
//         );

//         if (!yesterdayEntryResponse.ok) {
//           throw new Error(
//             `Error fetching yesterday's entry: ${yesterdayEntryResponse.status}`
//           );
//         }

//         const responseData = await yesterdayEntryResponse.json();
//         const entry = responseData?.yesterdaysJournalEntry || null;
//         setYesterdayEntry(entry);

//         // Handle the case where entry or nightEntry might be null
//         const nightEntry = entry?.nightEntry || {
//           dailyHighlights: [],
//           actions: {},
//         };
//         const dailyWillpower = entry?.dailyWillpower || 0;

//         // Process highlights and calculate bonus willpower
//         if (
//           Array.isArray(nightEntry.dailyHighlights) &&
//           nightEntry.dailyHighlights.length > 0
//         ) {
//           setYesterdayHighlights(nightEntry.dailyHighlights);
//           let extraBonus = 0;
//           if (
//             Array.isArray(nightEntry.learnedToday) &&
//             nightEntry.learnedToday.length > 0
//           ) {
//             extraBonus = calculateBonusWillpower(nightEntry.learnedToday);
//           }
//           const calculatedBonus = calculateBonusWillpower(
//             nightEntry.dailyHighlights
//           );
//           setBonusWillpower(calculatedBonus + extraBonus);
//         } else {
//           setYesterdayHighlights([]);
//           setBonusWillpower(0);
//         }

//         // Calculate habits XP
//         if (
//           nightEntry.actions &&
//           typeof nightEntry.actions === "object" &&
//           Object.keys(nightEntry.actions).length > 0
//         ) {
//           const habitXpFromActions = calculateHabitsXpSumsFromActions(
//             nightEntry.actions,
//             dailyWillpower
//           );
//           setHabitsXp(habitXpFromActions);
//         } else {
//           setHabitsXp({});
//         }

//         // Fetch last update time
//         const lastUpdateTimeResponse = await fetch(
//           `/api/users/${session?.user.id}/last-updated`
//         );
//         const lastUpdateTimeData = await lastUpdateTimeResponse.json();
//         const lastUpdateTime = lastUpdateTimeData.lastUpdateTime;

//         const todayDate = getToday().toISOString().split("T")[0];

//         if (!lastUpdateTime || lastUpdateTime !== todayDate) {
//           // Update XP and Habit actions
//           if (Object.keys(habitsXp).length > 0) {
//             await updateHabitXP(habitsXp);
//           }

//           if (
//             nightEntry.actions &&
//             Object.keys(nightEntry.actions).length > 0
//           ) {
//             await updateHabitActions(nightEntry.actions);
//           }

//           // Update lastHabitUpdateTime
//           await fetch(`/api/users/${session?.user.id}/last-updated`, {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ updateTime: todayDate }),
//           });
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

//   const calculateBonusWillpower = (stringArray: string[]) => {
//     const totalEntries = stringArray.length;
//     const totalLength = stringArray.join("").length;
//     return Math.floor((totalEntries * 5 + totalLength) / 10);
//   };

//   return {
//     yesterdayEntry,
//     yesterdayEntryLoading,
//     yesterdayEntryError,
//     yesterdayHighlights,
//     bonusWillpower,
//     habitsXp,
//   };
// }
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { getToday, getYesterday } from "@/lib/time";
import { calculateHabitsXpSumsFromActions } from "@/lib/level";
import { Session, JournalEntry } from "@/app/types/types";
import { HabitActionUpdate } from "@app/types/mongodb";

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

  // Add a ref to track if updates have been performed
  const updatesPerformedRef = useRef(false);

  const updateHabitXP = async (habits: { [key: string]: number }) => {
    try {
      const habitUpdates = Object.entries(habits);
      const response = await fetch(
        `/api/users/${session?.user.id}/habits/updateXp`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(habitUpdates),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update habits");
      }
    } catch (error) {
      console.error("Error updating habits:", error);
      throw error;
    }
  };

  const updateHabitActions = async (habitActionUpdates: HabitActionUpdate) => {
    try {
      const response = await fetch(
        `/api/users/${session?.user.id}/habits/updateActions`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(habitActionUpdates),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update habit actions");
      }

      const data = await response.json();
      return data.habits;
    } catch (error) {
      console.error("Error updating habit actions:", error);
      throw error;
    }
  };

  const calculateBonusWillpower = (stringArray: string[]) => {
    const totalEntries = stringArray.length;
    const totalLength = stringArray.join("").length;
    return Math.floor((totalEntries * 5 + totalLength) / 10);
  };

  useEffect(() => {
    const getYesterdayEntry = async () => {
      // If there's no session user ID, return early
      if (!session?.user.id) return;

      setYesterdayEntryError(null);
      setYesterdayEntryLoading(true);

      try {
        const today = getToday();
        const yesterday = getYesterday();

        // Fetch yesterday's entry
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

        // Handle the case where entry or nightEntry might be null
        const nightEntry = entry?.nightEntry || {
          dailyHighlights: [],
          actions: {},
        };
        const dailyWillpower = entry?.dailyWillpower || 0;

        // Process highlights and calculate bonus willpower
        if (
          Array.isArray(nightEntry.dailyHighlights) &&
          nightEntry.dailyHighlights.length > 0
        ) {
          setYesterdayHighlights(nightEntry.dailyHighlights);
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

        // Calculate habits XP
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

        // Only proceed with updates if they haven't been performed yet
        if (!updatesPerformedRef.current) {
          // Fetch last update time
          const lastUpdateTimeResponse = await fetch(
            `/api/users/${session.user.id}/last-updated`
          );

          if (!lastUpdateTimeResponse.ok) {
            throw new Error("Failed to fetch last update time");
          }

          const lastUpdateTimeData = await lastUpdateTimeResponse.json();
          const lastUpdateTime = lastUpdateTimeData.lastUpdateTime;

          const todayDate = getToday().toISOString().split("T")[0];

          console.log("====== AM UPDATAT AZI");

          if (!lastUpdateTime || lastUpdateTime !== todayDate) {
            console.log("====== UPDATEZ HABIT");
            // Update XP and Habit actions
            if (Object.keys(currentHabitsXp).length > 0) {
              console.log("====== UPDATEZ XP", currentHabitsXp);
              await updateHabitXP(currentHabitsXp);
              console.log("====== DUPA CE AM UPDATAT XP", currentHabitsXp);
            }

            if (
              nightEntry.actions &&
              Object.keys(nightEntry.actions).length > 0
            ) {
              console.log("====== UPDATEZ ACTIUNI");
              await updateHabitActions(nightEntry.actions);
            }

            // Update lastHabitUpdateTime
            await fetch(`/api/users/${session.user.id}/last-updated`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ updateTime: todayDate }),
            });
            console.log("====== DUPA CE POSTEZ LAST UPDATE FLAG");

            // Mark updates as performed
            updatesPerformedRef.current = true;
          }
        }
      } catch (error) {
        console.error("Failed to fetch yesterday's journal entry", error);
        setYesterdayEntryError("Failed to fetch yesterday's journal entry");
      } finally {
        setYesterdayEntryLoading(false);
      }
    };

    getYesterdayEntry();
  }, [session?.user.id]); // Only depend on session.user.id

  return {
    yesterdayEntry,
    yesterdayEntryLoading,
    yesterdayEntryError,
    yesterdayHighlights,
    bonusWillpower,
    habitsXp,
  };
}
// import { useState, useEffect, useRef } from "react";
// import { useSession } from "next-auth/react";
// import { getToday, getYesterday } from "@/lib/time";
// import { calculateHabitsXpSumsFromActions } from "@/lib/level";
// import { Session, JournalEntry } from "@/app/types/types";
// import { HabitActionUpdate } from "@app/types/mongodb";

// type HabitsXp = { [key: string]: number };

// export function useYesterdayJournalEntry() {
//   const [yesterdayEntry, setYesterdayEntry] = useState<JournalEntry | null>(
//     null
//   );
//   const [yesterdayEntryLoading, setYesterdayEntryLoading] = useState(false);
//   const [yesterdayEntryError, setYesterdayEntryError] = useState<string | null>(
//     null
//   );
//   const [yesterdayHighlights, setYesterdayHighlights] = useState<string[]>([]);
//   const [bonusWillpower, setBonusWillpower] = useState<number>(0);
//   const [habitsXp, setHabitsXp] = useState<HabitsXp>({});
//   const { data: session } = useSession() as { data: Session | null };

//   // Create refs to track both the update attempt and its completion
//   const updateAttemptedRef = useRef(false);
//   const updateInProgressRef = useRef(false);

//   const updateHabitXP = async (habits: { [key: string]: number }) => {
//     try {
//       const habitUpdates = Object.entries(habits);
//       const response = await fetch(
//         `/api/users/${session?.user.id}/habits/updateXp`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(habitUpdates),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update habits");
//       }
//     } catch (error) {
//       console.error("Error updating habits:", error);
//       throw error;
//     }
//   };

//   const updateHabitActions = async (habitActionUpdates: HabitActionUpdate) => {
//     try {
//       const response = await fetch(
//         `/api/users/${session?.user.id}/habits/updateActions`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(habitActionUpdates),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update habit actions");
//       }

//       const data = await response.json();
//       return data.habits;
//     } catch (error) {
//       console.error("Error updating habit actions:", error);
//       throw error;
//     }
//   };

//   const calculateBonusWillpower = (stringArray: string[]) => {
//     const totalEntries = stringArray.length;
//     const totalLength = stringArray.join("").length;
//     return Math.floor((totalEntries * 5 + totalLength) / 10);
//   };

//   useEffect(() => {
//     const getYesterdayEntry = async () => {
//       // If there's no session user ID or an update is in progress, return early
//       if (!session?.user.id || updateInProgressRef.current) return;

//       setYesterdayEntryError(null);
//       setYesterdayEntryLoading(true);

//       try {
//         // Set update in progress flag
//         updateInProgressRef.current = true;

//         const today = getToday();
//         const yesterday = getYesterday();

//         // Fetch yesterday's entry
//         const yesterdayEntryResponse = await fetch(
//           `/api/users/${session.user.id}/journal-entries/yesterday?today=${today}&yesterday=${yesterday}`
//         );

//         if (!yesterdayEntryResponse.ok) {
//           throw new Error(
//             `Error fetching yesterday's entry: ${yesterdayEntryResponse.status}`
//           );
//         }

//         const responseData = await yesterdayEntryResponse.json();
//         const entry = responseData?.yesterdaysJournalEntry || null;
//         setYesterdayEntry(entry);

//         const nightEntry = entry?.nightEntry || {
//           dailyHighlights: [],
//           actions: {},
//         };
//         const dailyWillpower = entry?.dailyWillpower || 0;

//         if (
//           Array.isArray(nightEntry.dailyHighlights) &&
//           nightEntry.dailyHighlights.length > 0
//         ) {
//           setYesterdayHighlights(nightEntry.dailyHighlights);
//           const extraBonus = Array.isArray(nightEntry.learnedToday)
//             ? calculateBonusWillpower(nightEntry.learnedToday)
//             : 0;
//           const calculatedBonus = calculateBonusWillpower(
//             nightEntry.dailyHighlights
//           );
//           setBonusWillpower(calculatedBonus + extraBonus);
//         } else {
//           setYesterdayHighlights([]);
//           setBonusWillpower(0);
//         }

//         let currentHabitsXp = {};
//         if (
//           nightEntry.actions &&
//           typeof nightEntry.actions === "object" &&
//           Object.keys(nightEntry.actions).length > 0
//         ) {
//           currentHabitsXp = calculateHabitsXpSumsFromActions(
//             nightEntry.actions,
//             dailyWillpower
//           );
//           setHabitsXp(currentHabitsXp);
//         }

//         // Only proceed with updates if they haven't been attempted yet
//         if (!updateAttemptedRef.current) {
//           const lastUpdateTimeResponse = await fetch(
//             `/api/users/${session.user.id}/last-updated`
//           );

//           if (!lastUpdateTimeResponse.ok) {
//             throw new Error("Failed to fetch last update time");
//           }

//           const lastUpdateTimeData = await lastUpdateTimeResponse.json();
//           const lastUpdateTime = lastUpdateTimeData.lastUpdateTime;
//           const todayDate = getToday().toISOString().split("T")[0];

//           if (!lastUpdateTime || lastUpdateTime !== todayDate) {
//             // Mark update as attempted before proceeding
//             updateAttemptedRef.current = true;

//             if (Object.keys(currentHabitsXp).length > 0) {
//               await updateHabitXP(currentHabitsXp);
//             }

//             if (
//               nightEntry.actions &&
//               Object.keys(nightEntry.actions).length > 0
//             ) {
//               await updateHabitActions(nightEntry.actions);
//             }

//             await fetch(`/api/users/${session.user.id}/last-updated`, {
//               method: "PATCH",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({ updateTime: todayDate }),
//             });
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch yesterday's journal entry", error);
//         setYesterdayEntryError("Failed to fetch yesterday's journal entry");
//       } finally {
//         setYesterdayEntryLoading(false);
//         // Reset the in-progress flag
//         updateInProgressRef.current = false;
//       }
//     };

//     getYesterdayEntry();
//   }, [session?.user.id]);

//   return {
//     yesterdayEntry,
//     yesterdayEntryLoading,
//     yesterdayEntryError,
//     yesterdayHighlights,
//     bonusWillpower,
//     habitsXp,
//   };
// }
