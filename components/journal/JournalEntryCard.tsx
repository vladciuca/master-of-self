import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { JournalEntrySection } from "@components/journal/JournalEntrySection";
import { JournalEntryHabits } from "@components/journal/JournalEntryHabits";
// import { JournalEntryActions } from "@components/journal/JournalEntryActions";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { FaBoltLightning, FaSun, FaMoon, FaStar } from "react-icons/fa6";
import { Shell } from "lucide-react";
import { GiPrayer, GiBackup } from "react-icons/gi";
import { calculateHabitsXpSumsFromActions } from "@lib/level";
import { Session, JournalEntryMetadata } from "@app/types/types";

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
  } = journalEntry;

  const entryDate = new Date(createDate);
  const currentDate = new Date();
  const isToday =
    entryDate.toLocaleDateString() === currentDate.toLocaleDateString();
  const day = entryDate.getDate();
  const dayOfWeek = entryDate
    .toLocaleString("default", { weekday: "short" })
    .toUpperCase();

  const habitsXpFromActions = nightEntry?.actions
    ? calculateHabitsXpSumsFromActions(nightEntry.actions, dailyWillpower)
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

              <div className="h-full flex items-start ml-4 space-x-2 text-white">
                <>
                  {dayEntries > 0 ? (
                    <div className="w-6 h-6 rounded-full bg-yellow-500">
                      {dayEntries}
                    </div>
                  ) : null}
                </>
                <>
                  {completedDailyToDos().length > 0 ? (
                    <div className="w-6 h-6 rounded-full bg-[linear-gradient(to_right,_#eab308_50%,_#a855f7_50%)]">
                      {completedDailyToDos().length}
                    </div>
                  ) : null}
                </>
                <>
                  {nightEntries > 0 ? (
                    <div className="w-6 h-6 rounded-full bg-purple-500">
                      {nightEntries}
                    </div>
                  ) : null}
                </>
              </div>
            </div>

            <div className="ml-6 flex flex-col justify-center">
              <div className="flex items-center">
                <div className="w-full flex items-center justify-center text-3xl font-bold">
                  {dailyWillpower}
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
              {/* <FaStar className="mr-2 text-muted-foreground" /> */}
              <div className="flex items-center">
                Willpower Bonus:
                <span className="ml-1 text-green-500">+{bonusWillpower}</span>
                <span className="text-primary text-xs">
                  <FaBoltLightning className="ml-1" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/*Habits*/}
        {/*a BUG here resulting in this being displayed after the habit has been deleted*/}
        {/* Should remove after the fix not to post 0 values for habits in id: xp */}
        {/* {nightEntry?.habits && Object.keys(nightEntry.habits).length > 0 && (
          <div className="mt-4 flex w-full">
            <div className="flex-shrink-0 flex items-start mr-4">
              <h2 className="flex items-center text-muted-foreground mt-1">
                <Shell className="mr-2 text-muted-foreground" size={"1rem"} />
                Habits:
              </h2>
            </div>

            <div className="flex-grow flex flex-wrap items-start">
              <JournalEntryHabits habits={nightEntry?.habits} />
            </div>
          </div>
        )} */}

        {/*Actions*/}
        <div className="flex-grow flex flex-col items-start">
          {nightEntry?.actions &&
            Object.keys(nightEntry.actions).length > 0 && (
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
                  {/* <JournalEntryActions actions={nightEntry?.actions} /> */}
                  {/* NEED TO SENT CURRENT HABIT XP at the time of the J entry */}
                  <JournalEntryHabits habitsXp={habitsXpFromActions} />
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
      <AccordionContent className="p-0">
        <hr className="mt-4" />

        {!hasContent && (
          <p className="mt-4 w-full text-center">
            You didn't write anything in your journal today.
          </p>
        )}

        {dayEntry?.gratefulFor && dayEntry?.gratefulFor.length > 0 && (
          <JournalEntrySection
            icon={<GiPrayer />}
            title="What I am grateful for today..."
            items={dayEntry?.gratefulFor}
            dayPeriod="day"
          />
        )}

        {uncompletedDailyToDos().length > 0 && (
          <JournalEntrySection
            icon={<FaSun />}
            title={"What will make today great..."}
            items={uncompletedDailyToDos()}
            dayPeriod="day"
          />
        )}

        {completedDailyToDos().length > 0 && (
          <JournalEntrySection
            icon={<FaMoon />}
            title={"What made today great..."}
            items={completedDailyToDos()}
            dayPeriod="day"
            checked
          />
        )}

        {nightEntry?.dailyHighlights &&
          nightEntry?.dailyHighlights.length > 0 && (
            <JournalEntrySection
              icon={<FaStar />}
              title="Today's highlights..."
              items={nightEntry?.dailyHighlights}
            />
          )}

        {nightEntry?.learnedToday && nightEntry?.learnedToday.length > 0 && (
          <JournalEntrySection
            icon={<GiBackup />}
            title="What have I learned today..."
            items={nightEntry?.learnedToday}
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
