import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Info } from "./ui/tipography";
import { FaSun } from "react-icons/fa";

const JournalEntryList = ({ journalEntries }) => {
  return (
    <Accordion className="pb-1">
      {journalEntries.map((item) => {
        const { _id, createDate, dailyWillpower } = item;
        const date = new Date(createDate);

        const formattedDate = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;

        return (
          <AccordionItem key={_id} value={_id} className="pb-0">
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
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default JournalEntryList;
