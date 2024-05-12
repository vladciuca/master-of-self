import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@components/ui/button";
import { FaSun, FaMoon } from "react-icons/fa";

const JournalEntryCard = ({ journalEntries }) => {
  return (
    <Accordion>
      {journalEntries.map((item, index) => {
        console.log("==ITEM", item);
        const { _id, gratefulItems } = item;

        return (
          <AccordionItem value={_id}>
            <AccordionTrigger>
              <FaSun size={"2.4rem"} /> {index}
            </AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal px-6">
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

export default JournalEntryCard;
