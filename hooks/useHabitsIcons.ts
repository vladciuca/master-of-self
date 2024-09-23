import { useState, useEffect, useCallback } from "react";

type HabitsIcons = {
  icon: string;
  xp: number;
};

export function useHabitsIcons(initialHabits: { [key: string]: number }) {
  const [journalHabits, setJournalHabits] = useState(initialHabits);
  const [habitData, setHabitData] = useState<{
    [key: string]: HabitsIcons;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterHabitData = useCallback(
    (
      habits: { [key: string]: number },
      data: { [key: string]: HabitsIcons }
    ) => {
      return Object.fromEntries(
        Object.entries(habits).filter(([key]) => key in data)
      );
    },
    []
  );

  const fetchHabitData = useCallback(async () => {
    const habitIds = Object.keys(initialHabits);
    if (habitIds.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/habit/icons?ids=${habitIds.join(",")}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch habit data");
      }
      const data: { [key: string]: HabitsIcons } = await response.json();
      const filteredJournalHabits = filterHabitData(initialHabits, data);

      setHabitData(data);
      setJournalHabits(filteredJournalHabits);
    } catch (error) {
      console.error("Failed to fetch habit data:", error);
      setError("Failed to fetch habit data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [initialHabits, filterHabitData]);

  useEffect(() => {
    fetchHabitData();
  }, [fetchHabitData]);

  return { journalHabits, habitData, isLoading, error };
}
