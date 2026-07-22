import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from "@components/ui/accordion";
import { IndicatorAccordionTrigger } from "@components/ui/indicator-accordion-trigger";
import { Button } from "@components/ui/button";
import { GiSpellBook } from "react-icons/gi";
import { IoHelpCircle } from "react-icons/io5";
import { Plus } from "lucide-react";

export function CreatePracticeCard({ onCreate }: { onCreate: () => void }) {
  return (
    <Accordion type="single" collapsible className="mt-2 mb-6">
      <AccordionItem
        value="create-new-practice"
        className="p-0 border-none mb-0 bg-muted/30 rounded-lg"
      >
        <IndicatorAccordionTrigger
          indicatorPosition="start"
          hideIndicator
          className="py-0 px-3"
        >
          <div className="flex items-center gap-3 w-full py-4 ">
            <GiSpellBook className="h-12 w-12 flex-shrink-0 text-primary" />
            <div className="flex-1 text-left">
              <div className="font-semibold leading-tight">
                Create a New Practice
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                1 / 1 available
                <IoHelpCircle className="h-4 w-4 text-primary group-data-[state=open]:hidden" />
              </div>
            </div>
            <Button
              variant="default"
              size="icon"
              className="rounded-full h-7 w-7 flex-shrink-0"
              aria-label="Create a new practice"
              onClick={(e) => {
                e.stopPropagation();
                onCreate();
              }}
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </Button>
          </div>
        </IndicatorAccordionTrigger>
        <AccordionContent>
          <p className="px-3 text-sm text-muted-foreground">
            Create a custom practice with your own prompt by choosing a
            Discipline and choosing your daily rhythm. Leveling up unlocks the
            ability to create new custom practices.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
