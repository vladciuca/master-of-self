import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { getHabitActionDefaultValues } from "@lib/level";
import { Session, Habit, JournalEntryHabit } from "@models/types";

export function useUserHabits() {
  const { data: session } = useSession() as { data: Session | null };

  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitsLoading, setHabitsLoading] = useState(false);
  const [habitsError, setHabitsError] = useState<string | null>(null);

  // Memoize hasHabits - for consistency, though this is a very lightweight calculation
  const hasHabits = useMemo(() => habits.length > 0, [habits]);

  // Memoize defaultHabitActionValues
  const defaultHabitActionValues = useMemo<JournalEntryHabit>(() => {
    return hasHabits ? getHabitActionDefaultValues(habits) : {};
  }, [habits, hasHabits]);

  // Memoize defaultJournalEntryHabitActionValues
  const defaultJournalEntryHabitActionValues =
    useMemo<JournalEntryHabit>(() => {
      return hasHabits
        ? getHabitActionDefaultValues(habits, {
            includeCurrentXp: true,
          })
        : {};
    }, [habits, hasHabits]);

  useEffect(() => {
    if (!session?.user.id) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    setHabitsError(null);
    setHabitsLoading(true);

    const getUserHabits = async () => {
      try {
        const userHabitsResponse = await fetch(
          `/api/users/${session?.user.id}/habits`,
          {
            signal,
          }
        );

        const { habits } = await userHabitsResponse.json();
        setHabits(habits.reverse());
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.warn("Fetch aborted");
          return;
        }

        console.error("Failed to fetch habits", error);
        setHabitsError("Failed to fetch habits");
      } finally {
        if (!signal.aborted) {
          setHabitsLoading(false);
        }
      }
    };

    getUserHabits();

    return () => {
      abortController.abort();
    };
  }, [session?.user.id]);

  return {
    habits,
    hasHabits,
    defaultHabitActionValues,
    defaultJournalEntryHabitActionValues,
    habitsLoading,
    habitsError,
  };
}
