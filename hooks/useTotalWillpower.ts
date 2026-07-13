import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { User } from "@models/types";

export function useTotalWillpower() {
  const [totalWillpower, setTotalWillpower] = useState(0);
  const [totalWillpowerLoading, setTotalWillpowerLoading] = useState(false);
  const [totalWillpowerError, setTotalWillpowerError] = useState<string | null>(
    null
  );
  const { user } = useUser() as { user: User | null };

  useEffect(() => {
    const fetchTotalWillpower = async () => {
      setTotalWillpowerError(null);
      setTotalWillpowerLoading(true);

      try {
        const response = await fetch(
          `/api/users/${user?.id}/total-willpower`
        );
        const { totalWillpower } = await response.json();

        if (!totalWillpower) return;
        setTotalWillpower(totalWillpower);
      } catch (error) {
        console.error("Failed to fetch total willpower", error);
        setTotalWillpowerError("Failed to fetch total willpower");
      } finally {
        setTotalWillpowerLoading(false);
      }
    };

    if (user?.id) {
      fetchTotalWillpower();
    }
  }, [user?.id]);

  return { totalWillpower, totalWillpowerLoading, totalWillpowerError };
}
