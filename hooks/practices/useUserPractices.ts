import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import type { User } from "@models/types";
import type { Practice } from "@models/mongodb";

export function useUserPractices() {
  const { user } = useUser() as { user: User | null };

  const [practices, setPractices] = useState<Practice[]>([]);
  const [practicesLoading, setPracticesLoading] = useState(false);
  const [practicesError, setPracticesError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    setPracticesError(null);
    setPracticesLoading(true);

    const getUserPractices = async () => {
      try {
        const userHabitsResponse = await fetch(
          `/api/users/${user.id}/practices`,
          {
            signal,
          }
        );

        if (signal.aborted) return;

        if (!userHabitsResponse.ok) {
          throw new Error(
            `Error fetching practices: ${userHabitsResponse.status}`
          );
        }

        const { practices } = await userHabitsResponse.json();
        setPractices(practices.reverse());
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.warn("Fetch aborted");
          return;
        }

        console.error("Failed to fetch practices", error);
        setPracticesError("Failed to fetch practices");
      } finally {
        if (!signal.aborted) {
          setPracticesLoading(false);
        }
      }
    };

    getUserPractices();

    return () => {
      abortController.abort();
    };
  }, [user?.id]);

  return {
    practices,
    practicesLoading,
    practicesError,
  };
}
