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

  const filteredHighlights = () => {
    const dailyToDos = new Set(dayEntry?.greatToday);
    const dailyHighlights = nightEntry?.dailyHighlights || [];

    return dailyHighlights.filter((item) => !dailyToDos.has(item));
  };

  const completedDailyToDos = () => {
    const dailyToDos = dayEntry?.greatToday || [];
    const dailyHighlights = nightEntry?.dailyHighlights || [];

    return dailyHighlights.filter((item) => dailyToDos.includes(item));
  };

  const filteredToDos = () => {
    const dailyToDos = dayEntry?.greatToday || [];
    const completedToDos = new Set(nightEntry?.dailyHighlights);

    return dailyToDos.filter((item) => !completedToDos.has(item));
  };

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
              <div className="h-full flex items-start ml-4 space-x-2">
                <div className="w-6 h-6 rounded-full bg-yellow-500">2</div>
                <div className="w-6 h-6 rounded-full bg-purple-500">2</div>
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

        <JournalEntrySection
          icon={<GiPrayer />}
          title="What I am grateful for today..."
          items={dayEntry?.gratefulFor}
          dayPeriod="day"
        />

        <JournalEntrySection
          icon={<FaSun />}
          title={"What will make today great..."}
          items={filteredToDos()}
          dayPeriod="day"
        />

        <JournalEntrySection
          icon={<FaMoon />}
          title={"What made today great..."}
          items={completedDailyToDos()}
          dayPeriod="day"
          checked
        />

        <JournalEntrySection
          icon={<FaStar />}
          title="Today's highlights..."
          items={filteredHighlights()}
        />

        <JournalEntrySection
          icon={<GiBackup />}
          title="What have I learned today..."
          items={nightEntry?.learnedToday}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
