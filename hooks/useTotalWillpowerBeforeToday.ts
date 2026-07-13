import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getToday } from "@lib/time";
import { User } from "@models/types";

export function useTotalWillpowerBeforeToday(userId?: string) {
  const [totalWillpowerBeforeToday, setTotalWillpowerBeforeToday] = useState(0);
  const [
    totalWillpowerBeforeTodayLoading,
    setTotalWillpowerBeforeTodayLoading,
  ] = useState(false);
  const [totalWillpowerBeforeTodayError, setTotalWillpowerBeforeTodayError] =
    useState<string | null>(null);
  const { user } = useUser() as { user: User | null };

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (!targetUserId) {
      setTotalWillpowerBeforeTodayLoading(false);
      return;
    }

    const fetchCurrentWillpower = async () => {
      setTotalWillpowerBeforeTodayError(null);
      setTotalWillpowerBeforeTodayLoading(true);

      try {
        const today = getToday();

        const response = await fetch(
          `/api/users/${targetUserId}/total-willpower-before-today?today=${today}`
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

    if (user?.id) {
      fetchCurrentWillpower();
    }
  }, [user?.id]);

  return {
    totalWillpowerBeforeToday,
    totalWillpowerBeforeTodayLoading,
    totalWillpowerBeforeTodayError,
  };
}
