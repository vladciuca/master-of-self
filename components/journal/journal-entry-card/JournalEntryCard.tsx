import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { JournalEntryIndicators } from "@/components/journal/journal-entry-card/JournalEntryIndicators";
import { JournalEntryHabits } from "@/components/journal/journal-entry-card/JournalEntryHabits";
import { JournalEntryDisciplineSection } from "./JournalEntryDisciplineSection";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { FaBoltLightning } from "react-icons/fa6";
import { Shell } from "lucide-react";
import { calculateHabitsXpFromEntry } from "@/lib/level";
// import { JOURNAL_COLORS } from "@lib/colors";
import { Session, JournalEntryMetadata } from "@models/types";

type JournalEntryCardProps = {
  journalEntry: JournalEntryMetadata;
  // handleDelete: (journalEntry: JournalEntryMetadata) => Promise<void>;
};

export function JournalEntryCard({
  journalEntry,
}: // handleDelete,
JournalEntryCardProps) {
  const { data: session } = useSession() as { data: Session | null };
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
    <Card className="p-4 mb-4 space-y-4">
      <div className="w-full">
        <div className="flex w-full justify-between">
          <div className="flex items-top">
            <div className="bg-muted h-16 w-16 rounded-sm flex flex-col justify-center items-center">
              <div className="uppercase text-md font-semibold">{dayOfWeek}</div>
              <div className="text-3xl font-semibold">{day}</div>
            </div>

            <JournalEntryIndicators
              dayEntry={dayEntry ?? {}}
              nightEntry={nightEntry ?? {}}
            />
          </div>

          <div className="ml-6 flex flex-col justify-center">
            <div className="flex items-center">
              <div className="w-full flex items-center justify-center text-3xl font-bold">
                {totalWillpower}
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

      {isToday && (
        <div className="w-full flex">
          {session?.user?.id === creatorId && pathName === "/journal" && (
            <div className="w-full">
              <Link href={`/update-journal-entry/${_id}`}>
                <Button size="sm" className="w-full rounded-md">
                  Continue today's journaling session...
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* {bonusWillpower > 0 && (
        <div className="w-full text-muted-foreground">
          <div className="flex items-center">
            <div className="flex items-center">
              Willpower Bonus:
              <span className={`ml-1 text-${JOURNAL_COLORS.night}`}>
                +{bonusWillpower}
              </span>
              <span className="text-primary text-xs">
                <FaBoltLightning className="ml-1" />
              </span>
            </div>
          </div>
        </div>
      )} */}

      {/* Habit Actions */}
      {habits &&
        Object.values(habits).some((habitActions) =>
          Object.entries(habitActions)
            .filter(([key, value]) => key !== "currentXp")
            .some(([_, value]) => value !== 0)
        ) && (
          <div className="flex w-full">
            <div className="flex-shrink-0 flex items-start mr-4">
              <h2 className="flex items-center text-muted-foreground mt-1">
                <Shell className="mr-2 text-muted-foreground" size={"1rem"} />
                Habits:
              </h2>
            </div>
            <div className="flex-grow flex flex-wrap items-start">
              <JournalEntryHabits
                habitsXp={habitsXpFromActions}
                habits={habits}
              />
            </div>
          </div>
        )}

      {(Object.keys(dayEntry ?? {}).length > 0 ||
        Object.keys(nightEntry ?? {}).length > 0) && (
        <JournalEntryDisciplineSection
          dayEntry={dayEntry ?? {}}
          nightEntry={nightEntry ?? {}}
        />
      )}
    </Card>
  );
}
