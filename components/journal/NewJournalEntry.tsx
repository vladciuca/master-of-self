"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { JournalEntryHabits } from "@components/journal/JournalEntryHabits";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { FaBoltLightning } from "react-icons/fa6";
import { Session } from "@app/types/types";

// could find a better way of doing this(added XP over highlights)
type JournalEntryHighlights = {
  _id: string;
  nightEntry?: {
    dailyHighlights?: string[];
    habits?: { [key: string]: number };
  };
};

export function NewJournalEntry() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [bonusWillpower, setBonusWillpower] = useState<number>(0);
  const [habitXp, setHabitXp] = useState<{ [key: string]: number }>({});
  const { data: session } = useSession() as { data: Session | null };
  const router = useRouter();

  const date = new Date();
  const day = date.getDate();
  const dayOfWeek = date
    .toLocaleString("default", { weekday: "short" })
    .toUpperCase();

  useEffect(() => {
    const checkYesterdayEntry = async () => {
      if (session?.user?.id) {
        try {
          // const today = new Date();
          // const localDate = today.toISOString().split("T")[0];
          // ?date=${localDate}

          const yesterdayEntryResponse = await fetch(
            `/api/users/${session.user.id}/journal-entries/yesterday`
          );
          // Check if the response is OK (status code 200-299)
          if (!yesterdayEntryResponse.ok) {
            // Handle error response (e.g., log the status and message)
            const errorText = await yesterdayEntryResponse.text();
            console.error(
              `Error fetching yesterday's entry: ${yesterdayEntryResponse.status} - ${errorText}`
            );
            return;
          }

          const yesterdayEntry = await yesterdayEntryResponse.json();

          if (yesterdayEntry?.nightEntry?.dailyHighlights?.length) {
            const calculatedBonus = calculateBonusWillpower(
              yesterdayEntry.nightEntry.dailyHighlights
            );
            setBonusWillpower(calculatedBonus);
          }

          // Handle habit XP updates
          if (yesterdayEntry?.nightEntry?.habits) {
            setHabitXp(yesterdayEntry.nightEntry.habits);
          }
          // const yesterdayEntry: JournalEntryHighlights =
          //   await yesterdayEntryResponse.json();

          // if (yesterdayEntry?.nightEntry?.dailyHighlights?.length) {
          //   const calculatedBonus = calculateBonusWillpower(
          //     yesterdayEntry.nightEntry.dailyHighlights
          //   );
          //   setBonusWillpower(calculatedBonus);
          // }

          // // Handle habit XP updates
          // if (yesterdayEntry?.nightEntry?.habits) {
          //   setHabitXp(yesterdayEntry?.nightEntry?.habits);
          // }
        } catch (error) {
          console.error("Failed to fetch yesterday's entry:", error);
        }
      }
    };

    checkYesterdayEntry();
  }, [session]);

  const calculateBonusWillpower = (highlights: string[]) => {
    const totalEntries = highlights.length;
    const totalLength = highlights.join("").length;
    return Math.floor((totalEntries * 5 + totalLength) / 10);
  };

  const createJournalEntry = async () => {
    setSubmitting(true);

    try {
      const createNewEntryResponse = await fetch("/api/journal-entry/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user?.id,
          // if dailyWillpower is not set initially to bonusWillpower when the form is created the bonus will power will not be granted, it then resets when the score recalculates
          dailyWillpower: bonusWillpower,
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

      // const updatedHabits = await response.json();
      // console.log("Updated habits:", updatedHabits);
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
