import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Session } from "@models/types";

export function useTotalWillpower() {
  const [totalWillpower, setTotalWillpower] = useState(0);
  const [totalWillpowerLoading, setTotalWillpowerLoading] = useState(false);
  const [totalWillpowerError, setTotalWillpowerError] = useState<string | null>(
    null
  );
  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    const fetchTotalWillpower = async () => {
      setTotalWillpowerError(null);
      setTotalWillpowerLoading(true);

      try {
        const response = await fetch(
          `/api/users/${session?.user?.id}/total-willpower`
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

    if (session?.user.id) {
      fetchTotalWillpower();
    }
  }, [session]);

  return { totalWillpower, totalWillpowerLoading, totalWillpowerError };
}
