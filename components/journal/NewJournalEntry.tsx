"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { FaBoltLightning } from "react-icons/fa6";
import { Session } from "@/app/types/types";

interface JournalEntry {
  _id: string;
  nightEntry?: {
    dailyHighlights?: string[];
  };
}

const NewJournalEntry = () => {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [bonusWillpower, setBonusWillpower] = useState<number>(0);

  const date = new Date();
  const day = date.getDate();
  const dayOfWeek = date
    .toLocaleString("default", { weekday: "short" })
    .toUpperCase();

  useEffect(() => {
    const checkYesterdayEntry = async () => {
      if (session?.user?.id) {
        try {
          const yesterdayEntryResponse = await fetch(
            `/api/users/${session.user.id}/journal-entries/yesterday`
          );
          const yesterdayEntry: JournalEntry =
            await yesterdayEntryResponse.json();

          if (yesterdayEntry?.nightEntry?.dailyHighlights?.length) {
            const calculatedBonus = calculateBonusWillpower(
              yesterdayEntry.nightEntry.dailyHighlights
            );
            setBonusWillpower(calculatedBonus);
          }
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
        const todayEntryResponse = await fetch(
          `/api/users/${session?.user?.id}/journal-entries/today`
        );

        const todayEntry = await todayEntryResponse.json();

        if (todayEntry?._id) {
          router.push(`/update-journal-entry/${todayEntry._id}`);
        } else {
          console.error("Failed to find today's entry after creation");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="flex items-center">
          <div className="flex items-center">
            {"Generate Willpower to channel into your goals!"}
          </div>
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
};

export default NewJournalEntry;
