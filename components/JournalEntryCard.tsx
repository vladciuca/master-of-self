import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import {
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Info } from "@components/ui/tipography";
import { FaBoltLightning, FaSun, FaMoon, FaStar } from "react-icons/fa6";

interface Session {
  user?: {
    id: string;
  };
}

type JournalEntryProps = {
  _id: string;
  createDate: Date;
  dailyWillpower: number;
  bonusWillpower: number;
  dayEntry?: {
    greatToday?: string[];
    gratefulFor?: string[];
  };
  nightEntry?: {
    dailyHighlights?: string[];
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
  const month = entryDate.toLocaleString("default", { month: "short" });

  return (
    <AccordionItem key={_id} value={_id} className="pb-0">
      <AccordionTrigger className="pb-0">
        <div className="w-full">
          <CardHeader className="px-0 py-2">
            <CardTitle className="flex mb-4">
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <div className="bg-primary text-primary-foreground h-16 w-16 rounded-sm flex flex-col justify-center items-center">
                    <div className="uppercase text-base font-medium">
                      {month}
                    </div>
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
            </CardTitle>
          </CardHeader>
          {isToday && (
            <CardFooter className="p-0 pb-4 mt-4 mb-2 w-full flex">
              {session?.user?.id === creator?._id &&
                pathName === "/journal" && (
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
            </CardFooter>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {bonusWillpower > 0 && (
          <CardDescription className="w-full text-start text-muted-foreground">
            <div className="flex items-center mt-2">
              <FaStar className="mr-2 text-muted-foreground" />
              <div>
                Willpower Bonus:
                <span className="ml-1 text-sm text-green-500 font-semibold">
                  +{bonusWillpower}
                </span>
              </div>
            </div>
          </CardDescription>
        )}
        {dayEntry?.gratefulFor && dayEntry.gratefulFor.length > 0 && (
          <>
            <div className="flex items-center mt-2">
              <FaSun className="mt-2 mr-2 text-muted-foreground" />
              <Info text={"What I am grateful for..."} />
            </div>

            <ol className="mt-2 list-decimal pl-6">
              {dayEntry.gratefulFor.map((gratefulItem, index) => (
                <li key={index}>{gratefulItem}</li>
              ))}
            </ol>
          </>
        )}

        {dayEntry?.greatToday && dayEntry.greatToday.length > 0 && (
          <>
            <div className="flex items-center mt-4">
              <FaSun className="mt-2 mr-2 text-muted-foreground" />
              <Info text={"What will make today great..."} />
            </div>

            <ol className="mt-2 list-decimal pl-6">
              {dayEntry.greatToday.map((greatItem, index) => (
                <li key={index}>{greatItem}</li>
              ))}
            </ol>
          </>
        )}

        {nightEntry?.dailyHighlights &&
          nightEntry.dailyHighlights.length > 0 && (
            <>
              <div className="flex items-center mt-4">
                <FaMoon className="mt-2 mr-2 text-muted-foreground" />
                <Info text={"Today's highlights..."} />
              </div>

              <ol className="mt-2 list-decimal pl-6">
                {nightEntry.dailyHighlights.map((highlightItem, index) => (
                  <li key={index}>{highlightItem}</li>
                ))}
              </ol>
            </>
          )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default JournalEntryCard;
