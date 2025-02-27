import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getToday } from "@lib/time";
import { Session } from "@models/types";

export function useTotalWillpowerBeforeToday() {
  const [totalWillpowerBeforeToday, setTotalWillpowerBeforeToday] = useState(0);
  const [
    totalWillpowerBeforeTodayLoading,
    setTotalWillpowerBeforeTodayLoading,
  ] = useState(false);
  const [totalWillpowerBeforeTodayError, setTotalWillpowerBeforeTodayError] =
    useState<string | null>(null);
  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    const fetchCurrentWillpower = async () => {
      setTotalWillpowerBeforeTodayError(null);
      setTotalWillpowerBeforeTodayLoading(true);

      try {
        const today = getToday();

        const response = await fetch(
          `/api/users/${session?.user?.id}/total-willpower-before-today?today=${today}`
        );
        const { totalWillpowerBeforeToday } = await response.json();

        if (!totalWillpowerBeforeToday) return;
        setTotalWillpowerBeforeToday(totalWillpowerBeforeToday);
      } catch (error) {
        console.error("Failed to fetch total willpower before today", error);
        setTotalWillpowerBeforeTodayError(
          "Failed to fetch total willpower before today"
        );
      } finally {
        setTotalWillpowerBeforeTodayLoading(false);
      }
    };

    if (session?.user.id) {
      fetchCurrentWillpower();
    }
  }, [session]);

  return {
    totalWillpowerBeforeToday,
    totalWillpowerBeforeTodayLoading,
    totalWillpowerBeforeTodayError,
  };
}
