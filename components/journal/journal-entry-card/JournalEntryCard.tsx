import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { JournalEntryIndicators } from "@/components/journal/journal-entry-card/JournalEntryIndicators";
import { JournalEntryHabits } from "@/components/journal/journal-entry-card/JournalEntryHabits";
import { JournalEntrySection } from "@/components/journal/journal-entry-card/JournalEntrySection";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaBoltLightning } from "react-icons/fa6";
import { Shell } from "lucide-react";
import { calculateHabitsXpFromEntry } from "@/lib/level";
import { JOURNAL_COLORS } from "@lib/colors";
import { Session, JournalEntryMetadata } from "@models/types";

type JournalEntryCardProps = {
  journalEntry: JournalEntryMetadata;
  isEveningTime: boolean;
  // handleDelete: (journalEntry: JournalEntryMetadata) => Promise<void>;
};

export function JournalEntryCard({
  journalEntry,
  isEveningTime,
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

  const completedDailyToDos = () => {
    const dailyToDos = dayEntry?.greatToday || [];
    const completedToDos = nightEntry?.howGreatToday || [];

    return completedToDos.filter((item) => dailyToDos.includes(item));
  };

  const uncompletedDailyToDos = () => {
    const dailyToDos = dayEntry?.greatToday || [];
    const completedToDos = new Set(nightEntry?.howGreatToday);

    return dailyToDos.filter((item) => !completedToDos.has(item));
  };

  const dayEntries =
    (dayEntry?.gratefulFor?.length || 0) + (dayEntry?.greatToday?.length || 0);

  const nightEntries =
    (nightEntry?.dailyHighlights?.length || 0) +
    (nightEntry?.learnedToday?.length || 0);

  const hasContent =
    (dayEntry?.gratefulFor?.length ?? 0) > 0 ||
    uncompletedDailyToDos().length > 0 ||
    completedDailyToDos().length > 0 ||
    (nightEntry?.dailyHighlights?.length ?? 0) > 0 ||
    (nightEntry?.learnedToday?.length ?? 0) > 0;

  return (
    <AccordionItem key={_id} value={_id} className="p-4">
      <AccordionTrigger className="p-0 block">
        <div className="w-full">
          <div className="flex w-full justify-between">
            <div className="flex items-center">
              <div className="bg-muted h-16 w-16 rounded-sm flex flex-col justify-center items-center">
                <div className="uppercase text-md font-semibold">
                  {dayOfWeek}
                </div>
                <div className="text-3xl font-semibold">{day}</div>
              </div>

              <JournalEntryIndicators
                dayEntries={dayEntries}
                completedDailyToDos={completedDailyToDos().length}
                nightEntries={nightEntries}
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

        {bonusWillpower > 0 && (
          <div className="w-full text-muted-foreground mt-4">
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
        )}

        {/* Habit Actions */}
        <div className="flex-grow flex flex-col items-start">
          {/* check for 0 values too to display this*/}
          {habits &&
            Object.values(habits).some((habitActions) =>
              Object.entries(habitActions)
                .filter(([key, value]) => key !== "currentXp")
                .some(([_, value]) => value !== 0)
            ) && (
              <div className="mt-2 flex w-full">
                <div className="flex-shrink-0 flex items-start mr-4">
                  <h2 className="flex items-center text-muted-foreground mt-1">
                    <Shell
                      className="mr-2 text-muted-foreground"
                      size={"1rem"}
                    />
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
        </div>

        {isToday && (
          <div className="w-full flex mt-2">
            {session?.user?.id === creatorId && pathName === "/journal" && (
              <div className="my-4">
                <Link
                  className="mr-3 mt-1 bg-primary text-primary-foreground text-sm rounded-md py-2 px-4"
                  href={`/update-journal-entry/${_id}`}
                >
                  Continue today's journal
                </Link>
                {/* <div
                  onClick={() => handleDelete(journalEntry)}
                >
                  Delete(TEST)
                </div> */}
              </div>
            )}
          </div>
        )}
      </AccordionTrigger>
      <AccordionContent className="p-0 space-y-4">
        <hr className="mt-4" />

        {!hasContent && (
          <p className="mt-4 w-full text-center">
            No journal entries{" "}
            {isToday
              ? `for today yet. You still have time to fill out your ${
                  isEveningTime ? "evening" : "morning"
                } routine`
              : "for this date"}
            .
          </p>
        )}

        {dayEntry?.gratefulFor && dayEntry?.gratefulFor.length > 0 && (
          <JournalEntrySection
            title="What I am grateful for today..."
            items={dayEntry?.gratefulFor}
            stepType="gratitude"
          />
        )}

        {uncompletedDailyToDos().length > 0 && (
          <JournalEntrySection
            title={"What will make today great..."}
            items={uncompletedDailyToDos()}
            stepType="day"
          />
        )}

        {completedDailyToDos().length > 0 && (
          <JournalEntrySection
            title={"What made today great..."}
            items={completedDailyToDos()}
            stepType="night"
          />
        )}

        {nightEntry?.dailyHighlights &&
          nightEntry?.dailyHighlights.length > 0 && (
            <JournalEntrySection
              title="Today's highlights..."
              items={nightEntry?.dailyHighlights}
              stepType="highlights"
            />
          )}

        {nightEntry?.learnedToday && nightEntry?.learnedToday.length > 0 && (
          <JournalEntrySection
            title="What have I learned today..."
            items={nightEntry?.learnedToday}
            stepType="reflection"
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
