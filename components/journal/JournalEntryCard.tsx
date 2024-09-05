import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import JournalEntrySection from "@components/journal/JournalEntrySection";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Button } from "@components/ui/button";
import { FaBoltLightning, FaSun, FaMoon, FaStar } from "react-icons/fa6";
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
                <FaBoltLightning className="ml-1" />
              </div>
            </div>
          </div>
        )}
        {isToday && (
          <div className="w-full flex mt-4">
            {session?.user?.id === creator?._id && pathName === "/journal" && (
              <div>
                <Button className="mr-3" size="sm">
                  <Link href={`/update-journal-entry/${_id}`}>
                    Continue today's journal
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(journalEntry)}
                  size="sm"
                >
                  Delete
                </Button>
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
