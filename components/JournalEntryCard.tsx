import React from "react";
import Link from "next/link";
import { Info } from "@components/ui/tipography";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Button } from "@components/ui/button";
import { FaSun } from "react-icons/fa";

interface HabitCardProps {
  id: string;
  formattedDate: string;
  dailyWillpower: number;
}

const JournalEntryCard = ({
  id,
  formattedDate,
  dailyWillpower,
}: HabitCardProps) => {
  return (
    <AccordionItem key={id} value={id} className="pb-0">
      <AccordionTrigger>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-4">
            <FaSun size={"1.5rem"} /> {formattedDate}
          </div>
          <div>{dailyWillpower}</div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Info text={"Grateful Items of the day:"} />
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
