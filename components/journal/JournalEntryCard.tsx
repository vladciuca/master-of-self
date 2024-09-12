import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import JournalEntrySection from "@components/journal/JournalEntrySection";
import JournalEntryHabits from "@components/journal/JournalEntryHabits";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Button } from "@components/ui/button";
import { FaBoltLightning, FaSun, FaMoon, FaStar } from "react-icons/fa6";
import { Shell } from "lucide-react";
import { GiPrayer, GiBackup } from "react-icons/gi";
import { Session, JournalEntryMetadata } from "@/app/types/types";

type JournalEntryCardProps = {
  journalEntry: JournalEntryMetadata;
  handleDelete: (journalEntry: JournalEntryMetadata) => Promise<void>;
};

const JournalEntryCard = ({
  journalEntry,
  handleDelete,
}: JournalEntryCardProps) => {
  const { data: session } = useSession() as { data: Session | null };
  const pathName = usePathname();
  const {
    _id,
    createDate,
    dailyWillpower,
    bonusWillpower,
    dayEntry,
    nightEntry,
    creator,
  } = journalEntry;

  const entryDate = new Date(createDate);
  const currentDate = new Date();
  const isToday =
    entryDate.toLocaleDateString() === currentDate.toLocaleDateString();
  const day = entryDate.getDate();
  const dayOfWeek = entryDate
    .toLocaleString("default", { weekday: "short" })
    .toUpperCase();

  return (
    <AccordionItem key={_id} value={_id} className="p-4">
      <AccordionTrigger className="p-0 block">
        <div className="w-full">
          <div className="flex w-full justify-between">
            <div className="flex items-center">
              <div className="bg-primary text-primary-foreground h-16 w-16 rounded-sm flex flex-col justify-center items-center">
                <div className="uppercase text-base  font-semibold">
                  {dayOfWeek}
                </div>
                <div className="text-4xl font-bold">{day}</div>
              </div>
            </div>
            <div className="ml-6">
              <div className="flex items-center">
                <div className="w-full flex items-center justify-center text-3xl font-semibold">
                  {dailyWillpower}
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

        {bonusWillpower > 0 && (
          <div className="w-full text-muted-foreground mt-4">
            <div className="flex items-center">
              <FaStar className="mr-2 text-muted-foreground" />
              <div className="flex items-center">
                Willpower Bonus:
                <span className="ml-1 text-green-500 font-semibold">
                  +{bonusWillpower}
                </span>
                <span className="text-primary">
                  <FaBoltLightning className="ml-1" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/*a BUG here resulting in this being displayed after the habit has been deleted*/}
        {/* Should remove after the fix not to post 0 values for habits in id: xp */}
        {nightEntry?.habits && Object.keys(nightEntry.habits).length > 0 && (
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
        )}

        {isToday && (
          <div className="w-full flex mt-4">
            {session?.user?.id === creator?._id && pathName === "/journal" && (
              <div>
                <Button className="mr-3 mt-1" size="sm">
                  <Link href={`/update-journal-entry/${_id}`}>
                    Continue today's journal
                  </Link>
                </Button>
                {/* <Button
                  variant="ghost"
                  onClick={() => handleDelete(journalEntry)}
                  size="sm"
                >
                  Delete(TEST)
                </Button> */}
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
        />

        <JournalEntrySection
          icon={<FaSun />}
          title={"What will make today great..."}
          items={dayEntry?.greatToday}
        />

        <JournalEntrySection
          icon={<FaMoon />}
          title="Today's highlights..."
          items={nightEntry?.dailyHighlights}
        />

        <div className="mt-4">
          <div className="flex items-center mt-4">
            <GiBackup className="mr-2 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              {"What have I learned today..."}
            </div>
          </div>

          <div className="mt-2 ml-1">{nightEntry?.learnedToday}</div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default JournalEntryCard;
