import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Session, Habit } from "@models/types";

export function useUserHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitsLoading, setHabitsLoading] = useState(false);
  const [habitsError, setHabitsError] = useState<string | null>(null);
  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    const fetchHabits = async () => {
      setHabitsError(null);
      setHabitsLoading(true);

      try {
        const response = await fetch(`/api/users/${session?.user.id}/habits`);
        const { habits } = await response.json();
        setHabits(habits.reverse());
      } catch (error) {
        console.error("Failed to fetch habits", error);

        setHabitsLoading(false);
        setHabitsError("Failed to fetch habits");
      } finally {
        setHabitsLoading(false);
      }
    };

    if (session?.user.id) {
      fetchHabits();
    }
  }, [session]);

  const hasHabits = habits.length > 0;

  return {
    habits,
    hasHabits,
    habitsLoading,
    habitsError,
  };
}
