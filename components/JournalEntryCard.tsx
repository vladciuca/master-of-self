import React from "react";
import Link from "next/link";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Button } from "@components/ui/button";
import { Info } from "@components/ui/tipography";
import { FaBoltLightning } from "react-icons/fa6";

type HabitCardProps = {
  id: string;
  day: number;
  month: string;
  dailyWillpower: number;
  isToday: boolean;
};

const JournalEntryCard = ({
  isToday,
  id,
  day,
  month,
  dailyWillpower,
}: HabitCardProps) => {
  return (
    <AccordionItem key={id} value={id} className="pb-0">
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
        <Info text={"Day"} />

        <Info text={"Night"} />

        <div className="mt-12">
          <Button className="mr-3" size="sm">
            <Link href={`/update-journal-entry/${id}`}>Edit</Link>
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default JournalEntryCard;
