import JournalSkill from "./JournalSkill";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Info } from "./ui/tipography";
import { FaSun } from "react-icons/fa";

const JournalEntryList = ({ journalEntries }) => {
  return (
    <Accordion>
      {journalEntries.map((item) => {
        const { _id, createDate, gratefulItems, habitWillpower } = item;
        const date = new Date(createDate);

        const formattedDate = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;

        return (
          <AccordionItem value={_id} className="pb-0">
            <AccordionTrigger>
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between mb-4">
                  <FaSun size={"1.5rem"} /> {formattedDate}
                </div>
                <div>
                  <JournalSkill habitWillpower={habitWillpower} />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Info text={"Grateful Items of the day:"} />
              <ol className="list-decimal px-4 mt-2">
                {gratefulItems.map((item) => (
                  <li>{item}</li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default JournalEntryList;
