import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { JournalEntryHabits } from "@components/journal/JournalEntryHabits";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { FaBoltLightning } from "react-icons/fa6";
import { getToday, getTomorrow } from "@lib/time";
import { useYesterdayJournalEntry } from "@hooks/useYesterdayJournalEntry";
import { useTodayJournalEntry } from "@hooks/useTodayJournalEntry";
import { Session } from "@app/types/types";

export function NewJournalEntry() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { data: session } = useSession() as { data: Session | null };
  const router = useRouter();
  const {
    yesterdayEntryLoading,
    bonusWillpower = 0,
    habitXp = {},
  } = useYesterdayJournalEntry();
  const { todayEntry, todayEntryLoading } = useTodayJournalEntry();

  const date = new Date();
  const day = date.getDate();
  const dayOfWeek = date
    .toLocaleString("default", { weekday: "short" })
    .toUpperCase();

  const createJournalEntry = async () => {
    setSubmitting(false);

    try {
      setSubmitting(true);
      const today = getToday();
      const tomorrow = getTomorrow();

      const createNewEntryResponse = await fetch(
        `/api/journal-entry/new?today=${today}&tomorrow=${tomorrow}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session?.user.id,
            dailyWillpower: bonusWillpower,
            bonusWillpower: bonusWillpower,
          }),
        }
      );

      if (createNewEntryResponse.ok) {
        const newEntry = await createNewEntryResponse.json();

        if (Object.keys(habitXp).length > 0) {
          await updateHabitXP(habitXp);
        }

        if (newEntry?._id) {
          router.push(`/update-journal-entry/${newEntry._id}`);
        } else {
          console.error("Failed to create new entry: No _id returned");
        }
      } else {
        const errorData = await createNewEntryResponse.json();
        console.error("Failed to create new entry:", errorData.error);
      }
    } catch (error) {
      console.error("Error creating new entry:", error);
    }
  };

  const updateHabitXP = async (habits: { [key: string]: number }) => {
    try {
      const habitUpdates = Object.entries(habits);
      const response = await fetch(
        `/api/users/${session?.user.id}/habits/updateXp`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(habitUpdates),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update habits");
      }
    } catch (error) {
      console.error("Error updating habits:", error);
    }
  };

  const isEntryExisting = !!todayEntry;

  return (
    <Card className="p-4 mb-4">
      <div className="w-full">
        <div className="flex w-full justify-between">
          <div className="flex items-center">
            <div className="bg-muted text-foreground h-16 w-16 rounded-sm flex flex-col justify-center items-center">
              <div className="uppercase text-md font-semibold">{dayOfWeek}</div>
              <div className="text-3xl font-semibold">{day}</div>
            </div>
          </div>
          <div className="ml-6">
            <div className="flex items-center">
              <div className="w-full flex items-center justify-center text-3xl">
                {bonusWillpower > 0 ? (
                  <span className="text-green-500 font-bold">
                    +{bonusWillpower}
                  </span>
                ) : (
                  <span className="font-semibold">
                    {yesterdayEntryLoading ? "??" : 0}
                  </span>
                )}
                <FaBoltLightning className="ml-1 text-2xl" />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="text-xs mt-1 text-muted-foreground">
                {"Willpower"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full text-muted-foreground mt-4">
        <div className="flex items-center flex-col">
          <div className="flex items-center">
            {
              "Generate Willpower to channel into your goals through your habits!"
            }
          </div>
          {Object.keys(habitXp).length > 0 && (
            <div className="w-full text-muted-foreground my-4">
              {"Claim XP for yesterday's habits:"}
              <JournalEntryHabits habits={habitXp} />
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex mt-4">
        <Button
          size="sm"
          className="py-3"
          onClick={createJournalEntry}
          disabled={submitting || isEntryExisting || todayEntryLoading}
        >
          {submitting
            ? "Creating..."
            : isEntryExisting
            ? "Entry already exists"
            : "Start today's journal"}
        </Button>
      </div>
    </Card>
  );
}
