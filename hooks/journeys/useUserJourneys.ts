import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "@models/types";
import type { Journey } from "@models/mongodb";

export function useUserJourneys() {
  const { data: session } = useSession() as { data: Session | null };

  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [journeysLoading, setJourneysLoading] = useState(false);
  const [journeysError, setJourneysError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user.id) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    setJourneysError(null);
    setJourneysLoading(true);

    const getUserJourneys = async () => {
      try {
        const userJourneysResponse = await fetch(
          `/api/users/${session?.user.id}/journeys`,
          {
            signal,
          }
        );

        if (signal.aborted) return;

        if (!userJourneysResponse.ok) {
          throw new Error(
            `Error fetching journeys: ${userJourneysResponse.status}`
          );
        }

        const { journeys } = await userJourneysResponse.json();
        setJourneys(journeys.reverse());
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.warn("Fetch aborted");
          return;
        }

        console.error("Failed to fetch journeys", error);
        setJourneysError("Failed to fetch journeys");
      } finally {
        if (!signal.aborted) {
          setJourneysLoading(false);
        }
      }
    };

    getUserJourneys();

    return () => {
      abortController.abort();
    };
  }, [session?.user.id]);

  return {
    journeys,
    journeysLoading,
    journeysError,
  };
}
