import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { JournalEntryIndicators } from "@/components/journal/journal-entry-card/JournalEntryIndicators";
import { JournalEntryHabits } from "@/components/journal/journal-entry-card/JournalEntryHabits";
import { JournalEntryPracticeSection } from "./JournalEntryPracticeSection";
import { Card } from "@components/ui/card";
import { FaBoltLightning } from "react-icons/fa6";
import { calculateHabitsXpFromEntry } from "@/lib/level";
import { hasEntryContent } from "@lib/journal";
import { JournalEntryMetadata } from "@models/types";

import { JournalEntryActionButton } from "../JournalEntryActionButton";

type JournalEntryCardProps = {
  journalEntry: JournalEntryMetadata;
};

export function JournalEntryCard({
  journalEntry,
}: JournalEntryCardProps) {
  const { user } = useUser();
  const pathName = usePathname();

  const {
    _id,
    creatorId,
    createDate,
    dailyWillpower,
    bonusWillpower,
    dayEntry,
    nightEntry,
    habits,
  } = journalEntry;

  const totalWillpower = dailyWillpower + bonusWillpower;

  const entryDate = new Date(createDate);
  const currentDate = new Date();
  const isToday =
    entryDate.toLocaleDateString() === currentDate.toLocaleDateString();
  const day = entryDate.getDate();
  const dayOfWeek = entryDate
    .toLocaleString("default", { weekday: "short" })
    .toUpperCase();

  const habitsXpFromActions = habits
    ? calculateHabitsXpFromEntry({
        entryHabits: habits,
        entryWillpower: totalWillpower,
      })
    : {};

  return (
    <Card className="p-4 mb-4 space-y-4 border-none bg-muted/30">
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            <div className="bg-muted h-16 w-16 rounded-sm flex flex-col justify-center items-center flex-shrink-0">
              <div className="uppercase text-md font-semibold">{dayOfWeek}</div>
              <div className="text-3xl font-semibold">{day}</div>
            </div>

            <JournalEntryIndicators
              dayEntry={dayEntry ?? {}}
              nightEntry={nightEntry ?? {}}
            />
          </div>

          <div className="ml-6 flex items-center flex-shrink-0">
            <div className="w-full flex items-center justify-center text-3xl font-bold">
              {totalWillpower}
              <FaBoltLightning className="ml-1 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {isToday && (
        <div className="w-full flex">
          {user?.id === creatorId && pathName === "/journal" && (
            <div className="w-full">
              <Link href={`/update-journal-entry/${_id}`}>
                <JournalEntryActionButton journalEntry={journalEntry} />
              </Link>
            </div>
          )}
        </div>
      )}

      {habits &&
        Object.values(habits).some((habitActions) =>
          Object.entries(habitActions)
            .filter(([key, value]) => key !== "currentXp")
            .some(([_, value]) => value !== 0)
        ) && (
          <div className="flex w-full">
            <div className="flex-grow flex flex-wrap items-start">
              <JournalEntryHabits
                habitsXp={habitsXpFromActions}
                habits={habits}
              />
            </div>
          </div>
        )}

      {(hasEntryContent(dayEntry) || hasEntryContent(nightEntry)) && (
        <JournalEntryPracticeSection
          dayEntry={dayEntry ?? {}}
          nightEntry={nightEntry ?? {}}
        />
      )}
    </Card>
  );
}
