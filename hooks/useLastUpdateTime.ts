// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useYesterdayJournalEntry } from "./useYesterdayJournalEntry";
// import { useUpdateHabits } from "./useUpdateHabits";
// import { Session } from "@/app/types/types";
// import { getToday } from "@lib/time";

// export function useLastUpdateTime() {
//   const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { data: session } = useSession() as { data: Session | null };
//   const { yesterdayEntry, yesterdayEntryLoading, habitsXp } =
//     useYesterdayJournalEntry();
//   const { updateHabits } = useUpdateHabits();

//   const fetchLastUpdateTime = async () => {
//     if (!session?.user.id) return;

//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(
//         `/api/users/${session.user.id}/last-updated`
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch last update time");
//       }

//       const data = await response.json();
//       setLastUpdateTime(data.lastUpdateTime);
//     } catch (error) {
//       console.error("Failed to fetch lastUpdateTime", error);
//       setError("Failed to fetch last update time");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // const updateLastUpdateTime = async (newUpdateTime: string) => {
//   //   if (!session?.user.id) return;

//   //   setIsLoading(true);
//   //   setError(null);

//   //   try {
//   //     const response = await fetch(
//   //       `/api/users/${session.user.id}/last-updated`,
//   //       {
//   //         method: "PATCH",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({ updateTime: newUpdateTime }),
//   //       }
//   //     );

//   //     if (!response.ok) {
//   //       throw new Error("Failed to update last update time");
//   //     }

//   //     setLastUpdateTime(newUpdateTime);
//   //   } catch (error) {
//   //     console.error("Failed to update lastUpdateTime", error);
//   //     setError("Failed to update last update time");
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   useEffect(() => {
//     fetchLastUpdateTime();
//   }, [session?.user.id]);

//   useEffect(() => {
//     const todayDate = getToday().toISOString().split("T")[0];

//     console.log("======================todayDate", todayDate);
//     console.log("======================lastUpdateTime", lastUpdateTime);

//     if ((isLoading || yesterdayEntryLoading) && lastUpdateTime !== todayDate)
//       return;

//     if (
//       Object.keys(habitsXp).length > 0 &&
//       yesterdayEntry?.nightEntry?.actions &&
//       Object.keys(yesterdayEntry?.nightEntry?.actions).length > 0
//     ) {
//       updateHabits({
//         habitsXpUpdates: habitsXp,
//         habitActionsUpdates: yesterdayEntry?.nightEntry?.actions,
//       });
//     }
//   }, [lastUpdateTime]);

//   return {
//     lastUpdateTime,
//     isLoading,
//     error,
//     fetchLastUpdateTime,
//     // updateLastUpdateTime,
//   };
// }
import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useUpdateHabits } from "./useUpdateHabits";
import { Session } from "@/app/types/types";
import { HabitActionUpdate } from "@app/types/mongodb";
import { getToday } from "@lib/time";

export function useLastUpdateTime() {
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession() as { data: Session | null };
  const { updateHabits } = useUpdateHabits();

  const fetchLastUpdateTime = useCallback(async () => {
    if (!session?.user.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/users/${session.user.id}/last-updated`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch last update time");
      }

      const data = await response.json();
      setLastUpdateTime(data.lastUpdateTime);
    } catch (error) {
      console.error("Failed to fetch lastUpdateTime", error);
      setError("Failed to fetch last update time");
    } finally {
      setIsLoading(false);
    }
  }, [session?.user.id]);

  const updateHabitsIfNeeded = useCallback(
    async (
      habitsXp: { [key: string]: number },
      habitActions: HabitActionUpdate
    ) => {
      if (!session?.user.id) return;

      const todayDate = getToday().toISOString().split("T")[0];

      if (lastUpdateTime === todayDate) {
        console.log("Habits already updated today");
        return;
      }

      try {
        const result = await updateHabits({
          habitsXpUpdates: habitsXp,
          habitActionsUpdates: habitActions,
          updateDate: todayDate,
        });

        if (result.status === "success") {
          setLastUpdateTime(todayDate);
        }
      } catch (error) {
        console.error("Failed to update habits:", error);
        setError("Failed to update habits");
      }
    },
    [session?.user.id, lastUpdateTime, updateHabits]
  );

  return {
    lastUpdateTime,
    isLoading,
    error,
    fetchLastUpdateTime,
    updateHabitsIfNeeded,
  };
}
