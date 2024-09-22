"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { JournalEntryHabits } from "@components/journal/JournalEntryHabits";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { FaBoltLightning } from "react-icons/fa6";
import { useFetchYesterdayJournalEntry } from "@hooks/useFetchYesterdayJournalEntry";
import { Session } from "@app/types/types";

export function NewJournalEntry() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { data: session } = useSession() as { data: Session | null };
  const router = useRouter();
  const { bonusWillpower, habitXp } = useFetchYesterdayJournalEntry();

  const date = new Date();
  const day = date.getDate();
  const dayOfWeek = date
    .toLocaleString("default", { weekday: "short" })
    .toUpperCase();

  const createJournalEntry = async () => {
    setSubmitting(true);

    try {
      const createNewEntryResponse = await fetch("/api/journal-entry/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user?.id,
          dailyWillpower: bonusWillpower, // add bonus Willpower to dailyWillpower
          bonusWillpower: bonusWillpower,
        }),
      });

      if (createNewEntryResponse.ok) {
        if (Object.keys(habitXp).length > 0) {
          await updateHabitXP(habitXp);
        }

        const todayEntryResponse = await fetch(
          `/api/users/${session?.user?.id}/journal-entries/today`
        );

        const todayEntry = await todayEntryResponse.json();

        if (todayEntry?._id) {
          router.push(`/update-journal-entry/${todayEntry._id}`);
        } else {
          setSubmitting(false);
          console.error("Failed to find today's entry after creation");
        }
      } else {
        console.error("Failed to create new entry");
        setSubmitting(false); // Reset submitting state if there's an error
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateHabitXP = async (habits: { [key: string]: number }) => {
    try {
      // TURN THEM INTO AN ARRAY BEFORE PASSING THEM TO UPDATE ROUTE FOR BULK
      // !!! can move this in mongo/habits.ts update function and just send an object from here
      // THIS WILL BE MOVED IN A SCHEDULED NEXTJS CALL
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

  useEffect(() => {
    return () => {
      setSubmitting(false);
    };
  }, []);

  return (
    <Card className="p-4 mb-4">
      <div className="w-full">
        <div className="flex w-full justify-between">
          <div className="flex items-center">
            <div className="bg-primary text-primary-foreground h-16 w-16 rounded-sm flex flex-col justify-center items-center">
              <div className="uppercase text-base font-semibold">
                {dayOfWeek}
              </div>
              <div className="text-4xl font-bold">{day}</div>
            </div>
          </div>
          <div className="ml-6">
            <div className="flex items-center">
              <div className="w-full flex items-center justify-center text-3xl">
                {bonusWillpower > 0 ? (
                  <span className="text-green-500 font-semibold">
                    +{bonusWillpower}
                  </span>
                ) : (
                  <span>0</span>
                )}
                <FaBoltLightning className="ml-2" />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="text-sm mt-2 text-muted-foreground">
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
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Start today's journal"}
        </Button>
      </div>
    </Card>
  );
}
