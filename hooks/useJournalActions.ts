import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Session } from "@app/types/types";
import { HabitActionUpdate } from "@app/types/mongodb";

export function useJournalActions() {
  const [actions, setActions] = useState<HabitActionUpdate>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession() as { data: Session | null };

  // Fetch actions from the API
  const fetchActions = useCallback(async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/users/${session.user.id}/journal-actions`
      );
      if (!response.ok) throw new Error("Failed to fetch actions");
      const data = await response.json();
      setActions(data.actions);
    } catch (err) {
      setError("Failed to fetch actions");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  // Update actions in the API
  const updateActions = useCallback(
    async (newActions: HabitActionUpdate) => {
      if (!session?.user?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/users/${session.user.id}/journal-actions`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ actions: newActions }),
          }
        );
        if (!response.ok) throw new Error("Failed to update actions");
        setActions(newActions);
      } catch (err) {
        setError("Failed to update actions");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user?.id]
  );

  // Fetch actions on component mount
  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  return { actions, isLoading, error, updateActions };
}
