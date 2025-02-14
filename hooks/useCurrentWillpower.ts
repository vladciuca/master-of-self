import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getToday } from "@lib/time";
import { Session } from "@models/types";

export function useCurrentWillpower() {
  const [currentWillpower, setCurrentWillpower] = useState(0);
  const [currentWillpowerLoading, setCurrentWillpowerLoading] = useState(false);
  const [currentWillpowerError, setCurrentWillpowerError] = useState<
    string | null
  >(null);
  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    const fetchCurrentWillpower = async () => {
      setCurrentWillpowerError(null);
      setCurrentWillpowerLoading(true);

      try {
        const today = getToday();

        const response = await fetch(
          `/api/users/${session?.user?.id}/current-willpower?today=${today}`
        );
        const { currentWillpower } = await response.json();

        if (!currentWillpower) return;
        setCurrentWillpower(currentWillpower);
      } catch (error) {
        console.error("Failed to fetch current willpower", error);
        setCurrentWillpowerError("Failed to fetch current willpower");
      } finally {
        setCurrentWillpowerLoading(false);
      }
    };

    if (session?.user.id) {
      fetchCurrentWillpower();
    }
  }, [session]);

  return { currentWillpower, currentWillpowerLoading, currentWillpowerError };
}
