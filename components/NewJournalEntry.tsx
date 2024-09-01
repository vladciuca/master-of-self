"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Info } from "@components/ui/tipography";
import { FaBoltLightning } from "react-icons/fa6";

interface Session {
  user?: {
    id?: string | null;
  };
}

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
  const month = date.toLocaleString("default", { month: "short" });

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
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex mb-4">
          <div className="flex w-full justify-between">
            <div className="flex items-center">
              <div className="bg-primary text-primary-foreground h-16 w-16 rounded-sm flex flex-col justify-center items-center">
                <div className="uppercase text-base font-medium">{month}</div>
                <div className="text-4xl font-semibold">{day}</div>
              </div>
            </div>
            <div className="ml-6">
              <div className="flex items-center">
                <div className="flex items-center text-3xl">
                  <FaBoltLightning className="ml-2" />
                  {bonusWillpower > 0 ? (
                    <span className="text-green-500">+{bonusWillpower}</span>
                  ) : (
                    <span>0</span>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <Info text={"Willpower"} />
              </div>
            </div>
          </div>
        </CardTitle>

        <CardDescription>
          {"Generate Willpower to channel into your goals!"}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          size="sm"
          className="py-3"
          onClick={createJournalEntry}
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Start today's journal"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewJournalEntry;
