import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "@models/types";
import type { Discipline } from "@models/mongodb";

export function useUserDisciplines() {
  const { data: session } = useSession() as { data: Session | null };

  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [disciplinesLoading, setDisciplinesLoading] = useState(false);
  const [disciplinesError, setDisciplinesError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user.id) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    setDisciplinesError(null);
    setDisciplinesLoading(true);

    const getUserDisciplines = async () => {
      try {
        const userHabitsResponse = await fetch(
          `/api/users/${session?.user.id}/disciplines`,
          {
            signal,
          }
        );

        if (signal.aborted) return;

        if (!userHabitsResponse.ok) {
          throw new Error(
            `Error fetching disciplines: ${userHabitsResponse.status}`
          );
        }

        const { disciplines } = await userHabitsResponse.json();
        setDisciplines(disciplines.reverse());
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.warn("Fetch aborted");
          return;
        }

        console.error("Failed to fetch disciplines", error);
        setDisciplinesError("Failed to fetch disciplines");
      } finally {
        if (!signal.aborted) {
          setDisciplinesLoading(false);
        }
      }
    };

    getUserDisciplines();

    return () => {
      abortController.abort();
    };
  }, [session?.user.id]);

  return {
    disciplines,
    disciplinesLoading,
    disciplinesError,
  };
}
