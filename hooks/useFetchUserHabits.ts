import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Session, Habit } from "@app/types/types";

export function useFetchUserHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitsLoading, setHabitsLoading] = useState(false);
  const [habitsError, setHabitsError] = useState<string | null>(null);
  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    const fetchHabits = async () => {
      setHabitsLoading(true);
      try {
        const response = await fetch(`/api/users/${session?.user.id}/habits`);
        const data = await response.json();

        setHabits(data.reverse());
      } catch (error) {
        console.error("Failed to fetch habits", error);

        setHabitsLoading(false);
        setHabitsError("Failed to fetch habits");
      } finally {
        setHabitsLoading(false);
        setHabitsError(null);
      }
    };

    if (session?.user.id) {
      fetchHabits();
    }
  }, [session]);

  const hasHabits = habits?.length > 0;

  return {
    habits,
    hasHabits,
    habitsLoading,
    habitsError,
  };
}
