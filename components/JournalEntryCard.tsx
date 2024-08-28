import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Button } from "@components/ui/button";
import { Info } from "@components/ui/tipography";
import { FaBoltLightning, FaSun, FaMoon } from "react-icons/fa6";

interface Session {
  user?: {
    id: string;
  };
}

type JournalEntryProps = {
  _id: string;
  createDate: Date;
  dailyWillpower: number;
  dayEntry?: {
    greatToday: string;
  };
  nightEntry?: {
    dailyHighlights: string;
  };
  creator?: {
    _id: string;
  };
};

type JournalEntryCardProps = {
  journalEntry: JournalEntryProps;
  handleDelete: (journalEntry: JournalEntryProps) => Promise<void>;
};

const JournalEntryCard = ({
  journalEntry,
  handleDelete,
}: JournalEntryCardProps) => {
  const { data: session } = useSession() as { data: Session | null };
  const pathName = usePathname();
  const { _id, createDate, dailyWillpower, dayEntry, nightEntry, creator } =
    journalEntry;

  const entryDate = new Date(createDate);
  const currentDate = new Date();
  const isToday =
    entryDate.toLocaleDateString() === currentDate.toLocaleDateString();
  const day = entryDate.getDate();
  const month = entryDate.toLocaleString("default", { month: "short" });

  return (
    <AccordionItem key={_id} value={_id} className="pb-0">
      <AccordionTrigger>
        <div className="flex w-full justify-between">
          <div className="flex items-center">
            <div
              className={`${
                isToday ? "bg-red-400" : "bg-primary"
              } text-primary-foreground h-16 w-16 rounded-sm flex flex-col justify-center`}
            >
              <div className="uppercase">{month}</div>
              <div className="text-4xl font-semibold">{day}</div>
            </div>
          </div>
          <div className="ml-6">
            <div className="flex items-center">
              <div className="flex items-center text-3xl">
                <FaBoltLightning className="ml-2" />
                {dailyWillpower}
              </div>
            </div>
            <div className="flex justify-end">
              <Info text={"Willpower"} />
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex items-center mt-4">
          <FaSun className="mt-2 mr-2 text-muted-foreground" />
          <Info text={"Day"} />
        </div>
        <div className="mt-2">{dayEntry?.greatToday}</div>

        <div className="flex items-center mt-4">
          <FaMoon className="mt-2 mr-2 text-muted-foreground" />
          <Info text={"Night"} />
        </div>
        <div className="mt-2">{nightEntry?.dailyHighlights}</div>
        <div className="mt-12">
          {session?.user?.id === creator?._id && pathName === "/journal" && (
            <div>
              <Button
                // onClick={() => handleEdit(habit)}
                className="mr-3"
                size="sm"
              >
                <Link href={`/update-journal-entry/${_id}`}>Edit</Link>
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
        {/* <Button className="mr-3" size="sm">
            <Link href={`/update-journal-entry/${id}`}>Edit</Link>
          </Button>
        </div> */}
      </AccordionContent>
    </AccordionItem>
  );
};

export default JournalEntryCard;
