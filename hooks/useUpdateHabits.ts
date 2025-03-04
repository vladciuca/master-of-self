import { useState } from "react";
import { useSession } from "next-auth/react";
import { HabitActionUpdate, HabitUpdate } from "@models/mongodb";
import { Session } from "@models/types";

type UpdateHabitsProps = {
  habitsXpUpdates: { [key: string]: number };
  habitActionsUpdates: HabitActionUpdate;
  updateDate: string;
};

// updases habit xp
export function useUpdateHabits() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession() as { data: Session | null };

  const updateHabits = async ({
    habitsXpUpdates,
    habitActionsUpdates,
    updateDate,
  }: UpdateHabitsProps) => {
    if (!session?.user.id)
      return { status: "error", message: "User not authenticated" };

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        userId: session.user.id,
        habitXpUpdates: Object.entries(habitsXpUpdates) as HabitUpdate[],
        habitActionsUpdates: habitActionsUpdates,
        updateDate: updateDate,
      };

      const response = await fetch(
        `/api/users/${session.user.id}/habits/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update habits");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating habits:", error);
      setError("Failed to update habit XP");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateHabits, isLoading, error };
}
