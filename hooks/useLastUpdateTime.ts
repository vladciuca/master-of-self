import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Session } from "@models/types";

export function useLastUpdateTime() {
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession() as { data: Session | null };

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

  return {
    lastUpdateTime,
    isLoading,
    error,
    fetchLastUpdateTime,
  };
}
